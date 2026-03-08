---
name: designdoc
description: Creates Proton AI solution design documents for customer implementations. Use this skill whenever a Proton team member asks to create a design document, solution design doc, SDD, or mentions creating documentation for a new customer. Triggers on phrases like "create a design doc", "generate an SDD", "make a design document for [customer]", "@designdoc", "write up a solution design for [customer]", "I need a design doc". Always invoke this skill for any design document creation request, even if the user doesn't say "skill" or "designdoc" explicitly.
---

# Design Document Generator

You are helping a Proton AI Solutions Consultant create a professional Solution Design Document (SDD) for a customer implementation. These documents define scope, deliverables, and responsibilities and serve as the Statement of Work.

Your job is to research the customer thoroughly using ProtonIQ before generating the document — the goal is to populate the SDD from what Proton already knows about this prospect or customer, not by asking the user a checklist of questions.

---

## Step 1: Minimal Intake

Ask only:
1. **Customer name** (if not already provided)
2. **Pre-sales or post-sales?**

That's it. Do not ask about scope, integrations, or optional sections — you will determine those from research.

---

## Step 2: Research the Customer in ProtonIQ

Use ProtonIQ tools to build a complete picture of this customer before writing a single word of the document. The richer your research, the more accurate the SDD.

### 2a. Find the company and deal
Use `mcp__protoniq__search` with `search_type: "companies"` to find the company record, then `mcp__protoniq__search` with `search_type: "deals"` to find the active deal. Use the returned IDs to get full context:
```
mcp__protoniq__get_context  entity: "company"  id: [company_id]
mcp__protoniq__get_context  entity: "deal"     id: [deal_id]
```

### 2b. Search Gong calls and emails
Use `mcp__protoniq__semantic_search` to mine call recordings, emails, and meeting notes for scope details. Run multiple targeted searches:
- `"[customer name] ERP integration SFTP"` — to find ERP system and integration method
- `"[customer name] ecommerce website"` — to find if eCommerce is in scope
- `"[customer name] HubSpot RingCentral Klaviyo Salesforce integration"` — to find third-party integrations
- `"[customer name] SSO single sign on"` — to find if SSO was discussed
- `"[customer name] pricing inventory API"` — to find if real-time pricing is needed
- `"[customer name] CRM import migration existing data"` — to find if an existing CRM needs to be imported (only include CRM Import section if there is a CRM already in place with data to migrate)
- `"[customer name] Outlook calendar"` — to find if calendar sync is in scope
- `"[customer name] out of scope not included"` — to find explicitly excluded items
- `"[customer name] pipeline stages custom fields automations"` — to find pipeline and workflow details
- `"[customer name] quote entry order entry quoting"` — to find if reps will create quotes in Proton (only include Quote Entry section if confirmed)
- `"[customer name] two way sync bidirectional contacts quotes"` — to find if 2-way sync was discussed (only include 2-Way Syncs section if confirmed)
- `"[customer name] order entry EDI"` — to find if order entry is relevant

Use `include_snippet: true` and `expand_queries: true` to get richer results.

### 2c. Read any existing documents
Use `mcp__protoniq__search` with `search_type: "knowledge_base"` to find any scoping docs, proposal decks, or existing SDDs for this customer. Read the most relevant ones with `mcp__protoniq__read_document`.

### 2d. Synthesize what you found
After research, determine for each optional section:
- **Include** — evidence in ProtonIQ confirms this is in scope
- **Exclude** — evidence confirms it is out of scope, OR no evidence and it's not a standard deliverable
- **Ask** — the section is relevant but ProtonIQ doesn't have enough signal to include or exclude it confidently

Only ask the user about items in the **Ask** category. Frame these as specific, targeted questions — not a generic checklist. For example: "I didn't find anything about SSO in your calls with [Customer] — is that in scope?" rather than running through every optional item.

---

## Step 3: Generate the Document

