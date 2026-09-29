# GOVBRIDGE — Master Government Interoperability Platform

> **“One Citizen Journey. Connected Government Systems.”**

GovBridge is a Government Digital Interoperability Command Center designed for the Smart India Hackathon (SIH 2026). It connects fragmented government digital systems into one unified, transparent, and resilient citizen journey.

---

## 🚀 Live Services Running

| Component | Port | Technology | URL |
| :--- | :--- | :--- | :--- |
| **Frontend UI** | `5175` | React 19, Vite, Tailwind CSS, Lucide Icons, Canvas Confetti | [http://127.0.0.1:5175/](http://127.0.0.1:5175/) |
| **Interoperability Core API** | `8008` | FastAPI, Uvicorn, Pydantic, pypdf, python-docx | [http://127.0.0.1:8008/](http://127.0.0.1:8008/) |
| **Interactive API Documentation** | `8008` | Swagger UI / OpenAPI Spec | [http://127.0.0.1:8008/docs](http://127.0.0.1:8008/docs) |

---

## 🏛️ Core Features Implemented

1. **Cinematic Launch Sequence** (`Req 4`):
   - High-tech verification checklist on boot: Service Network, API Gateway, Identity, Education, Income, Document Intelligence, Consent Engine, Workflow Orchestrator, System Health, Data Lineage, AI Intelligence.
   - Replayable anytime via the reset icon in the header.

2. **Dual-Mode Command Center** (`Req 7, 8`):
   - **Citizen Mode**: Natural Language Service Discovery, My Journey Tracker, Digital Data Passport, Consent Wallet, Document Requirements & Real OCR.
   - **Admin / Government Mode**: Interoperability Topology Graph, API Connectors, Schema AI Drift, Digital Twin Sandbox, Data Conflict Adjudication, Data Lineage, Bottleneck Analytics, Immutable Audit Ledger.

3. **Natural Language Service Discovery & Intent Engine** (`Req 9`):
   - Accepts plain-language queries: *"I want to apply for a scholarship"*, *"I need financial assistance for college tuition"*, etc.
   - Transparent reasoning pipeline: `CITIZEN INTENT → INTENT ENGINE → SERVICE MATCHING → SERVICE GRAPH → REQUIRED DATA → REQUIRED DOCUMENTS → APPLICATION WORKFLOW`.

4. **Zero Re-Entry Engine** (`Req 12`):
   - Automatically detects pre-verified attributes in citizen's Data Passport (Aadhaar demographic data, DigiLocker academic CGPA 8.85, Revenue Income Certificate ₹1,80,000, NPCI PFMS Bank Mandate).
   - Enables 1-click application submission without re-entering form data.

5. **Universal Application Journey & "Why Is My Application Stuck?"** (`Req 18, 19`):
   - Multi-ministerial timeline across UIDAI, DigiLocker, State Revenue, NPCI PFMS, and National Scholarship Portal.
   - Deep diagnostic modal inspecting live API telemetry, gateway response codes, circuit-breaker queue states, and retry count (Attempt 2/5).
   - One-click **Simulate Recovery** button with celebratory confetti upon workflow completion.

6. **Voice Government Assistant — "Ask GovBridge"** (`Req 41, 42`):
   - Real-time Speech-to-Text (Web Speech API) + Text-to-Speech voice synthesization + animated soundwave visualizer.
   - Answers questions directly grounded in actual system telemetry (e.g. *"Why is my application stuck?"*, *"Which APIs are currently degraded?"*, *"What changed in Education API schema?"*).

7. **The 4 Primary SIH Demo Scenarios**:
   - **Demo 1 — Scholarship & Outage Recovery** (`Req 49, 50`): Scholarship journey with simulated State Revenue API timeout (8.9s / 38.2s historical lag), holding state in circuit-breaker retry queue (Attempt 2/5), and self-healing recovery.
   - **Demo 2 — Schema Change Detection** (`Req 25, 51`): DigiLocker renaming `student_name` → `student_full_name`, Schema AI proposing canonical mapping to `person.name` (94% confidence), and human-in-the-loop approval.
   - **Demo 3 — Data Conflict Detection** (`Req 29, 52`): UIDAI DOB (`20 May 2005`) vs CBSE 10th Certificate (`21 May 2005`). Silent overwrite is blocked and manual adjudication is enforced.
   - **Demo 4 — Bottleneck Detection** (`Req 36, 53`): Income Verification identified as the primary 8.9s/38.2s bottleneck vs 1.4s for Identity and 1.8s for Education.

8. **Interactive 21-Step Judge Presentation Guide** (`Req 68`):
   - Click the **"Judge Presentation Flow (21 Steps)"** button in the top navigation to step through the entire SIH pitch sequence with automated screen jumps, live prompt autofills, and speaker notes.

---

## 🛠️ How to Re-Run the Platform

### Start Backend:
```powershell
cd backend
python -m uvicorn main:app --host 127.0.0.1 --port 8008
```

### Start Frontend:
```powershell
cd frontend
cmd /c "npm run dev"
```

Open your browser at **http://127.0.0.1:5175/**.

---

## 👥 Demo Citizens
- **Kanika Sharma** (Primary SIH Demo Citizen — Delhi Technological University, B.Tech CSE 3rd Year)
- **Sukanya Jadon** (Demo Citizen 2 — IIT Roorkee, B.Tech EE)

*All demo records are clearly labeled as simulated test personas.*
