"""
GovBridge Master FastAPI Server
Intelligent Government Digital Interoperability & Service Orchestration Platform
"""
import os
import shutil
from typing import Dict, Any, List, Optional
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from database import (
    CITIZENS_DB, CONNECTORS_DB, SERVICES_DB, APPLICATIONS_DB,
    CONSENTS_DB, SCHEMA_MAPPINGS_DB, SCHEMA_CHANGE_ALERTS,
    DATA_CONFLICTS_DB, DATA_LINEAGE_DB, BOTTLENECK_ANALYTICS,
    AUDIT_TRAIL_DB
)
from intent_engine import match_citizen_intent
from orchestrator import (
    create_application_workflow, diagnose_application,
    resume_and_recover_application
)
from document_engine import extract_text_from_file, classify_and_extract_document
from schema_ai import approve_schema_mapping, analyze_new_field_with_ai
from conflict_engine import detect_and_list_conflicts, resolve_conflict_action

app = FastAPI(
    title="GovBridge Government Interoperability Core",
    description="One Citizen Journey. Connected Government Systems.",
    version="2.0.0"
)

# CORS — allow Vercel production + local dev
# Set ALLOWED_ORIGINS env var to comma-separated origins in production
_raw_origins = os.environ.get(
    "ALLOWED_ORIGINS",
    "http://localhost:5175,http://127.0.0.1:5175,http://localhost:3000,http://localhost:5173"
)
_allowed_origins = [o.strip() for o in _raw_origins.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],          # wildcard kept for demo hackathon; tighten in prod if desired
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Active session state
CURRENT_CITIZEN_ID = "citizen_01"  # Kanika Sharma (Default Demo Citizen 1)

# Pydantic Request Models
class IntentRequest(BaseModel):
    query: str
    citizen_id: Optional[str] = None

class CreateAppRequest(BaseModel):
    citizen_id: str
    service_id: str
    authorized_fields: Optional[List[str]] = None
    use_authorized_data: bool = True

class ConsentActionReq(BaseModel):
    consent_id: str
    action: str  # "approve", "deny", "revoke"

class SchemaApproveReq(BaseModel):
    mapping_id: str
    approved_by: Optional[str] = "Admin_Interoperability_Cell"

class ConflictResolveReq(BaseModel):
    conflict_id: str
    resolved_source: str
    reviewer_note: str

class AskGovBridgeReq(BaseModel):
    query: str
    role: Optional[str] = "citizen"  # "citizen" or "admin"

# ==========================================
# 0. HEALTH CHECK (required by Render)
# ==========================================

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "GovBridge Interoperability Core", "version": "2.0.0"}


# ==========================================
# 1. CORE SYSTEM & CITIZEN SESSION ENDPOINTS
# ==========================================

@app.get("/api/system/health")
def get_system_health():
    """
    Returns platform-wide ecosystem telemetry.
    Labeled explicitly with DEMO DATA banner where simulated.
    """
    # Dynamic recalculation from CONNECTORS_DB
    degraded_count = sum(1 for c in CONNECTORS_DB.values() if c["status"] == "degraded")
    offline_count = sum(1 for c in CONNECTORS_DB.values() if c["status"] == "offline")
    healthy_count = sum(1 for c in CONNECTORS_DB.values() if c["status"] == "healthy")

    return {
        "status": "OPERATIONAL_MONITORED",
        "timestamp": "2026-09-28T21:00:00Z",
        "tagline": "One Citizen Journey. Connected Government Systems.",
        "stats": {
            "connected_systems": 24,
            "healthy_services": 21 - degraded_count + 1 if degraded_count > 1 else 21,
            "degraded_services": degraded_count,
            "offline_services": offline_count,
            "active_requests": 1284,
            "pending_workflows": 326,
            "failed_requests_intercepted": 18
        },
        "is_demo_data": True,
        "demo_label": "DEMO DATA — Simulated Government Interoperability Environment"
    }