> **Note:** The full formatting logic in this skill (Steps 3 and 4b) is currently written for **pre-sales** documents. Post-sales logic will be added separately. For now, apply this workflow only to pre-sales SDDs.

### PRE-SALES DOCUMENTS

Use the master template below as the exact base. Substitute `[CUSTOMER]` with the customer name throughout. Include optional sections only where your research confirmed they are in scope. Do not include optional sections where there is no evidence, and do not include them as placeholder text or marked "(Optional)" — either include the fully written section or leave it out entirely.

For third-party integrations discovered in research, write each one in the Third-Party Software section using the standard format: Integration Purpose, Implementation Approach, Customer Responsibilities, Limitations/Scope Boundaries.

---

### MASTER TEMPLATE (Pre-Sales)

```
Proton Solutions Design Document - [CUSTOMER]

PURPOSE

The Solutions Design Document serves as a comprehensive introduction to the proposed solution to be executed between [CUSTOMER] and the PRM Solutions, Inc. ("Proton") Professional Services team. Our goal with this document is to provide stakeholders with a clear understanding of the key features and functionalities that will be delivered as part of the scoped Proton implementation.

This Solutions Design Document does not replace or modify any previously executed order forms. Terms used but not defined in this document shall have the meaning given to them in the Master Services Agreement (MSA). This Solutions Design Document is governed by and incorporates the Proton Master Software and Services Agreement v3.November.2022 (the "MSA").

The Solutions Design Document will contain a high-level definition of functional requirements to serve as a Statement of Work (SoW) that the Proton Professional Services team will utilize throughout the implementation in order to execute the agreed upon scope.

Project Duration
The length of the project is expected to be 16 weeks in total. This timeline is dependent on the Customer providing data within 2 weeks after the initial project kickoff. Delays to obtaining client data from the ERP will likely result in extension of the target go-live date for the Customer.


PROTON IMPLEMENTATION DELIVERABLES

CRM Deliverables

ERP Integration and Custom Field Ingestion

Proton will work with the [CUSTOMER] IT team to integrate with 1 ERP system ([ERP NAME]) via SFTP to provision 1 Proton instance.

*The exact number of files, file names, and metadata contained within each file are likely to change during the implementation as we adapt between our CRM data structure and the ERP data structure. The below table is meant to act as a guideline.

The following files will be delivered by the [CUSTOMER] IT team in .csv format via SFTP for daily ingestion:

File Name | Description
Customers.csv | A file containing a full list of customer/bill-to records
ShipTos.csv | A file containing a full list of ship-to records (*optional if ERP is not set up for this)
Contacts.csv | A file containing a full list of contact records
SalesReps.csv | A file containing a full list of sales rep employee records
OpenOrders.csv | A file containing all current open order lines in the system
Quotes90d.csv | A file containing a moving window of quote line records — 90 days on a rolling basis
Invoices30d.csv | A file containing a moving window of invoice line records — 30 days on a rolling basis
ItemsERP.csv | A file containing a full list of product records from the ERP or PIM
[Include ItemsEComm.csv ONLY if eCommerce is confirmed in scope]
ItemsEComm.csv | A file containing a full list of product records from the eCommerce site, inclusive of metadata, long descriptions, and image URLs

Proton will provide a Data Requirements template outlining the required and recommended metadata fields for each file during the implementation.

Activation and training of all Proton AI Sales Recommendation Models using [CUSTOMER]'s provided dataset, including:

AI Model Name | Definition | Location
Similar Items | Displays products that NLP identifies as similar to the item being viewed. | Products
Frequently Bought Together | Displays products frequently purchased in the same order as the item being viewed. | Products
Due to Reorder | Analyzes account purchasing patterns to generate reorder recommendations. | Accounts
Wallet Share | Analyzes spending across product categories to identify gaps and increase category spending. | Accounts
First Purchase | Recognizes when a customer purchases a new product for the first time and suggests complementary products. | Accounts
Quote Follow Up | Displays actionable quotes for users to follow up on. Shows if line items have been purchased since the quote was delivered. | Accounts
[Include the following two rows ONLY if eCommerce is confirmed in scope]
Viewed Online | Displays products the account has viewed on the eCommerce site. | Accounts
Complete the Cart | Displays product recommendations based on what is in the customer's eCommerce cart. | eCommerce


[Include this section ONLY if CRM import was confirmed in research]
CRM Import
Proton will do a one-off import of [CUSTOMER]'s existing CRM objects from [CRM System].
- One-off imports will be serviceable via SFTP
- Data objects imported will include: Call Notes, Opportunities, Contacts, Leads, Tasks


Implementation of the Proton CRM Sales Suite, inclusive of:
- Accounts Table / Customer Dashboards
- Leads / Prospect Tracking
- Contact Management
- AI Sales Recommendations
- Opportunity Pipeline
- Quote Follow Up
- Tasks
- Documents
- Default Reporting Dashboards + Proton BI
- User Management
- Pronto AI Agent

Opportunity Pipeline Configuration
The Proton Professional Services team will provide an Opportunity Pipeline with the following customizations:
- Opportunity Stage Names
- Opportunity Stage % Values for Forecasting
- Custom reasons for why an opportunity was won or lost
- Custom fields on Opportunities


[Include this section ONLY if Pricing/Inventory API was confirmed in research]
Pricing / Inventory API (Customer-Specific Pricing / Inventory)
Proton will support the integration of real-time customer-specific pricing data for [CUSTOMER] (assuming an ERP endpoint exists to provide pricing and inventory data for a specific customer + product SKU).
Proton will support:
- Public APIs with token-based authentication
- Private APIs with IP-whitelist connectivity
- Proton does not support VPN-based connections
[CUSTOMER] is responsible for providing Proton with the necessary path and credentials to place a GET API request using customer ID and product ID to retrieve customer-specific price and live inventory.


[Include this section ONLY if SSO was confirmed in research]
Single Sign On (SSO)
Proton and [CUSTOMER] will coordinate to integrate with the Identity Provider (IdP) used by [CUSTOMER] to complete integration work necessary for Single Sign On enablement.


[Include this section ONLY if eCommerce is confirmed in research]
API-based Ingestion of Viewed Online Sales Plays
- [CUSTOMER] will provide Proton access to the eCommerce site's public API endpoints required to enable Viewed Online tracking and product recommendation functionality
- Proton will supply API documentation outlining the required endpoints, authentication method, and data payload specifications
- [CUSTOMER] will expose the necessary events (e.g., product views, add-to-cart, purchases) via API
- Proton will advise the integration to ensure activity data is transmitted successfully and can be consumed by Proton's recommendation models
- All data exchanges will occur through Proton's secure, authenticated API endpoints as documented at api.proton.ai


[Include this section ONLY if Outlook Calendar Sync was confirmed in research]
Outlook Calendar Sync
Proton will set up a one-way integration with [CUSTOMER]'s instance of Outlook Calendar to allow tasks created in Proton to sync to Microsoft Outlook.
- Users can create tasks in Proton and optionally sync them to their Outlook calendar
- Optionally, Proton can ingest flagged emails in Outlook into Proton via email sync functionality


[Include this section ONLY if quote entry was confirmed in research — i.e., sales reps will create quotes directly in Proton and push them back to the ERP]
Quote Entry
Proton's quote entry functionality will be used so sales reps can create quotes directly in Proton CRM. Quotes will be updated back to the ERP using quote 2-way sync functionality.

[Include this section ONLY if order entry was confirmed in research — i.e., reps will enter orders directly in Proton]
Order Entry
Proton's order entry functionality will be used so sales reps can place orders directly in Proton CRM. Orders will be transmitted back to the ERP system.

[Include this section ONLY if 2-way sync was confirmed in research — typically accompanies Quote Entry or Order Entry]
2-Way (Bidirectional) Syncs
Two-way synchronization will be supported via Proton Professional Services for only the following objects:
- Contacts
- Quotes

Two-way synchronization for any other objects will not be serviceable through Professional Services unless an additional statement of work is agreed upon and signed. Additional two-way synchronization capabilities may be self-serve using Proton's official APIs (api.proton.ai).

Miscellaneous
- More frequent data syncs (multiple per day) via SFTP will not be supported
- Customer-facing custom data freshness indicators will not be supported


[Include THIRD-PARTY SOFTWARE section ONLY if third-party integrations were confirmed in research. If no integrations, omit this section entirely.]
THIRD-PARTY SOFTWARE

The Third-Party Software section provides a high-level system architecture and outlines each use case that requires an integration between a third-party system and Proton.

[For each confirmed integration, write it using the following format. Use a process-focused approach — explain how the integration works in plain language so a non-technical reader can understand it. If specific API endpoints, authentication methods, or technical callouts were mentioned in Gong calls or emails, include them since they are critical to understanding how the integration will be set up.]

Integration #[N]: [Integration Name]
Integration Purpose: [What the integration does and why it is being set up — written in plain business terms]
Implementation Approach: [How the integration will work, step by step, in plain language. Include any specific endpoints, authentication methods, or technical details that were called out in discovery calls, since these are important for setup.]
[CUSTOMER] Responsibilities: [What the customer must provide or do — credentials, field mappings, IT contacts, access grants, etc.]
Limitations / Scope Boundaries: [What is explicitly NOT included — one-way vs. two-way, excluded objects, unsupported data types, etc.]


STAKEHOLDER REGISTER

The following individuals from [CUSTOMER] will be engaged with the Proton team throughout the implementation:

Role | Description
[CUSTOMER] IT Stakeholder | The Primary IT Stakeholder is responsible for facilitating data extraction and data validation with the Proton team.
[CUSTOMER] Sales Stakeholder | The Primary Sales Stakeholder is responsible for facilitating change management, platform adoption, and business process improvement.
Proton Project Manager | Weekly syncs with Sales and IT stakeholders; System readiness and review with executive stakeholders; Guided enablement training with Super Users (Proton Gurus); Hypercare and stabilization.
Proton Data Engineer | Data validation and mapping into Proton; Data ingest and recurring ingest setup; eCommerce integration setup (if applicable).

Both the [CUSTOMER] IT Stakeholder and Sales Stakeholder should be expected to attend weekly touchpoints with the Proton implementation team to answer questions and receive project updates.


PROTON GURU TRAINING, END USER TRAINING, AND ENABLEMENT

Guru (Admin) Training Sessions
- Led by Proton's Customer Success team at no additional cost
- Focused on empowering [CUSTOMER]'s internal Guru (Admin) team to manage Proton post-launch
- Customer Success Manager will work directly with Gurus/champions to create specific workflow and KPI recommendations
- Topics covered: Proton Workflows and Analytics; User Management, Filters, and Configurations; Reviewing KPIs, Usage Metrics, and Adoption Insights; Troubleshooting and Escalation Paths

(Optional) End-User (Sales Rep) Training
- "Train-the-Trainer" approach: Proton's Customer Success team trains [CUSTOMER]'s sales leaders
- After Guru training, [CUSTOMER]'s internal team leads end-user rollout
- Proton can facilitate additional training upon request; this requires an addendum with additional cost to be communicated by the CSM

Proton Solution Documentation
- Proton User Guide: A flexible training resource for Gurus and end users with detailed walkthroughs of key features and workflows
- Proton Help Center (at no additional cost): On-demand library of step-by-step articles, videos, and best practices


SCOPE OF SERVICES

The scope of Professional Services ("Services") is limited to completion of the projects listed above. Services only include completion of the project according to technical requirements outlined in the Solutions Design Document; additional future changes due to changing customer needs are not included and are subject to additional scoping and fees.

[CUSTOMER] is required to provide (at minimum) one technical contact for the duration of the project. Extraction of data from ERP and other third-party sources is the Customer's responsibility. Data not provided in a timely manner is the responsibility of the client and does not constitute any financial discounts if customer delays exist.

Significant changes to project scope, incorrect assumptions, or missing prerequisites may affect the cost, resources, or schedule. Any such modification shall be memorialized in a mutually executed Change Order that details material changes.


SOLUTION ARCHITECTURE DIAGRAM

[Diagram to be inserted here]


PROTON INTERNAL REVIEW

Proton Implementation Plan Reviewed By:
Date:
```

