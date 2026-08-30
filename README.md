# BIS Smart Digital Expert

**AI-Powered Technical Regulatory, Quality Control Order (QCO), and Conformity Assessment Platform for the Bureau of Indian Standards (BIS)**

Built for the Smart India Hackathon (SIH).

---

## Table of Contents

- [Overview](#overview)
- [System Architecture and Visual Workflow](#system-architecture-and-visual-workflow)
- [User Interface Previews](#user-interface-previews)
  - [1. Digital Expert Chatbot Interface](#1-digital-expert-chatbot-interface)
  - [2. Product Compliance and Gap Analysis Wizard](#2-product-compliance-and-gap-analysis-wizard)
  - [3. ISI Mark and License Verification Portal](#3-isi-mark-and-license-verification-portal)
  - [4. Deep Clause Reader and Amendment Diff Viewer](#4-deep-clause-reader-and-amendment-diff-viewer)
  - [5. Operations and Impact Metrics Dashboard](#5-operations-and-impact-metrics-dashboard)
- [How the System Works](#how-the-system-works)
  - [1. Two-Tier RAG and Strict Clause Grounding](#1-two-tier-rag-and-strict-clause-grounding)
  - [2. Regulatory Guardrails and Abstention Engine](#2-regulatory-guardrails-and-abstention-engine)
  - [3. Ephemeral DPDP Privacy Architecture](#3-ephemeral-dpdp-privacy-architecture)
  - [4. Multilingual and Voice Accessibility](#4-multilingual-and-voice-accessibility)
- [Application Pages and Modules](#application-pages-and-modules)
  - [Home and Global Search (`/`)](#home-and-global-search-)
  - [Digital Expert Chat (`/chat`)](#digital-expert-chat-chat)
  - [Standards Catalog Explorer (`/explore`)](#standards-catalog-explorer-explore)
  - [Deep Clause Viewer (`/standard/[id]`)](#deep-clause-viewer-standardid)
  - [Product Compliance Wizard (`/compliance`)](#product-compliance-wizard-compliance)
  - [ISI Mark and License Verification (`/verify`)](#isi-mark-and-license-verification-verify)
  - [Side-by-Side Standards Comparator (`/compare`)](#side-by-side-standards-comparator-compare)
  - [User Hub and DPDP Privacy Center (`/saved`)](#user-hub-and-dpdp-privacy-center-saved)
  - [Content Ops and Abstain Triage (`/admin/ops`)](#content-ops-and-abstain-triage-adminops)
  - [Impact and Telemetry Dashboard (`/admin/metrics`)](#impact-and-telemetry-dashboard-adminmetrics)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
- [Automated Evaluation and Red-Team Testing](#automated-evaluation-and-red-team-testing)
- [Statutory Disclaimer](#statutory-disclaimer)

---

## Overview

The **BIS Smart Digital Expert** is an intelligent technical compliance assistant engineered to simplify Bureau of Indian Standards (BIS) regulations, mandatory Quality Control Orders (QCOs), and conformity assessment schemes for manufacturers, testing laboratories, MSMEs, and consumers.

The platform eliminates regulatory ambiguity by providing exact clause-level citations, automated prototype gap analysis, license authenticity verification, and side-by-side standard comparisons across domestic and international specifications.

---

## System Architecture and Visual Workflow

```mermaid
graph TD
    User([Manufacturer / Lab / Consumer]) --> ClientUI[Next.js 14 Frontend Interface]
    
    subgraph Frontend_Experience [User Interface Layer]
        ClientUI --> ChatUI[Digital Expert Chat]
        ClientUI --> ExplorerUI[Standards Catalog & Deep Clause Reader]
        ClientUI --> ComplianceUI[Pre-Audit Compliance Wizard]
        ClientUI --> VerifyUI[ISI License & QR Verification]
        ClientUI --> OpsUI[Content Ops & Metrics Dashboard]
    end

    subgraph Intelligence_Layer [RAG Engine & Guardrails]
        ChatUI --> Guardrail[Anti-Prompt Injection & Red-Team Filter]
        Guardrail --> QCache{Exact & Semantic Cache Hit?}
        QCache -- Yes (58%) --> FastReturn[Instant <15ms Response (Zero Token Cost)]
        QCache -- No (42%) --> HybridSearch[Hybrid BM25 & Semantic Search]
        HybridSearch --> Grounding[Clause Citation & Grounding Synthesizer]
        HybridSearch --> AbstainCheck{Grounded in BIS Catalog?}
        AbstainCheck -- No --> AbstainFlow[Strict Abstention & SME Helpdesk Escalation]
    end

    subgraph Knowledge_Repository [Standards & Governance Store]
        HybridSearch --> BISData[(Structured BIS Standards & Gazette Diffs)]
        VerifyUI --> LicenseDB[(CM/L & CRS Verification Database)]
        ClientUI --> DPDP[(DPDP 2023 Consent & Local Retention Controller)]
    end
```

---

## User Interface Previews

### 1. Digital Expert Chatbot Interface
Interactive conversation interface with confidence grounding indicators, speech synthesis, audio readout, and direct BIS clause citations.

```
+-----------------------------------------------------------------------------------+
|  BIS Smart Digital Expert                  [ Grounding Confidence: 98% ]  [ Listen ]|
+-----------------------------------------------------------------------------------+
|                                                                                   |
|  User: What is the maximum voltage and rating covered under IS 1293:2019?         |
|                                                                                   |
|  Assistant:                                                                       |
|  According to IS 1293:2019 (Plugs and Socket-Outlets), under Clause 1.1           |
|  (Scope & Ratings) and Clause 5.1 (Standard Ratings):                            |
|                                                                                   |
|  > "Applies to plugs and fixed or portable socket-outlets for a.c. only, with a   |
|     rated voltage not exceeding 250 V and rated current up to 16 A."              |
|                                                                                   |
|  Regulatory Note: Mandatory under Electrical Accessories QCO Order 2020.          |
|  Scheme: Scheme I (ISI Mark).                                                     |
|                                                                                   |
|  Verified BIS Citations:                                                          |
|  [ IS 1293:2019 Clause 1.1 ]   [ IS 1293:2019 Clause 5.1 ]                        |
|                                                                                   |
+-----------------------------------------------------------------------------------+
|  [ Speak Question (Mic) ]  Ask about clauses, testing rules, or ISI mark... [Send]|
+-----------------------------------------------------------------------------------+
```

---

### 2. Product Compliance and Gap Analysis Wizard
Interactive parameter evaluator mapping prototype specifications against mandatory test requirements with exportable audit reports.

```
+-----------------------------------------------------------------------------------+
|  Product Conformity & Clause Checklist                                            |
|  Pre-Audit Gap Analysis Wizard                                                    |
+------------------------------------------+----------------------------------------+
|  1. Product Profile                      |  Gap-Analysis Assessment               |
|  Target Standard: IS 1293:2019           |  Product: 16A 3-Pin Smart Socket       |
|  Product: 16A 3-Pin Smart Socket         |  Readiness Score: 100% [ COMPLIANT ]   |
|                                          |                                        |
|  2. Laboratory Test Verification         |  Clause Breakdown:                     |
|  - Earthing Contact (Clause 6.1)         |  [PASS] Clause 6.1: Solid earth pin    |
|    (*) Verified Compliant  ( ) Fail      |  [PASS] Clause 28.1: Glow wire 850 C   |
|  - Glow Wire 850 C (Clause 28.1)         |  [PASS] Clause 19.1: Temp rise <= 45K  |
|    (*) Verified Compliant  ( ) Fail      |  [PASS] Clause 9.1: Gauge test passed  |
|  - Temp Rise <= 45K (Clause 19.1)        |  [PASS] Amendment 1: Shutter shield    |
|    (*) Verified Compliant  ( ) Fail      |                                        |
|                                          |  [ Save to Hub ]  [ Print / PDF Export]|
+------------------------------------------+----------------------------------------+
```

---

### 3. ISI Mark and License Verification Portal
Real-time authenticity registry validating manufacturer CM/L numbers, factory locations, validity windows, and counterfeit status.

```
+-----------------------------------------------------------------------------------+
|  BIS License & Certificate Verification                                           |
|  [ Enter CM/L Number: CM/L-8400012345 ]   [ Scan QR Code ]   [ Verify License ]   |
+-----------------------------------------------------------------------------------+
|                                                                                   |
|  License Details:                                                                 |
|  CM/L-8400012345                     STATUS: [ ACTIVE ] (Valid to: 2027-01-14)   |
|                                                                                   |
|  Brand: Anchor by Panasonic                                                       |
|  Product: 16A 3-Pin Shuttered Socket-Outlet with Switch                           |
|  Governing Standard: IS 1293:2019 (Scheme I - ISI Mark)                           |
|  Manufacturing Facility: Plot 42, GIDC Industrial Estate, Daman, India            |
|                                                                                   |
+-----------------------------------------------------------------------------------+
```

---

### 4. Deep Clause Reader and Amendment Diff Viewer
Clause-level navigation tree, standardized test callouts, embedded dimensional tables, and gazetted amendment change tracking.

```
+-----------------------------------------------------------------------------------+
|  IS 1293:2019 — Plugs and Socket-Outlets up to 250V / 16A                         |
|  [ Tabs: Clauses & Tables (7) ]   [ Amendments & Diffs (2) ]   [ Scope & Summary ]|
+-----------------------------------------------------------------------------------+
|                                                                                   |
|  [-] Clause 9.1: Dimensions and Gauge Verification           [ Mandatory Check ]  |
|      Plug pins must pass standard GO/NOT GO gauge checks under 50 N force.        |
|                                                                                   |
|      Standard Sheet Dimensional Table:                                            |
|      +---------------+---------------------------+------------------+             |
|      | Rating        | Pin Configuration         | Pin Pitch (mm)   |             |
|      +---------------+---------------------------+------------------+             |
|      | 6 A / 250 V   | 3-Pin Round (Earth, L, N) | 19.05 +- 0.15    |             |
|      | 16 A / 250 V  | 3-Pin Round (Earth, L, N) | 28.58 +- 0.20    |             |
|      +---------------+---------------------------+------------------+             |
|                                                                                   |
|  [+] Amendment No. 1 (Gazetted: 2021-06-15) — Automatic Safety Shutters           |
|                                                                                   |
+-----------------------------------------------------------------------------------+
```

---

### 5. Operations and Impact Metrics Dashboard
Operational center for monitoring query deflection, ungrounded query triage queues, and two-tier inference cost optimization.

```
+-----------------------------------------------------------------------------------+
|  National Impact & Telemetry Dashboard                                            |
+--------------------------+--------------------------+-----------------------------+
|  Total Queries Served    |  Grounding Resolution    |  Call-Center Deflection     |
|  148,290                 |  96.4% (Zero Hallucinate)|  42.8% Query Reduction      |
+--------------------------+--------------------------+-----------------------------+
|  Manufacturer Time Saved |  Query Cache Hit Rate    |  Average Inference Cost     |
|  18,400+ Hours           |  58.1% (Sub-15ms Speed)  |  < Rs 0.04 per inquiry      |
+--------------------------+--------------------------+-----------------------------+
```

---

## How the System Works

### 1. Two-Tier RAG and Strict Clause Grounding
- **Hybrid Retrieval**: Ingests structured Indian Standards broken down into hierarchical elements (Section, Clause, Sub-clause, Test Tables, and Gazette Amendments). Queries are processed using keyword scoring and semantic similarity.
- **Strict Grounding**: The system does not synthesize unverified opinions. Every assertion cites the exact Standard Code, Clause Number, and official clause title (e.g. `[IS 1293:2019 Clause 6.1]`).
- **Exact and Semantic Query Cache**: Repeated and high-frequency inquiries (such as "Is ISI mark mandatory for plugs?") are matched against an in-memory cache to return sub-20ms verified responses with zero LLM token costs.

### 2. Regulatory Guardrails and Abstention Engine
- **Strict Abstention**: When a user asks about topics outside BIS jurisdiction (such as motor vehicle penalties, taxation, or medical prescriptions), the system explicitly refuses to guess and triggers an abstention response.
- **Red-Team Defense**: Built-in regex and semantic pattern guardrails intercept prompt-injection attempts, system rule overrides, and unauthorized certificate generation requests.
- **SME Escalation**: Borderline queries provide a 1-click dispatch option to create an official support ticket for BIS Sectional Committee officers.

### 3. Ephemeral DPDP Privacy Architecture
- **DPDP Act (2023) Compliance**: Designed around purpose limitation and data minimization.
- **Configurable Retention (TTL)**: Users can configure local session storage retention (0 days for immediate wipe, 7 days, or 30 days).
- **Self-Service Rights**: Provides full JSON data export and 1-click permanent data erasure ("Right to be Forgotten").

### 4. Multilingual and Voice Accessibility
- **Supported Languages**: English, Hindi, Marathi, and Tamil with script-specific typographic line-height and font pairings (Google Noto Sans Devanagari and Noto Sans Tamil).
- **Voice Recognition (STT)**: Integrated Web Speech Recognition allowing users to speak queries.
- **Audio Readout (TTS)**: Integrated Web Speech Synthesis that reads aloud grounded answers.
- **Low-Literacy Mode**: An icon-guided mode tailored for rural artisans and small-scale manufacturers.

---

## Application Pages and Modules

### Home and Global Search (`/`)
- Hero section with a real-time semantic query input.
- Quick navigation by industry domains: Electrical, Electronics and IT (CRS), Civil and Construction, Chemicals and Plastics, and Consumer/Toy Safety.
- Feature overview cards and direct links to popular standards.

### Digital Expert Chat (`/chat`)
- Conversational interface with streaming answer synthesis.
- Grounding confidence meter showing verified percentage (e.g., 98% Grounded).
- Clickable citation badges opening cited clause content.
- Integrated voice input microphone and text-to-speech audio controls.
- Automatic escalation option when answers trigger the abstention threshold.

### Standards Catalog Explorer (`/explore`)
- Searchable directory of Indian Standards with category filtering and mandatory QCO toggles.
- Standard cards displaying standard number, publication year, department, conformity scheme, clause count, and amendment history.
- Built-in bookmarking support.

### Deep Clause Viewer (`/standard/[id]`)
- Hierarchical clause browser with real-time in-document text search.
- Standardized laboratory testing requirement callouts.
- Embedded data tables for physical dimensions, pin configurations, and compressive strengths.
- Historical amendment timeline showing gazette dates and superseded text diffs.
- Automatic Schema.org JSON-LD structured data for search engine discoverability.

### Product Compliance Wizard (`/compliance`)
- Interactive multi-parameter checklist for product prototypes.
- Automated evaluation against mandatory testing clauses.
- Live Readiness Score calculation and visual pass/fail/action-required indicators.
- Printable/PDF gap-analysis report export for factory audit readiness.

### ISI Mark and License Verification (`/verify`)
- Real-time CM/L number and CRS registration validator.
- Simulated QR code camera scanner.
- Verification cards displaying licensee identity, factory address, validity dates, and status (Active, Expired, Suspended).
- Anti-counterfeit warnings for non-existent or suspended licenses.

### Side-by-Side Standards Comparator (`/compare`)
- Multi-standard comparison tool allowing side-by-side analysis of two standards.
- Compares conformity schemes, QCO references, clause counts, and testing mandates.

### User Hub and DPDP Privacy Center (`/saved`)
- Central workspace managing bookmarked standards and saved compliance reports.
- Data export functionality (JSON format).
- Complete data purge functionality per DPDP statutory guidelines.

### Content Ops and Abstain Triage (`/admin/ops`)
- Operational triage queue for unresolved and abstained queries to guide future document ingestion.
- Live SME escalation ticket desk.
- Automated e-gazette ingestion poller status.
- Red-team security and prompt-injection interception logs.

### Impact and Telemetry Dashboard (`/admin/metrics`)
- Product KPIs: Total queries served, grounding resolution rate, citation click-through rate, and cache hit efficiency.
- National Impact KPIs: Estimated BIS call-center query deflection and manufacturer hours saved.
- Cost model telemetry breaking down inference costs across cache, fast tier, and deep reasoning tiers.

---

## Technology Stack

- **Frontend & Fullstack**: Next.js 14 (App Router, Server-Side Rendering, Static Site Generation)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom design tokens (`design-system/tokens.json`)
- **Typography**: Inter, Space Grotesk, Noto Sans Devanagari, Noto Sans Tamil
- **Icons**: Lucide React
- **Voice & Audio**: Web Speech API (SpeechRecognition and SpeechSynthesis)
- **Structured Data**: Schema.org Legislation and TechArticle JSON-LD
- **Evaluation Harness**: Python 3 test runner for gold benchmark datasets and red-team suites

---

## Getting Started

### Prerequisites
- Node.js 18+ or 20+
- Python 3.9+ (for automated eval harness)
- Git

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Nishit7658/SIH-BIS-.git
cd SIH-BIS-

# 2. Install dependencies
npm install

# 3. Run the automated evaluation suite
npm run eval

# 4. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Automated Evaluation and Red-Team Testing

The repository includes an evaluation harness to benchmark retrieval accuracy, citation grounding, and adversarial safety:

```bash
python packages/eval-harness/run_eval.py
```

### Evaluation Benchmark Criteria:
- **Gold Q&A Dataset**: 15 multi-domain regulatory test cases covering IS 1293, IS 302, IS 694, IS 14534, IS 16046, IS 269, and out-of-scope abstention checks.
- **Citation Grounding Rate**: 100%
- **Abstention Precision**: 100%
- **Red-Team Defense Rate**: 100% (Jailbreaks, fake certificate minting, and indirect prompt injections intercepted).

---

## Statutory Disclaimer

*The BIS Smart Digital Expert is an AI-assisted research and pre-compliance informational tool. It is not a statutory certifying body. For formal licensing, legal filings, or official gazette notifications, refer directly to the official Bureau of Indian Standards portal at [manakonline.in](https://www.manakonline.in) and [bis.gov.in](https://www.bis.gov.in).*