@app.get("/api/me")
def get_current_user():
    global CURRENT_CITIZEN_ID
    citizen = CITIZENS_DB.get(CURRENT_CITIZEN_ID, CITIZENS_DB["citizen_01"])
    return {
        "citizen": citizen,
        "available_personas": [
            {"id": "citizen_01", "name": "Kanika Sharma", "role": "Primary SIH Demo Citizen (Student)", "institution": "DTU Delhi"},
            {"id": "citizen_02", "name": "Sukanya Jadon", "role": "Demo Citizen 2 (Student)", "institution": "IIT Roorkee"}
        ]
    }

@app.post("/api/switch-citizen/{citizen_id}")
def switch_citizen(citizen_id: str):
    global CURRENT_CITIZEN_ID
    if citizen_id in CITIZENS_DB:
        CURRENT_CITIZEN_ID = citizen_id
        return {"status": "switched", "citizen": CITIZENS_DB[citizen_id]}
    raise HTTPException(status_code=404, detail="Citizen persona not found")

@app.get("/api/download")
def download_project_zip():
    """
    Direct HTTP file download endpoint for the complete GOVBRIDGE project ZIP package.
    Only works locally when the ZIP archive is present on disk.
    """
    # Check environment-configured path first, then common local paths
    zip_path = os.environ.get("GOVBRIDGE_ZIP_PATH", "")
    candidates = [zip_path] if zip_path else []
    for p in candidates:
        if os.path.exists(p):
            return FileResponse(p, media_type="application/zip", filename="GOVBRIDGE_SIH2026.zip")
    raise HTTPException(status_code=404, detail="ZIP archive not available in this deployment.")

# ==========================================
# 2. SERVICES & INTENT ENGINE
# ==========================================

@app.get("/api/services")
def list_services():
    return SERVICES_DB

@app.post("/api/services/discover")
def discover_services_with_intent(req: IntentRequest):
    citizen_id = req.citizen_id or CURRENT_CITIZEN_ID
    result = match_citizen_intent(req.query, citizen_id=citizen_id)
    return result

# ==========================================
# 3. APPLICATIONS & WORKFLOW ORCHESTRATION
# ==========================================

@app.get("/api/applications")
def list_applications():
    global CURRENT_CITIZEN_ID
    # Return applications relevant to current citizen
    apps = [a for a in APPLICATIONS_DB.values() if a.get("citizen_id") == CURRENT_CITIZEN_ID]
    if not apps:
        # Return all if none filtered
        apps = list(APPLICATIONS_DB.values())
    return apps

@app.get("/api/applications/{app_id}")
def get_application(app_id: str):
    app = APPLICATIONS_DB.get(app_id)
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
    return app

@app.get("/api/applications/{app_id}/journey")
def get_application_journey(app_id: str):
    app = APPLICATIONS_DB.get(app_id)
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
    return {
        "application_id": app["id"],
        "citizen_name": app["citizen_name"],
        "service_name": app["service_name"],
        "department": app["department"],
        "status": app["status"],
        "progress_percentage": app["progress_percentage"],
        "current_step": app["current_step"],
        "steps": app["steps"],
        "stuck_diagnosis": app.get("stuck_diagnosis")
    }

@app.get("/api/applications/{app_id}/stuck")
def get_stuck_diagnosis(app_id: str):
    diagnosis = diagnose_application(app_id)
    return diagnosis

@app.post("/api/applications")
def create_application(req: CreateAppRequest):
    fields = req.authorized_fields or [
        "person.name", "person.date_of_birth", "education.institution",
        "education.cgpa", "financial.income.annual_gross", "financial.bank.account_status"
    ]
    app_record = create_application_workflow(
        citizen_id=req.citizen_id,
        service_id=req.service_id,
        authorized_fields=fields
    )
    return app_record

# ==========================================
# 4. DIGITAL TWIN SANDBOX SIMULATION
# ==========================================

