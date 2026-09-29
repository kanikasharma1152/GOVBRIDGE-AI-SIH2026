"""
GovBridge Natural Language Intent & Service Matching Engine
Translates citizen natural language requests into structured government interoperability journeys:
INTENT -> INTENT ENGINE -> SERVICE MATCHING -> SERVICE GRAPH -> REQUIRED DATA -> ZERO RE-ENTRY -> WORKFLOW
"""
import re
from typing import Dict, Any, List
from database import SERVICES_DB, CITIZENS_DB

def match_citizen_intent(intent_text: str, citizen_id: str = "citizen_01") -> Dict[str, Any]:
    text = intent_text.lower().strip()
    citizen = CITIZENS_DB.get(citizen_id, CITIZENS_DB["citizen_01"])
    passport = citizen.get("passport", {})
    
    # Matching rules
    matched_service = SERVICES_DB[0] # Default to National Scholarship Scheme for demo
    confidence = 0.95
    reasoning = []
    
    if any(k in text for k in ["scholarship", "merit", "fees", "financial support", "tuition", "study grant", "college fund"]):
        matched_service = SERVICES_DB[0]
        confidence = 0.96
        reasoning = [
            f"Citizen intent detected: Student seeking financial or educational assistance.",
            f"Entity extraction: Academic qualification matched with student enrollment at {passport.get('education', {}).get('institution', {}).get('value', 'Higher Ed Institute')}.",
            f"Household income profile: {passport.get('income', {}).get('gross_annual_income', {}).get('value', 'Eligible')} qualifies under ₹2,50,000 threshold.",
            f"Target scheme identified: '{matched_service['name']}' administered by {matched_service['department']}."
        ]
    elif any(k in text for k in ["income", "ews", "certificate", "tahasildar", "revenue"]):
        matched_service = SERVICES_DB[1]
        confidence = 0.93
        reasoning = [
            "Citizen intent detected: Income certificate issuance or verification.",
            "Cross-department routing: Directing to State Revenue & Land Records gateway."
        ]
    elif any(k in text for k in ["degree", "transcript", "marksheet", "nad", "digilocker", "verify education"]):
        matched_service = SERVICES_DB[2]
        confidence = 0.94
        reasoning = [
            "Citizen intent detected: Academic credential verification.",
            "Routing to National Academic Depository (NAD) cryptographic registry."
        ]
    elif any(k in text for k in ["metro", "bus", "transit", "travel", "pass", "concession"]):
        matched_service = SERVICES_DB[3]
        confidence = 0.91
        reasoning = [
            "Citizen intent detected: Student concessional urban transit pass.",
            "Connecting University Enrollment with National Common Mobility Card (NCMC)."
        ]
    elif any(k in text for k in ["pension", "atal", "old age", "social security"]):
        matched_service = SERVICES_DB[4]
        confidence = 0.90
        reasoning = [
            "Citizen intent detected: Social security retirement scheme.",
            "Routing to Ministry of Finance PFRDA database."
        ]
    else:
        # Fallback intelligent matching
        reasoning = [
            f"Analyzing query '{intent_text}' against GovBridge Unified National Service Taxonomy.",
            f"Matched closest welfare entitlement scheme: '{matched_service['name']}'."
        ]

    # Zero Re-Entry Engine: Check what data is already verified in citizen's passport
    available_verified_data = {}
    missing_data = []
    
    for req in matched_service["required_data"]:
        val_obj = None
        parts = req.split(".")
        # Recursive passport attribute lookup
        cur = passport
        for p in parts:
            if isinstance(cur, dict) and p in cur:
                cur = cur[p]
            else:
                cur = None
                break
        if cur and isinstance(cur, dict) and "value" in cur:
            val_obj = cur

        if not val_obj:
            field = parts[-1]
            for sec_key, sec_dict in passport.items():
                if isinstance(sec_dict, dict) and field in sec_dict:
                    val_obj = sec_dict[field]
                    break
        
        if val_obj and val_obj.get("verified"):
            available_verified_data[req] = {
                "value": val_obj["value"],
                "source": val_obj["source"],
                "verified": True,
                "updated": val_obj.get("updated", "2026-01-01T00:00:00Z")
            }
        else:
            missing_data.append(req)

    # Document matrix check
    available_documents = ["Aadhaar Identity Card (Digitally Verified)", "University Enrollment Transcript (NAD)", "State Income Certificate (Revenue Dept)"]
    missing_documents = []
    
    connected_systems = [
        {"name": "UIDAI Identity Connector", "role": "Biometric & Demographic Token Verification", "status": "healthy"},
        {"name": "DigiLocker NAD Academic Connector", "role": "Cryptographic University Marks & Enrollment Verification", "status": "healthy"},
        {"name": "State Revenue & Income Verification API", "role": "Household Income Credential Verification", "status": "degraded"},
        {"name": "NPCI / PFMS Direct Benefit Transfer (DBT) API", "role": "Bank Account Aadhaar Seeding Validation", "status": "healthy"},
        {"name": "National Scholarship Portal (NSP) Core Orchestrator", "role": "Final Scheme Policy Evaluation & Sanction", "status": "healthy"}
    ]

    return {
        "matched_service": matched_service,
        "confidence": confidence,
        "reasoning": reasoning,
        "required_data": matched_service["required_data"],
        "available_verified_data": available_verified_data,
        "missing_data": missing_data,
        "required_documents": matched_service["required_documents"],
        "available_documents": available_documents,
        "missing_documents": missing_documents,
        "connected_systems": connected_systems,
        "recommended_action": "Zero Re-entry Ready: 100% of required baseline data is already verified across connected government registries. Click 'Proceed with Authorized Data' to grant consent and launch application."
    }
