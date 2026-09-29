"""
GovBridge Smart Workflow Orchestrator
Handles cross-department workflow lifecycle, circuit-breaker retries, queue management,
and 'Why is my application stuck?' root cause diagnosis.
"""
from datetime import datetime, timezone
import copy
from typing import Dict, Any, Optional
from database import APPLICATIONS_DB, CONNECTORS_DB, AUDIT_TRAIL_DB, CITIZENS_DB

def create_application_workflow(citizen_id: str, service_id: str, authorized_fields: list) -> Dict[str, Any]:
    citizen = CITIZENS_DB.get(citizen_id, CITIZENS_DB["citizen_01"])
    now_iso = datetime.now(timezone.utc).isoformat()
    app_id = f"APP-GB-2026-{datetime.now().strftime('%M%S%f')[:4]}"

    income_connector = CONNECTORS_DB.get("income_api", {})
    income_status = income_connector.get("status", "healthy")

    # Build steps based on connector status
    steps = [
        {
            "id": "step_1",
            "step_name": "Identity Verification",
            "department": "Ministry of Electronics & IT (UIDAI)",
            "system_name": "UIDAI Identity Connector",
            "status": "completed",
            "timestamp": now_iso,
            "latency_ms": 112,
            "details": f"Biometric token verified for {citizen['name']}. Aadhaar cryptographically validated.",
            "retry_count": 0,
            "max_retries": 5
        },
        {
            "id": "step_2",
            "step_name": "Academic Credential Verification",
            "department": "Ministry of Education",
            "system_name": "DigiLocker NAD Academic Connector",
            "status": "completed",
            "timestamp": now_iso,
            "latency_ms": 185,
            "details": "University degree mark transcripts verified via National Academic Depository. CGPA criteria satisfied.",
            "retry_count": 0,
            "max_retries": 5
        }
    ]

    if income_status in ["degraded", "offline"]:
        steps.append({
            "id": "step_3",
            "step_name": "Income Eligibility Verification",
            "department": "Department of Revenue",
            "system_name": "State Revenue & Income Verification API",
            "status": "degraded",
            "timestamp": now_iso,
            "latency_ms": 38200,
            "details": f"External {income_connector['name']} is currently {income_status.upper()}. 504 Gateway Timeout intercepted.",
            "delay_reason": f"External service unavailable ({income_status.upper()}). GovBridge circuit breaker has queued the request with automated retry policy (Attempt 2/5).",
            "retry_count": 2,
            "max_retries": 5
        })
        steps.extend([
            {
                "id": "step_4",
                "step_name": "PFMS Direct Benefit Bank Verification",
                "department": "Ministry of Finance",
                "system_name": "NPCI / PFMS Direct Benefit Transfer (DBT) API",
                "status": "pending",
                "timestamp": "Queued",
                "latency_ms": 0,
                "details": "Pending completion of Income Verification prerequisite step.",
                "retry_count": 0,
                "max_retries": 5
            },
            {
                "id": "step_5",
                "step_name": "Comprehensive Eligibility Check",
                "department": "GovBridge Policy Engine",
                "system_name": "GovBridge Canonical Rule Evaluator",
                "status": "pending",
                "timestamp": "Queued",
                "latency_ms": 0,
                "details": "Pending multi-system data aggregation.",
                "retry_count": 0,
                "max_retries": 5
            },
            {
                "id": "step_6",
                "step_name": "Digital Sanction & Final Submission",
                "department": "National Scholarship Portal",
                "system_name": "National Scholarship Portal (NSP) Core Orchestrator",
                "status": "pending",
                "timestamp": "Queued",
                "latency_ms": 0,
                "details": "Pending final orchestration and DBT mandate submission.",
                "retry_count": 0,
                "max_retries": 5
            }
        ])
        app_status = "In Progress"
        progress = 45
        current_step = "Income Eligibility Verification"
        stuck_diagnosis = {
            "is_stuck": True,
            "current_step": "Income Eligibility Verification",
            "reason": f"Income Verification API is temporarily {income_status.upper()} (High latency / Gateway Timeout).",
            "dependency": "Department of Revenue & State Land Records Gateway",
            "current_status": income_status.upper(),
            "action_taken": "GovBridge smart orchestrator intercepted failure, queued request for automated retry, preventing workflow abortion.",
            "recovery_recommendation": "Use Admin Sandbox or click 'Simulate Service Recovery' to watch automated self-healing resume the application pipeline."
        }
    else:
        # Happy path if income API is healthy
        steps.extend([
            {
                "id": "step_3",
                "step_name": "Income Eligibility Verification",
                "department": "Department of Revenue",
                "system_name": "State Revenue & Income Verification API",
                "status": "completed",
                "timestamp": now_iso,
                "latency_ms": 420,
                "details": "Household income ₹1,80,000 verified against State Revenue digital certificate REV/DEL/2025/INC-893120.",
                "retry_count": 0,
                "max_retries": 5
            },
            {
                "id": "step_4",
                "step_name": "PFMS Direct Benefit Bank Verification",
                "department": "Ministry of Finance",
                "system_name": "NPCI / PFMS Direct Benefit Transfer (DBT) API",
                "status": "completed",
                "timestamp": now_iso,
                "latency_ms": 310,
                "details": "Aadhaar Payment Bridge System (APBS) verified active bank seeding for SBI A/c XXXXXXXX7263.",
                "retry_count": 0,
                "max_retries": 5
            },
            {
                "id": "step_5",
                "step_name": "Comprehensive Eligibility Check",
                "department": "GovBridge Policy Engine",
                "system_name": "GovBridge Canonical Rule Evaluator",
                "status": "completed",
                "timestamp": now_iso,
                "latency_ms": 85,
                "details": "All criteria passed: Merit (8.85 > 7.5), Income (₹1,80,000 < ₹2,50,000), Active DBT Mandate.",
                "retry_count": 0,
                "max_retries": 5
            },
            {
                "id": "step_6",
                "step_name": "Digital Sanction & Final Submission",
                "department": "National Scholarship Portal",
                "system_name": "National Scholarship Portal (NSP) Core Orchestrator",
                "status": "completed",
                "timestamp": now_iso,
                "latency_ms": 95,
                "details": "Application sanctioned! Digital Reference NSP-2026-DL-8821 generated. Disbursal scheduled.",
                "retry_count": 0,
                "max_retries": 5
            }
        ])
        app_status = "Completed"
        progress = 100
        current_step = "Digital Sanction & Final Submission"
        stuck_diagnosis = {
            "is_stuck": False,
            "current_step": "Digital Sanction & Final Submission",
            "reason": "All 6 interconnected systems successfully responded. No bottleneck detected.",
            "dependency": "None",
            "current_status": "HEALTHY",
            "action_taken": "Application successfully orchestrated and approved.",
            "recovery_recommendation": "None needed."
        }

    app_record = {
        "id": app_id,
        "citizen_id": citizen_id,
        "citizen_name": citizen["name"],
        "service_id": service_id,
        "service_name": "National Post-Matric Merit Scholarship Scheme 2026",
        "department": "Ministry of Education & Social Justice",
        "status": app_status,
        "created_at": now_iso,
        "updated_at": now_iso,
        "progress_percentage": progress,
        "current_step": current_step,
        "steps": steps,
        "stuck_diagnosis": stuck_diagnosis
    }

    APPLICATIONS_DB[app_id] = app_record

    # Log audit entry
    AUDIT_TRAIL_DB.insert(0, {
        "id": f"AUD-{datetime.now().strftime('%Y%m%d%H%M%S')}",
        "timestamp": now_iso,
        "actor": f"Citizen {citizen['name']}",
        "department": "Ministry of Education & Social Justice",
        "action": f"Created Application {app_id} (Zero Re-Entry)",
        "data_category": "Multi-System Orchestration",
        "purpose": "Post-Matric Scholarship Automated Filing",
        "result": "QUEUED" if app_status == "In Progress" else "COMPLETED",
        "ip_or_system": "203.0.113.44"
    })

    return app_record

