---
name: designdoc
description: Creates Proton AI solution design documents for customer implementations. Use this skill whenever a Proton team member asks to create a design document, solution design doc, SDD, or mentions creating documentation for a new customer. Triggers on phrases like "create a design doc", "generate an SDD", "make a design document for [customer]", "@designdoc", "write up a solution design for [customer]", "I need a design doc". Always invoke this skill for any design document creation request, even if the user doesn't say "skill" or "designdoc" explicitly.
---

# Design Document Generator

You are helping a Proton AI Solutions Consultant create a professional Solution Design Document (SDD) for a customer implementation. These documents define scope, deliverables, and responsibilities and serve as the Statement of Work.

---

## Step 1: Gather Information

If not already provided, ask the user:

1. **Pre-sales or post-sales?**
   - Pre-sales = scoping a new deal for a prospect
   - Post-sales = implementing for an existing customer

2. **Customer name**

3. **Which optional sections apply?** Run through this checklist:
   - Does the customer have an existing CRM to import data from? (CRM Import)
   - Do they need real-time customer-specific pricing from the ERP? (Pricing/Inventory API)
   - Do they need Single Sign-On (SSO)?
   - Do they have an eCommerce site to integrate? (Viewed Online, Complete the Cart AI model, ItemsEComm.csv)
   - Do they need Outlook Calendar Sync?
   - Any third-party integrations? (HubSpot, RingCentral, Klaviyo, Salesforce, etc.) — for each, get: purpose, who owns each side, any known limitations

4. **ERP system name** (e.g., SAP, NetSuite, Eclipse, Epicor)

5. **Project duration** (default is 12 weeks if not specified)

6. **Any other custom scope** — automations, custom pipelines, custom fields, unique workflows

---

## Step 2: Read a Reference Document (Post-Sales Only)

For **post-sales** docs, use `mcp__protoniq__read_document` to read a relevant past document from the post-sales templates folder for style and structure reference:
- Post-sales templates folder: `1aPMMGXlktpYXRuyknEdENNmEdtxNv6UZ`

For **pre-sales** docs, skip this step — the full master template is embedded in this skill below.

---

## Step 3: Generate the Document

### PRE-SALES DOCUMENTS

Use the master template below as the exact base. Substitute `[CUSTOMER]` with the customer name throughout. Include optional sections only if confirmed in Step 1. Add any custom third-party integrations to the Third-Party Software section using the format shown.

---

### MASTER TEMPLATE (Pre-Sales)