---

### POST-SALES DOCUMENTS

For post-sales, the structure is the same but focus on what is being *implemented* based on the signed order form scope. Use `mcp__protoniq__read_document` to read a reference doc from the post-sales templates folder (`1aPMMGXlktpYXRuyknEdENNmEdtxNv6UZ`) for style reference. Apply the same research-first approach — search ProtonIQ for implementation kickoff calls, scoping notes, and order form details to populate the document accurately.

---

## Step 4: Create the Google Doc

Use `mcp__protoniq__create_document`:
- **Title:** `Solutions Design Document - [Customer Name] - [YYYY-MM-DD]`
- Pass the full generated content as `body_text`

**Tell the user to move the doc to the correct output folder:**
- Pre-sales output: `1A7BYEq5Ug45slFnsWrJRytc8XvdQfTii`
- Post-sales output: `18XmbEqvCPp55WluIWn3XRy4Gj8LOUCxc`

---

## Step 4b: Apply Formatting

After creating the document, apply the following formatting using ProtonIQ tools. Read the document in structured mode first to get exact indices, then apply all changes. **Re-read after any insert/delete operation** since indices shift.

### Paragraph styles
Use `mcp__protoniq__format_paragraph` with `operation: "style"`:
- Title line → `TITLE` + `alignment: "CENTER"`
- `PURPOSE` → `HEADING_1`
- `PROTON IMPLEMENTATION DELIVERABLES` → `HEADING_1`
- `CRM Deliverables` → `HEADING_3`
- `STAKEHOLDER REGISTER` → `HEADING_1`
- `PROTON GURU TRAINING, END USER TRAINING, AND ENABLEMENT` → `HEADING_1`
- `SCOPE OF SERVICES` → `HEADING_1`
- `SOLUTION ARCHITECTURE DIAGRAM` → `HEADING_1`
- `PROTON INTERNAL REVIEW` → `HEADING_1`
- (If present) `THIRD-PARTY SOFTWARE` → `HEADING_1`; each `Integration #N:` line → `HEADING_2`