def diagnose_application(app_id: str) -> Dict[str, Any]:
    app = APPLICATIONS_DB.get(app_id)
    if not app:
        return {"error": "Application not found"}

    steps = app.get("steps", [])
    degraded_steps = [s for s in steps if s.get("status") in ["degraded", "failed", "queued"]]
    
    if degraded_steps:
        target = degraded_steps[0]
        conn_id = "income_api" if "income" in target["step_name"].lower() else "bank_api"
        connector = CONNECTORS_DB.get(conn_id, {})
        return {
            "is_stuck": True,
            "application_id": app_id,
            "current_step": target["step_name"],
            "reason": target.get("delay_reason", f"{target['system_name']} is currently experiencing elevated response latency."),
            "dependency": target["department"],
            "system_name": target["system_name"],
            "current_status": connector.get("status", "DEGRADED").upper(),
            "latency_ms": connector.get("latency_ms", 38200),
            "retry_info": f"Attempt {target.get('retry_count', 2)} of {target.get('max_retries', 5)} (Next retry in 15 seconds)",
            "action_taken": "GovBridge circuit breaker held state in persistent queue; transaction was not lost.",
            "recovery_solution": "Click 'Simulate Service Recovery' below to restore Income API and watch the self-healing workflow resume automatically."
        }
    else:
        return {
            "is_stuck": False,
            "application_id": app_id,
            "current_step": app.get("current_step", "Completed"),
            "reason": "All verification nodes operating within SLA parameters.",
            "dependency": "None",
            "current_status": "HEALTHY",
            "action_taken": "None required.",
            "recovery_solution": "Application is proceeding or has reached completed milestone."
        }

