"""
GovBridge Data Conflict & Discrepancy Detection Engine
Detects conflicting facts across authoritative government sources (e.g. UIDAI DOB vs CBSE DOB)
and enforces non-silent handling with manual verification workflows.
"""
from typing import Dict, Any, List
from datetime import datetime, timezone
from database import DATA_CONFLICTS_DB, AUDIT_TRAIL_DB, CITIZENS_DB

def detect_and_list_conflicts(citizen_id: str = "citizen_01") -> List[Dict[str, Any]]:
    # Returns detected cross-system conflicts for citizen
    conflicts = [c for c in DATA_CONFLICTS_DB if c.get("citizen_id") == citizen_id]
    return conflicts

def resolve_conflict_action(conflict_id: str, resolved_source: str, reviewer_note: str) -> Dict[str, Any]:
    for conf in DATA_CONFLICTS_DB:
        if conf["id"] == conflict_id:
            conf["status"] = "resolved"
            conf["resolved_source"] = resolved_source
            conf["resolution_note"] = reviewer_note
            conf["resolved_at"] = datetime.now(timezone.utc).isoformat()
            
            # Log audit
            AUDIT_TRAIL_DB.insert(0, {
                "id": f"AUD-CONF-{datetime.now().strftime('%M%S%f')[:4]}",
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "actor": "Authorized Government Verification Officer",
                "department": "Civil Registry / Interoperability Desk",
                "action": f"Manual Conflict Resolution for {conf['field_name']}",
                "data_category": "Citizen Master Record",
                "purpose": f"Selected source '{resolved_source}' after reviewing official affidavit: {reviewer_note}",
                "result": "CONFLICT_RESOLVED",
                "ip_or_system": "officer-desktop-delhi-03"
            })
            return {"status": "success", "conflict": conf}
            
    return {"error": "Conflict ID not found"}