`Project Duration` is an inline sub-header (not a heading style). Format it at **14pt, not bold** using `mcp__protoniq__format_text` with `font_size: 14, bold: false`. After the "Project Duration" line, insert one blank paragraph using `mcp__protoniq__insert_text` so there is visual spacing before the project duration body text.

### Global font + color
Use `mcp__protoniq__format_text` on the entire document range:
- `font_family: "Cabin"`, `foreground_color: "#0D0746"`

### Bold inline text
Apply `bold: true` to:
- The customer name wherever it appears in the title
- `PRM Solutions, Inc.` in the PURPOSE paragraph
- `Project Duration` (inline sub-header)
- `ERP Integration and Custom Field Ingestion` (bullet header)
- `AI Sales Recommendation Models` (inline within the activation paragraph)
- `AI Model Activation` (bullet header)
- `Opportunity Pipeline Configuration` (bullet header)
- `Quote Entry` (bullet header)
- `2-Way (Bidirectional) Syncs` (bullet header)
- `Miscellaneous` (bullet header)
- `Guru (Admin) Training Sessions` (sub-header)
- `Proton Solution Documentation` (sub-header)
- The header row text in each table (File Name, Description, AI Model Name, Definition, Location, Role)

### Hyperlinks
Use `mcp__protoniq__format_text` with `link` + `foreground_color: "#0b56c4"`:
- `Proton Master Software and Services Agreement v3.November.2022` → `https://www.proton.ai/msa-v3-nov-2022`
- `api.proton.ai` (in the 2-Way Syncs section) → `https://api.proton.ai`