def resume_and_recover_application(app_id: str = "APP-GB-2026-8821") -> Dict[str, Any]:
    now_iso = datetime.now(timezone.utc).isoformat()
    # 1. Update connector health
    if "income_api" in CONNECTORS_DB:
        CONNECTORS_DB["income_api"]["status"] = "healthy"
        CONNECTORS_DB["income_api"]["latency_ms"] = 320
        CONNECTORS_DB["income_api"]["error_rate_percentage"] = 0.4

    # 2. Advance all applications stuck on income verification
    affected_apps = []
    for aid, app in APPLICATIONS_DB.items():
        if app.get("status") != "Completed":
            for step in app.get("steps", []):
                if step["id"] == "step_3":
                    step["status"] = "completed"
                    step["latency_ms"] = 320
                    step["details"] = "Service Recovered! Household income ₹1,80,000 verified against State Revenue record REV/DEL/2025/INC-893120."
                    step["delay_reason"] = None
                elif step["id"] == "step_4":
                    step["status"] = "completed"
                    step["timestamp"] = now_iso
                    step["latency_ms"] = 280
                    step["details"] = "NPCI / PFMS DBT validated active bank seeding for SBI A/c XXXXXXXX7263."
                elif step["id"] == "step_5":
                    step["status"] = "completed"
                    step["timestamp"] = now_iso
                    step["latency_ms"] = 90
                    step["details"] = "All scheme criteria verified: Merit (8.85 CGPA), Income (₹1.8L < ₹2.5L limit), DBT Active."
                elif step["id"] == "step_6":
                    step["status"] = "completed"
                    step["timestamp"] = now_iso
                    step["latency_ms"] = 110
                    step["details"] = "Digital Sanction Letter NSP/2026/DL-8821 generated. Disbursal approved."

            app["status"] = "Completed"
            app["progress_percentage"] = 100
            app["current_step"] = "Digital Sanction & Final Submission"
            app["updated_at"] = now_iso
            app["stuck_diagnosis"] = {
                "is_stuck": False,
                "current_step": "Digital Sanction & Final Submission",
                "reason": "Recovered from transient outage. All 6 interconnected services verified successfully.",
                "dependency": "None",
                "current_status": "HEALTHY",
                "action_taken": "GovBridge auto-flushed retry queue upon detecting service recovery.",
                "recovery_solution": "Workflow completed successfully."
            }
            affected_apps.append(aid)

    # 3. Log audit event
    AUDIT_TRAIL_DB.insert(0, {
        "id": f"AUD-REC-{datetime.now().strftime('%M%S%f')[:4]}",
        "timestamp": now_iso,
        "actor": "GovBridge Self-Healing Orchestrator",
        "department": "Department of Revenue & NSP",
        "action": "Outage Recovery & Queue Flushed",
        "data_category": "Workflow Self-Healing",
        "purpose": "Resumed paused workflows after State Revenue API restored to HEALTHY status",
        "result": "AUTO_RECOVERED_SUCCESS",
        "ip_or_system": "orchestrator-queue-worker.internal"
    })

    return {
        "status": "success",
        "message": "Income API restored to HEALTHY. Queued requests automatically flushed and completed.",
        "affected_applications": affected_apps,
        "connector_status": CONNECTORS_DB["income_api"]
    }
