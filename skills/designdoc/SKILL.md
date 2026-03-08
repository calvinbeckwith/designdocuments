---
name: designdoc
description: Creates Proton AI solution design documents for customer implementations. Use this skill whenever a Proton team member asks to create a design document, solution design doc, SDD, or mentions creating documentation for a new customer. Triggers on phrases like "create a design doc", "generate an SDD", "make a design document for [customer]", "@designdoc", "write up a solution design for [customer]", "I need a design doc". Always invoke this skill for any design document creation request, even if the user doesn't say "skill" or "designdoc" explicitly.
---

# Design Document Generator

You are helping a Proton AI Solutions Consultant create a professional Solution Design Document (SDD) for a customer implementation. These documents define the scope, deliverables, and responsibilities for Proton implementations and serve as the Statement of Work.

## Step 1: Gather Information

If not already provided, ask the user for:

1. **Pre-sales or post-sales?**
   - Pre-sales = scoping a new deal (prospect not yet a customer)
   - Post-sales = implementing for an existing customer

2. **Customer name**

3. **Implementation scope** — ask them to describe freely. Useful context includes:
   - Type of implementation (CRM, eComm, integrations)
   - ERP system and integration method (SFTP, API, etc.)
   - Number and types of pipelines needed
   - Third-party integrations (Klaviyo, Salesforce, etc.)
   - Number of users / regions
   - Any known automations or custom workflows
   - Timeline expectations

Collect all of this before moving to generation — a richer brief produces a much better document.

## Step 2: Pull Template Context

Use `mcp__protoniq__semantic_search` to find relevant past design documents for reference. Search for terms related to the customer's implementation type (e.g., "CRM implementation ERP SFTP solution design", "Klaviyo integration design document", "eComm pipeline solution design").

Then use `mcp__protoniq__read_document` to read the most relevant documents found. Focus on documents that match the customer's implementation type — these teach you the right level of detail, tone, and structure Proton uses.

**Template folder IDs for reference (if semantic search doesn't surface enough):**
- Pre-sales templates: `1TXAv-sQUyVCCduLgbr9ZGYsN8fiJwSiF`
- Post-sales templates: `1aPMMGXlktpYXRuyknEdENNmEdtxNv6UZ`

## Step 3: Generate the Document

Using the template context and the user's brief, write a complete Solutions Design Document. The document should feel like it was written by an experienced Proton Solutions Consultant — specific, professional, and clear about what Proton will and won't do.

### Required Structure

**Purpose**
Explain the goal of the document, reference the MSA, and state the project duration based on scope.

**Proton Implementation Deliverables**
Break this into logical sections based on the customer's scope. Common sections include:
- ERP Integration and Custom Field Ingestion
- Pipeline / Opportunity Configuration
- Automation Workflows
- Third-Party Integrations
- Custom Fields (Account / Contact level)
- Reporting & Visibility

For each deliverable, be explicit about:
- What Proton will build/configure
- What the customer is responsible for
- Any dependencies or assumptions

**Third-Party Software** (if applicable)
List any integrations and clarify ownership of each side of the integration.

**Stakeholder Register**
Table with roles from both the customer side and Proton side (Project Manager, Data Engineer, Solutions Consultant, etc.).

**Scope of Services**
Standard closing language clarifying that scope is limited to what's in this document, changes require a Change Order, and the customer must provide a technical contact.

### Tone and Style
- Professional but not stiff
- Specific — avoid vague phrases like "Proton will support X." Say exactly what X means.
- Balanced — always pair Proton's deliverables with customer responsibilities
- Use bullet points and tables for scannability
- Bold key terms and customer/Proton names

## Step 4: Create the Google Doc

Once the content is ready, use `mcp__protoniq__create_document` to create the Google Doc:

- **Title format:** `Solutions Design Document - [Customer Name] - [YYYY-MM-DD]`
- Pass the full document content as `body_text`

After creating, use `mcp__protoniq__insert_text` if you need to append any additional sections.

**Output folders** (tell the user which folder to move the doc into after creation, or move it manually if a move tool is available):
- Pre-sales output: `1A7BYEq5Ug45slFnsWrJRytc8XvdQfTii`
- Post-sales output: `18XmbEqvCPp55WluIWn3XRy4Gj8LOUCxc`

## Step 5: Deliver

Share the Google Doc link with the user. Include:
- The document title
- A direct link to the doc
- Which output folder it should live in (so they can move it if needed)
- A brief summary of what was scoped (2-3 bullets) so they can quickly sanity-check it

If the user is in Slack, use `mcp__claude_ai_Slack__slack_send_message` to post the link to the relevant channel or thread.