### Tables
Replace each pipe-separated block with a real Google Docs table using `mcp__protoniq__manage_tables`. For each table:
1. Find the index of the first pipe-separated row (e.g. "File Name | Description\n")
2. Insert a table at that index with `operation: "insert_table"`
3. Fill each cell using `mcp__protoniq__insert_text` at the correct cell indices (read doc after insert to get cell indices)
4. Style the header row cells: bold, `foreground_color: "#FFFFFF"` (white text), `font_family: "Cabin"`
5. Delete the old pipe-separated text rows (work bottom-to-top to preserve indices)
6. **Note:** Cell background color (`#0d0745` dark navy) cannot be set programmatically — tell the user to manually select each header row and apply background color `#0d0745` using the Google Docs toolbar color bucket

**SFTP Files table** (2 columns × 9 rows — header + 8 file rows):
- Header: File Name | Description
- Rows: Customers.csv, ShipTos.csv, Contacts.csv, SalesReps.csv, OpenOrders.csv, Quotes90d.csv, Invoices30d.csv, ItemsERP.csv
- If eCommerce is in scope, add a 10th row: ItemsEComm.csv | A file containing a full list of product records from the eCommerce site, inclusive of metadata, long descriptions, and image URLs

**AI Models table** (3 columns × N rows — header + one row per model):
- Header: AI Model Name | Definition | Location
- Rows: Similar Items, Frequently Bought Together, Due to Reorder, Wallet Share, First Purchase, Quote Follow Up
- If eCommerce in scope, add: Viewed Online, Complete the Cart