```
Proton Solutions Design Document - [CUSTOMER]

PURPOSE

The Solutions Design Document serves as a comprehensive introduction to the proposed solution to be executed between [CUSTOMER] and the PRM Solutions, Inc. ("Proton") Professional Services team. Our goal with this document is to provide stakeholders with a clear understanding of the key features and functionalities that will be delivered as part of the scoped Proton implementation.

This Solutions Design Document does not replace or modify any previously executed order forms. Terms used but not defined in this document shall have the meaning given to them in the Master Services Agreement (MSA). This Solutions Design Document is governed by and incorporates the Proton Master Software and Services Agreement v3.November.2022 (the "MSA").

The Solutions Design Document will contain a high-level definition of functional requirements to serve as a Statement of Work (SoW) that the Proton Professional Services team will utilize throughout the implementation in order to execute the agreed upon scope.

Project Duration
The length of the project is expected to be [X] weeks in total. This timeline is dependent on the Customer providing data within 2 weeks after the initial project kickoff. Delays to obtaining client data from the ERP will likely result in extension of the target go-live date for the Customer.


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
[ItemsEComm.csv — INCLUDE ONLY IF ECOMMERCE] | A file containing a full list of product records from the eCommerce site, inclusive of metadata, long descriptions, and image URLs

Proton will provide a Data Requirements template outlining the required and recommended metadata fields for each file during the implementation.

AI Model Activation
Activation and training of all Proton AI Sales Recommendation Models using [CUSTOMER]'s provided dataset, including:

AI Model Name | Definition | Location
Similar Items | Displays products that NLP identifies as similar to the item being viewed. | Products
Frequently Bought Together | Displays products frequently purchased in the same order as the item being viewed. | Products
Due to Reorder | Analyzes account purchasing patterns to generate reorder recommendations. | Accounts
Wallet Share | Analyzes spending across product categories to identify gaps and increase category spending. | Accounts
First Purchase | Recognizes when a customer purchases a new product for the first time and suggests complementary products. | Accounts
Quote Follow Up | Displays actionable quotes for users to follow up on. Shows if line items have been purchased since the quote was delivered. | Accounts
Viewed Online | Displays products the account has viewed on the eCommerce site. [INCLUDE ONLY IF ECOMMERCE] | Accounts
Complete the Cart | Displays product recommendations based on what is in the customer's eCommerce cart. [INCLUDE ONLY IF ECOMMERCE] | eCommerce


[OPTIONAL — INCLUDE ONLY IF CRM IMPORT CONFIRMED]
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


[OPTIONAL — INCLUDE ONLY IF PRICING API CONFIRMED]
Pricing / Inventory API (Customer-Specific Pricing / Inventory)
Proton will support the integration of real-time customer-specific pricing data for [CUSTOMER] (assuming an ERP endpoint exists to provide pricing and inventory data for a specific customer + product SKU).
Proton will support:
- Public APIs with token-based authentication
- Private APIs with IP-whitelist connectivity
- Proton does not support VPN-based connections
[CUSTOMER] is responsible for providing Proton with the necessary path and credentials to place a GET API request using customer ID and product ID to retrieve customer-specific price and live inventory.


[OPTIONAL — INCLUDE ONLY IF SSO CONFIRMED]
Single Sign On (SSO)
Proton and [CUSTOMER] will coordinate to integrate with the Identity Provider (IdP) used by [CUSTOMER] to complete integration work necessary for Single Sign On enablement.


[OPTIONAL — INCLUDE ONLY IF ECOMMERCE CONFIRMED]
API-based Ingestion of Viewed Online Sales Plays
- [CUSTOMER] will provide Proton access to the eCommerce site's public API endpoints (or equivalent data feed) required to enable Viewed Online tracking and product recommendation functionality
- Proton will supply API documentation outlining the required endpoints, authentication method, and data payload specifications
- [CUSTOMER] will expose the necessary events (e.g., product views, add-to-cart, purchases) via API so Proton can receive user activity data in a secure and standardized format
- Proton will advise the integration to ensure activity data is transmitted successfully and can be consumed by Proton's recommendation models
- All data exchanges will occur through Proton's secure, authenticated API endpoints as documented at api.proton.ai


[OPTIONAL — INCLUDE ONLY IF OUTLOOK CONFIRMED]
Outlook Calendar Sync
Proton will set up a one-way integration with [CUSTOMER]'s instance of Outlook Calendar to allow tasks created in Proton to sync to Microsoft Outlook.
- Users can create tasks in Proton and optionally sync them to their Outlook calendar
- Optionally, Proton can ingest flagged emails in Outlook into Proton via email sync functionality


Quote Entry
Proton's quote entry functionality will be used so sales reps can create quotes directly in Proton CRM. Quotes will be updated back to the ERP using quote 2-way sync functionality.

2-Way (Bidirectional) Syncs
Two-way synchronization will be supported via Proton Professional Services for only the following objects:
- Contacts
- Quotes

Two-way synchronization for any other objects will not be serviceable through Professional Services unless an additional statement of work is agreed upon and signed. Additional two-way synchronization capabilities may be self-serve using Proton's official APIs (api.proton.ai).

Miscellaneous
- More frequent data syncs (multiple per day) via SFTP will not be supported
- Customer-facing custom data freshness indicators will not be supported


THIRD-PARTY SOFTWARE

The Third-Party Software section provides a high-level system architecture and outlines each use case that requires an integration between a third-party system and Proton.

[For each third-party integration, use this format:]

Integration #[N]: [Integration Name]
Integration Purpose: [What it does and why]
Implementation Approach: [How Proton will configure it — API, webhook, scheduled pull, etc. Be specific about what Proton builds.]
[CUSTOMER] Responsibilities: [What the customer must provide — API credentials, field mappings, data quality, etc.]
Limitations / Scope Boundaries: [What is explicitly NOT included. Be clear about one-way vs. two-way, what data is excluded, etc.]


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
```

---

### POST-SALES DOCUMENTS

For post-sales, use the reference document read in Step 2 as the style guide. The structure is similar but focused on what is being *implemented* (not scoped), so:
- Be more specific about exact configuration details
- Include customer-specific pipeline stages, field names, and automation logic where known
- Reference the signed order form scope
- Use the same Purpose, Deliverables, Stakeholder Register, Scope of Services structure

---

## Step 4: Create the Google Doc

Use `mcp__protoniq__create_document`:
- **Title:** `Solutions Design Document - [Customer Name] - [YYYY-MM-DD]`
- Pass the full generated content as `body_text`

**Tell the user to move the doc to the correct output folder:**
- Pre-sales output: `1A7BYEq5Ug45slFnsWrJRytc8XvdQfTii`
- Post-sales output: `18XmbEqvCPp55WluIWn3XRy4Gj8LOUCxc`

---

## Step 5: Deliver

Share back:
- Document title
- Direct Google Doc link
- Which output folder to move it to
- 2-3 bullet summary of what was scoped so the user can sanity-check it

If in Slack, use `mcp__claude_ai_Slack__slack_send_message` to post the link.
