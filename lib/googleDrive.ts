import { google, docs_v1 } from "googleapis";

const TEMPLATES_FOLDER_ID = process.env.GOOGLE_DRIVE_TEMPLATES_FOLDER_ID!;
const OUTPUT_FOLDER_ID = process.env.GOOGLE_DRIVE_OUTPUT_FOLDER_ID!;

function getAuthClient() {
  return new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(
        /\\n/g,
        "\n"
      ),
    },
    scopes: [
      "https://www.googleapis.com/auth/drive",
      "https://www.googleapis.com/auth/documents",
    ],
  });
}

// Fetch content from template/training docs to use as context for Claude
export async function getTemplateContext(): Promise<string> {
  const auth = getAuthClient();
  const drive = google.drive({ version: "v3", auth });
  const docs = google.docs({ version: "v1", auth });

  const res = await drive.files.list({
    q: `'${TEMPLATES_FOLDER_ID}' in parents and mimeType='application/vnd.google-apps.document' and trashed=false`,
    fields: "files(id, name)",
    pageSize: 20,
  });

  const files = res.data.files ?? [];
  const contexts: string[] = [];

  for (const file of files.slice(0, 4)) {
    try {
      const doc = await docs.documents.get({ documentId: file.id! });
      const text = extractDocText(doc.data);
      contexts.push(`=== ${file.name} ===\n${text.slice(0, 6000)}`);
    } catch {
      // Skip files that can't be read
    }
  }

  return contexts.join("\n\n");
}

function extractDocText(doc: docs_v1.Schema$Document): string {
  const content = doc.body?.content ?? [];
  const lines: string[] = [];

  for (const element of content) {
    if (element.paragraph) {
      const text = element.paragraph.elements
        ?.map((e) => e.textRun?.content ?? "")
        .join("");
      if (text?.trim()) lines.push(text.trim());
    }
  }

  return lines.join("\n");
}

// Create a new Google Doc in the output folder with the generated content
export async function createGoogleDoc(
  title: string,
  content: string
): Promise<string> {
  const auth = getAuthClient();
  const drive = google.drive({ version: "v3", auth });
  const docs = google.docs({ version: "v1", auth });

  // Create the doc
  const createRes = await drive.files.create({
    requestBody: {
      name: title,
      mimeType: "application/vnd.google-apps.document",
      parents: [OUTPUT_FOLDER_ID],
    },
    fields: "id, webViewLink",
  });

  const docId = createRes.data.id!;

  // Insert the content
  await docs.documents.batchUpdate({
    documentId: docId,
    requestBody: {
      requests: [
        {
          insertText: {
            location: { index: 1 },
            text: content,
          },
        },
      ],
    },
  });

  return createRes.data.webViewLink ?? `https://docs.google.com/document/d/${docId}`;
}