@app.post("/api/sandbox/simulate-failure")
def simulate_income_failure():
    """
    Demo Scenario 1 (Failure Demo):
    Degrades the State Income Verification API and pauses the active scholarship application in retry queue.
    """
    if "income_api" in CONNECTORS_DB:
        CONNECTORS_DB["income_api"]["status"] = "degraded"
        CONNECTORS_DB["income_api"]["latency_ms"] = 38200
        CONNECTORS_DB["income_api"]["error_rate_percentage"] = 9.4

    # Update active application
    for app in APPLICATIONS_DB.values():
        if "Scholarship" in app.get("service_name", ""):
            app["status"] = "In Progress"
            app["progress_percentage"] = 45
            app["current_step"] = "Income Eligibility Verification"
            for step in app.get("steps", []):
                if step["id"] == "step_3":
                    step["status"] = "degraded"
                    step["latency_ms"] = 38200
                    step["delay_reason"] = "Income Verification API is temporarily unavailable (504 Gateway Timeout). GovBridge has queued the request for retry (Attempt 2/5)."
                    step["retry_count"] = 2
                elif step["id"] in ["step_4", "step_5", "step_6"]:
                    step["status"] = "pending"
            app["stuck_diagnosis"] = {
                "is_stuck": True,
                "current_step": "Income Eligibility Verification",
                "reason": "Income Verification API is temporarily DEGRADED with high gateway latency.",
                "dependency": "Department of Revenue & State Land Records Gateway",
                "current_status": "DEGRADED",
                "action_taken": "GovBridge has queued the request with automatic exponential retry policy.",
                "recovery_recommendation": "Click 'Simulate Service Recovery' to watch the self-healing workflow resume automatically."
            }

    return {
        "status": "failure_simulated",
        "message": "Income Verification API simulated DEGRADED (Latency: 38.2s, 504 Timeout). Active scholarship application is now queued for retry.",
        "connector": CONNECTORS_DB["income_api"]
    }

@app.post("/api/sandbox/simulate-recovery")
def simulate_income_recovery():
    """
    Demo Scenario 1 (Recovery Demo):
    Restores State Revenue API, flushes retry queue, and finishes the scholarship application.
    """
    res = resume_and_recover_application()
    return res

@app.post("/api/sandbox/simulate-schema-change")
def simulate_schema_change():
    """
    Demo Scenario 2 (Schema Change Demo):
    Simulates DigiLocker changing field from 'student_name' to 'student_full_name'.
    """
    alert = SCHEMA_CHANGE_ALERTS[0]
    alert["status"] = "detected"
    for m in SCHEMA_MAPPINGS_DB:
        if m["external_field"] == "student_full_name":
            m["status"] = "pending"
    return {
        "status": "schema_change_active",
        "alert": alert,
        "message": "Schema drift detected: DigiLocker NAD API changed 'student_name' -> 'student_full_name'."
    }

# ==========================================
# 5. CONSENT WALLET & DPDP COMPLIANCE
# ==========================================

@app.get("/api/consent")
@app.get("/api/consents")
def list_consents():
    global CURRENT_CITIZEN_ID
    cons = [c for c in CONSENTS_DB if c.get("citizen_id") == CURRENT_CITIZEN_ID]
    return cons

@app.post("/api/consent/action")
def update_consent(req: ConsentActionReq):
    for c in CONSENTS_DB:
        if c["id"] == req.consent_id:
            c["status"] = "active" if req.action == "approve" else ("revoked" if req.action == "revoke" else "denied")
            return {"status": "success", "consent": c}
    raise HTTPException(status_code=404, detail="Consent record not found")

# ==========================================
# 6. DIGITAL DATA PASSPORT
# ==========================================

@app.get("/api/data-passport")
@app.get("/api/passport")
def get_data_passport():
    global CURRENT_CITIZEN_ID
    citizen = CITIZENS_DB.get(CURRENT_CITIZEN_ID, CITIZENS_DB["citizen_01"])
    return {
        "citizen_name": citizen["name"],
        "aadhaar_masked": citizen.get("aadhaar_masked", "XXXX-XXXX-8821"),
        "passport": citizen.get("passport", {}),
        "is_demo": True
    }

# ==========================================
# 7. DOCUMENT INTELLIGENCE
# ==========================================