**Stakeholder Register table** (2 columns × 5 rows — header + 4 stakeholder rows):
- Header: Role | Description
- Rows: [CUSTOMER] IT Stakeholder, [CUSTOMER] Sales Stakeholder, Proton Project Manager, Proton Data Engineer

### Bullet indentation
For every bullet paragraph: first `operation: "remove_bullets"`, then `operation: "add_bullets"` with `bullet_preset: "BULLET_DISC_CIRCLE_SQUARE"` and `indent_first_line: -18`. Set `indent_start` by level:
- **Level 0** (top-level section headers — ERP Integration, AI models intro, Implementation of CRM Suite, Opportunity Pipeline Configuration, Miscellaneous, Guru Training Sessions, End-User Training, Proton Solution Documentation): `indent_start: 36`
- **Level 1** (direct sub-items under a Level 0 header): `indent_start: 72`
- **Level 2** (sub-items under Level 1 — asterisk disclaimer, pipeline customization items): `indent_start: 108`

Apply the MSA hyperlink color AFTER the global Cabin/#0D0746 pass — two steps:
1. Reset the full phrase "the Proton Master Software and Services Agreement v3.November.2022" to `#0D0746`
2. Then apply `#0b56c4` + link `https://www.proton.ai/msa-v3-nov-2022` to ONLY "Proton Master Software and Services Agreement v3.November.2022" (excluding the word "the " before it)

### Table of Contents
A real Google Docs TOC cannot be inserted programmatically. Tell the user to manually add it: in Google Docs, place the cursor after the title line, then go to **Insert > Table of contents**.

---

## Step 5: Deliver

Share back:
- Document title
- Direct Google Doc link
- Which output folder to move it to
- 2-3 bullet summary of what was included so the user can quickly sanity-check it
- Any gaps you couldn't fill from ProtonIQ (so the user knows what to manually review in the doc)

If in Slack, use `mcp__claude_ai_Slack__slack_send_message` to post the link.