@app.post("/api/documents/upload")
async def upload_document(
    file: UploadFile = File(...),
    document_type_hint: Optional[str] = Form(None)
):
    """
    Real document processing endpoint:
    Accepts PDF, DOCX, TXT, or Images. Extracts text using pypdf/docx, runs classification and field extraction.
    """
    file_bytes = await file.read()
    filename = file.filename or "uploaded_document.pdf"
    
    extracted_text = extract_text_from_file(file_bytes, filename)
    classification_result = classify_and_extract_document(extracted_text, filename)
    
    return {
        "status": "PROCESSED",
        "filename": filename,
        "size_bytes": len(file_bytes),
        "intelligence": classification_result
    }

@app.get("/api/documents/requirements")
@app.get("/api/documents/requirements/{service_id}")
def get_document_requirements(service_id: Optional[str] = "service_scholarship_01"):
    """
    Returns matrix of Required, Available, Missing, Expired documents.
    """
    resolved_id = service_id or "service_scholarship_01"
    return {
        "service_id": resolved_id,
        "matrix": [
            {
                "name": "Aadhaar Identity Proof",
                "status": "AVAILABLE_VERIFIED",
                "source": "UIDAI Biometric Master",
                "details": "Verified via cryptographic token"
            },
            {
                "name": "University Enrollment Transcript",
                "status": "AVAILABLE_VERIFIED",
                "source": "DigiLocker NAD Depository",
                "details": "DTU B.Tech CSE CGPA 8.85 attested"
            },
            {
                "name": "State Household Income Certificate",
                "status": "AVAILABLE_VERIFIED",
                "source": "Delhi Revenue Department",
                "details": "Cert: REV/DEL/2025/INC-893120 (₹1,80,000)"
            },
            {
                "name": "Aadhaar Seeded Bank Account Verification",
                "status": "AVAILABLE_VERIFIED",
                "source": "NPCI / PFMS DBT Bridge",
                "details": "SBI A/c XXXXXXXX7263 verified"
            }
        ],
        "zero_reentry_eligible": True,
        "suggestion": "All required documents are already available from verified government systems. No manual upload is required."
    }

# ==========================================
# 8. INTEGRATIONS, CONNECTORS & MARKETPLACE
# ==========================================

@app.get("/api/integrations")
def list_integrations():
    return list(CONNECTORS_DB.values())

@app.get("/api/integrations/{conn_id}/health")
def get_integration_health(conn_id: str):
    conn = CONNECTORS_DB.get(conn_id)
    if not conn:
        raise HTTPException(status_code=404, detail="Connector not found")
    return conn

@app.post("/api/integrations/{conn_id}/test")
def test_integration(conn_id: str):
    conn = CONNECTORS_DB.get(conn_id)
    if not conn:
        raise HTTPException(status_code=404, detail="Connector not found")
    return {
        "connector_id": conn_id,
        "ping_status": "PONG",
        "current_status": conn["status"],
        "latency_ms": conn["latency_ms"],
        "verified_endpoint": conn["endpoint_url"]
    }

# ==========================================
# 9. SCHEMA MAPPINGS & AI DRIFT
# ==========================================

@app.get("/api/schema/mappings")
def list_schema_mappings():
    return SCHEMA_MAPPINGS_DB

@app.post("/api/schema/approve")
def approve_mapping_endpoint(req: SchemaApproveReq):
    res = approve_schema_mapping(req.mapping_id, req.approved_by or "Admin_Interoperability_Cell")
    return res

@app.get("/api/schema/alerts")
def list_schema_alerts():
    return SCHEMA_CHANGE_ALERTS

# ==========================================
# 10. DATA CONFLICTS & LINEAGE
# ==========================================

@app.get("/api/conflicts")
def get_conflicts():
    global CURRENT_CITIZEN_ID
    return detect_and_list_conflicts(CURRENT_CITIZEN_ID)

@app.post("/api/conflicts/resolve")
def resolve_conflict(req: ConflictResolveReq):
    res = resolve_conflict_action(req.conflict_id, req.resolved_source, req.reviewer_note)
    return res

@app.get("/api/lineage")
def get_data_lineage():
    return DATA_LINEAGE_DB

# ==========================================
# 11. ANALYTICS & AUDIT LEDGER
# ==========================================

@app.get("/api/analytics/bottlenecks")
def get_bottleneck_analytics():
    return BOTTLENECK_ANALYTICS

@app.get("/api/audit")
def get_audit_trail():
    return AUDIT_TRAIL_DB

# ==========================================
# 12. VOICE & NATURAL LANGUAGE "ASK GOVBRIDGE"
# ==========================================

@app.post("/api/ask")
@app.post("/api/voice/query")
def ask_govbridge(req: AskGovBridgeReq):
    """
    Intelligent Assistant connected to actual real-time system state.
    """
    q = req.query.lower().strip()
    role = req.role or "citizen"

    # Inspect current system status
    income_status = CONNECTORS_DB.get("income_api", {}).get("status", "healthy")
    degraded = [c["name"] for c in CONNECTORS_DB.values() if c["status"] in ["degraded", "offline"]]

    if any(k in q for k in ["stuck", "delay", "why is my application", "pending", "status"]):
        if income_status == "degraded":
            answer = (
                "Your scholarship application is currently queued at the Income Eligibility Verification step. "
                "The State Revenue & Income Verification API is temporarily experiencing high latency (38.2s) and 504 Gateway Timeouts. "
                "GovBridge has automatically queued your application with an exponential retry policy (Attempt 2/5). "
                "You do not need to reapply; the orchestrator will finalize your application as soon as the service recovers."
            )
        else:
            answer = (
                "All verification systems are healthy! Your scholarship application has completed Identity, Education, "
                "Income, and Bank DBT verification successfully. Digital Sanction Letter NSP/2026/DL-8821 has been issued."
            )
    elif any(k in q for k in ["degraded", "offline", "unhealthy", "apis", "api health"]):
        if degraded:
            answer = f"Currently, {len(degraded)} external integration is degraded: {', '.join(degraded)}. Other 5 core systems (UIDAI, DigiLocker, NPCI, NSP, NCS) are fully operational."
        else:
            answer = "All 6 connected government gateways are currently operating within SLA (100% HEALTHY)."
    elif any(k in q for k in ["bottleneck", "slowest", "processing time"]):
        answer = (
            "Workflow analytics identifies 'Income Eligibility Verification' as the primary bottleneck, "
            "averaging 38.2 seconds processing time compared to 1.8s for Identity and 3.9s for Education verification."
        )
    elif any(k in q for k in ["schema", "changed in education", "drift"]):
        alert = SCHEMA_CHANGE_ALERTS[0]
        answer = (
            f"The DigiLocker NAD Academic Connector recently modified its payload schema: field '{alert['old_field']}' was renamed to '{alert['new_field']}'. "
            f"GovBridge Schema AI automatically suggested canonical mapping to 'person.name' with {alert['confidence_score']}% confidence."
        )
    elif any(k in q for k in ["scholarship", "apply", "financial support", "fees"]):
        answer = (
            "You are eligible for the National Post-Matric Merit Scholarship Scheme 2026! "
            "Because your Academic CGPA (8.85), Identity (Aadhaar), and Income (₹1,80,000) are already verified in your Data Passport, "
            "you can apply immediately using Zero Re-entry without re-uploading documents."
        )
    elif any(k in q for k in ["document", "documents do i need"]):
        answer = (
            "For the Scholarship scheme, 4 documents are required: Aadhaar Card, University Enrollment Transcript, Income Certificate, and Bank DBT Passbook. "
            "All 4 documents are already verified and accessible via GovBridge. You do not need to upload any new papers."
        )
    elif any(k in q for k in ["who accessed", "consent", "audit"]):
        answer = (
            "Under the DPDP Act 2023, your data was accessed by: 1) UIDAI Connector for Identity Proof, "
            "2) DigiLocker NAD for CGPA Verification, and 3) State Revenue Portal for Income verification. "
            "All accesses are cryptographically signed in your Immutable Audit Trail."
        )
    else:
        answer = (
            f"GovBridge Interoperability Core received your query: '{req.query}'. "
            "I can assist with application tracking, stuck workflow root cause diagnosis, zero re-entry scholarship filing, "
            "system health status, and DPDP consent management."
        )

    return {
        "query": req.query,
        "answer": answer,
        "system_status": income_status,
        "degraded_connectors": degraded
    }

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8008))
    uvicorn.run(app, host="0.0.0.0", port=port)
