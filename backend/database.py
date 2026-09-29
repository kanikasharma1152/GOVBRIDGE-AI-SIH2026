"""
GovBridge In-Memory & Seed Database
Stores mock and live state for:
- Demo Citizens (Kanika Sharma, Sukanya Jadon)
- Connected Government Systems & APIs
- Workflows & Active Applications
- Consent Wallet records
- Canonical Schema Mappings & AI Drift Detections
- Data Lineage & Conflict records
- Immutable Audit Ledger
"""
import copy
from datetime import datetime, timezone
from typing import Dict, Any, List, Optional

# DEMO CITIZENS (Req 48)
CITIZENS_DB: Dict[str, Dict[str, Any]] = {
    "citizen_01": {
        "id": "citizen_01",
        "name": "Kanika Sharma",
        "dob": "20 May 2005",
        "gender": "Female",
        "email": "kanika.sharma@example.edu.in",
        "phone": "+91 98765 43210",
        "aadhaar_masked": "XXXX-XXXX-8821",
        "is_demo": True,
        "passport": {
            "identity": {
                "name": {"value": "Kanika Sharma", "source": "UIDAI Identity System", "verified": True, "updated": "2026-01-15T09:30:00Z"},
                "dob": {"value": "20 May 2005", "source": "UIDAI Identity System", "verified": True, "updated": "2026-01-15T09:30:00Z"},
                "gender": {"value": "Female", "source": "UIDAI Identity System", "verified": True, "updated": "2026-01-15T09:30:00Z"},
                "address": {"value": "Flat 402, Rohini Sector 9, New Delhi 110085", "source": "UIDAI Aadhaar System", "verified": True, "updated": "2026-01-15T09:30:00Z"}
            },
            "education": {
                "institution": {"value": "Delhi Technological University (DTU)", "source": "National Academic Depository (NAD)", "verified": True, "updated": "2026-02-10T14:15:00Z"},
                "enrollment_no": {"value": "DTU/2023/CSE/0842", "source": "National Academic Depository (NAD)", "verified": True, "updated": "2026-02-10T14:15:00Z"},
                "program": {"value": "B.Tech Computer Science & Engineering", "source": "National Academic Depository (NAD)", "verified": True, "updated": "2026-02-10T14:15:00Z"},
                "cgpa": {"value": "8.85 / 10.0", "source": "DigiLocker / DTU Exam Cell", "verified": True, "updated": "2026-02-10T14:15:00Z"},
                "year_of_study": {"value": "3rd Year (6th Semester)", "source": "National Academic Depository (NAD)", "verified": True, "updated": "2026-02-10T14:15:00Z"}
            },
            "income": {
                "certificate_no": {"value": "REV/DEL/2025/INC-893120", "source": "Delhi Revenue Department", "verified": True, "updated": "2025-11-20T11:00:00Z"},
                "gross_annual_income": {"value": "₹1,80,000", "source": "State Income Portal", "verified": True, "updated": "2025-11-20T11:00:00Z"},
                "valid_until": {"value": "31/03/2026", "source": "Delhi Revenue Department", "verified": True, "updated": "2025-11-20T11:00:00Z"},
                "category": {"value": "Economically Weaker Section (EWS)", "source": "Delhi Revenue Department", "verified": True, "updated": "2025-11-20T11:00:00Z"}
            },
            "bank": {
                "bank_name": {"value": "State Bank of India (SBI)", "source": "NPCI / PFMS Aadhaar Seeded Account", "verified": True, "updated": "2026-01-05T16:45:00Z"},
                "account_number_masked": {"value": "XXXXXXXX7263", "source": "NPCI PFMS", "verified": True, "updated": "2026-01-05T16:45:00Z"},
                "ifsc": {"value": "SBIN0001234", "source": "NPCI PFMS", "verified": True, "updated": "2026-01-05T16:45:00Z"},
                "aadhaar_linked": {"value": "Active & Verified", "source": "NPCI PFMS Mapper", "verified": True, "updated": "2026-01-05T16:45:00Z"}
            }
        }
    },
    "citizen_02": {
        "id": "citizen_02",
        "name": "Sukanya Jadon",
        "dob": "18/09/2004",
        "gender": "Female",
        "email": "sukanya.jadon@example.edu.in",
        "phone": "+91 91234 56789",
        "aadhaar_masked": "XXXX-XXXX-4109",
        "is_demo": True,
        "passport": {
            "identity": {
                "name": {"value": "Sukanya Jadon", "source": "UIDAI Aadhaar System", "verified": True, "updated": "2026-01-20T10:00:00Z"},
                "dob": {"value": "18/09/2004", "source": "UIDAI Aadhaar System", "verified": True, "updated": "2026-01-20T10:00:00Z"},
                "gender": {"value": "Female", "source": "UIDAI Aadhaar System", "verified": True, "updated": "2026-01-20T10:00:00Z"},
                "address": {"value": "B-12, Civil Lines, Jaipur, Rajasthan 302006", "source": "UIDAI Aadhaar System", "verified": True, "updated": "2026-01-20T10:00:00Z"}
            },
            "education": {
                "institution": {"value": "Indian Institute of Technology (IIT) Roorkee", "source": "National Academic Depository (NAD)", "verified": True, "updated": "2026-01-18T12:00:00Z"},
                "enrollment_no": {"value": "IITR/2023/EE/1920", "source": "National Academic Depository (NAD)", "verified": True, "updated": "2026-01-18T12:00:00Z"},
                "program": {"value": "B.Tech Electrical Engineering", "source": "National Academic Depository (NAD)", "verified": True, "updated": "2026-01-18T12:00:00Z"},
                "cgpa": {"value": "9.12 / 10.0", "source": "DigiLocker / IIT Roorkee", "verified": True, "updated": "2026-01-18T12:00:00Z"},
                "year_of_study": {"value": "3rd Year (6th Semester)", "source": "National Academic Depository (NAD)", "verified": True, "updated": "2026-01-18T12:00:00Z"}
            },
            "income": {
                "certificate_no": {"value": "REV/RAJ/2025/INC-441029", "source": "Rajasthan State Revenue Portal", "verified": True, "updated": "2025-10-14T09:30:00Z"},
                "gross_annual_income": {"value": "₹2,20,000", "source": "State Income Portal", "verified": True, "updated": "2025-10-14T09:30:00Z"},
                "valid_until": {"value": "31/03/2026", "source": "Rajasthan State Revenue Portal", "verified": True, "updated": "2025-10-14T09:30:00Z"},
                "category": {"value": "OBC-NCL Financial Assistance", "source": "Rajasthan State Revenue Portal", "verified": True, "updated": "2025-10-14T09:30:00Z"}
            },
            "bank": {
                "bank_name": {"value": "HDFC Bank", "source": "NPCI / PFMS Direct Benefit Transfer", "verified": True, "updated": "2026-01-10T11:20:00Z"},
                "account_number_masked": {"value": "XXXXXXXX8472", "source": "NPCI PFMS", "verified": True, "updated": "2026-01-10T11:20:00Z"},
                "ifsc": {"value": "HDFC0000240", "source": "NPCI PFMS", "verified": True, "updated": "2026-01-10T11:20:00Z"},
                "aadhaar_linked": {"value": "Active & Verified", "source": "NPCI PFMS Mapper", "verified": True, "updated": "2026-01-10T11:20:00Z"}
            }
        }
    }
}

# GOVERNMENT CONNECTORS & APIS (Req 10, 22, 26, 32, 34)
CONNECTORS_DB: Dict[str, Dict[str, Any]] = {
    "identity_api": {
        "id": "identity_api",
        "name": "UIDAI Identity Connector",
        "department": "Ministry of Electronics & IT (MeitY)",
        "category": "Identity & Biometric Authentication",
        "status": "healthy",  # healthy, degraded, offline
        "latency_ms": 112,
        "uptime_percentage": 99.85,
        "error_rate_percentage": 0.08,
        "request_volume": 42180,
        "last_successful_request": "2026-09-28T20:58:12Z",
        "authentication": "OAuth2.0 + mTLS + HMAC-SHA256 Token",
        "version": "v3.4.1",
        "endpoint_url": "https://api.uidai.gov.in/interop/v3/auth",
        "dependencies": ["Aadhaar Master HSM", "UIDAI Biometric Engine"],
        "data_provided": ["person.name", "person.date_of_birth", "person.gender", "person.address_summary"],
        "data_requested": ["aadhaar_token", "biometric_proof"],
        "is_simulated": True
    },
    "education_api": {
        "id": "education_api",
        "name": "DigiLocker NAD Academic Connector",
        "department": "Ministry of Education & DigiLocker",
        "category": "Academic Credentials & Depository",
        "status": "healthy",
        "latency_ms": 185,
        "uptime_percentage": 99.40,
        "error_rate_percentage": 0.35,
        "request_volume": 28450,
        "last_successful_request": "2026-09-28T20:59:01Z",
        "authentication": "DigiLocker Partner API Key + RSA-4096 Signature",
        "version": "v2.8.0",
        "endpoint_url": "https://nad.digilocker.gov.in/api/v2/credentials/verify",
        "dependencies": ["UGC Academic Bank of Credits (ABC)", "DigiLocker Central Vault"],
        "data_provided": ["education.institution", "education.enrollment_id", "education.degree_awarded", "education.cgpa", "education.passing_year"],
        "data_requested": ["abc_id", "aadhaar_ref"],
        "is_simulated": True
    },
    "income_api": {
        "id": "income_api",
        "name": "State Revenue & Income Verification API",
        "department": "Department of Revenue & State Land Records",
        "category": "Taxation & Economic Verification",
        "status": "degraded",  # DEMO SCENARIO: Starts degraded or can be triggered
        "latency_ms": 1420,
        "uptime_percentage": 93.80,
        "error_rate_percentage": 8.75,
        "request_volume": 14320,
        "last_successful_request": "2026-09-28T20:41:10Z",
        "authentication": "State Gateway JWT Bearer + e-Pramaan",
        "version": "v1.9.4",
        "endpoint_url": "https://revenue.state.gov.in/api/interop/income-verify",
        "dependencies": ["State Sub-Registrar Database", "Income Tax Pan-Aadhaar Linker"],
        "data_provided": ["financial.income.annual_gross", "financial.income.certificate_number", "financial.income.issue_date", "financial.income.status"],
        "data_requested": ["certificate_no", "applicant_aadhaar_hash"],
        "is_simulated": True
    },
    "bank_api": {
        "id": "bank_api",
        "name": "NPCI / PFMS Direct Benefit Transfer (DBT) API",
        "department": "Ministry of Finance & National Payments Corp (NPCI)",
        "category": "Banking & Public Financial Management",
        "status": "healthy",
        "latency_ms": 310,
        "uptime_percentage": 98.90,
        "error_rate_percentage": 1.10,
        "request_volume": 53900,
        "last_successful_request": "2026-09-28T20:57:44Z",
        "authentication": "NPCI PKI Token + Encrypted Payload",
        "version": "v4.1.0",
        "endpoint_url": "https://pfms.nic.in/api/v4/dbt/account-validation",
        "dependencies": ["Aadhaar Payment Bridge System (APBS)", "Core Banking Solution (CBS)"],
        "data_provided": ["financial.bank.account_status", "financial.bank.ifsc_valid", "financial.bank.dbt_enabled", "financial.bank.masked_acc"],
        "data_requested": ["aadhaar_hash", "ifsc_code", "bank_acc_hash"],
        "is_simulated": True
    },
    "scholarship_api": {
        "id": "scholarship_api",
        "name": "National Scholarship Portal (NSP) Core Orchestrator",
        "department": "Ministry of Social Justice & Higher Education",
        "category": "Welfare & Scholarship Schemes",
        "status": "healthy",
        "latency_ms": 95,
        "uptime_percentage": 99.92,
        "error_rate_percentage": 0.05,
        "request_volume": 67100,
        "last_successful_request": "2026-09-28T20:59:30Z",
        "authentication": "GovBridge Enterprise OAuth2.0 Token",
        "version": "v5.2.0",
        "endpoint_url": "https://scholarships.gov.in/api/v5/schemes/orchestrate",
        "dependencies": ["GovBridge Interoperability Core", "Central DBT Sanction Engine"],
        "data_provided": ["scholarship.application_id", "scholarship.eligibility_determination", "scholarship.sanction_amount"],
        "data_requested": ["person.name", "person.dob", "education.cgpa", "financial.income.annual_gross", "financial.bank.account_status"],
        "is_simulated": True
    },
    "employment_api": {
        "id": "employment_api",
        "name": "National Career Service (NCS) Connector",
        "department": "Ministry of Labour & Employment",
        "category": "Employment & Skill Registry",
        "status": "healthy",
        "latency_ms": 140,
        "uptime_percentage": 99.15,
        "error_rate_percentage": 0.40,
        "request_volume": 19200,
        "last_successful_request": "2026-09-28T20:56:15Z",
        "authentication": "NCS Secure Gateway API Token",
        "version": "v2.1.2",
        "endpoint_url": "https://ncs.gov.in/api/v2/integration/candidate-sync",
        "dependencies": ["Skill India Digital Portal", "EPFO Member Database"],
        "data_provided": ["employment.registration_status", "employment.skill_certification_count"],
        "data_requested": ["aadhaar_ref", "education.highest_qualification"],
        "is_simulated": True
    }
}

# GOVERNMENT SERVICES CATALOG (Req 11)
SERVICES_DB: List[Dict[str, Any]] = [
    {
        "id": "service_scholarship_01",
        "name": "National Post-Matric Merit Scholarship Scheme 2026",
        "department": "Ministry of Education & Social Justice",
        "category": "Scholarship & Higher Education",
        "description": "Financial scholarship grant of ₹50,000/year for undergraduate students with verified academic merit (CGPA > 7.5) and annual family income < ₹2,50,000.",
        "eligibility_criteria": [
            "Currently enrolled in recognized Indian University or Institute",
            "Minimum CGPA of 7.5 / 10.0 or 75% aggregate marks",
            "Annual family household income strictly below ₹2,50,000",
            "Valid active Aadhaar-seeded Bank Account for Direct Benefit Transfer"
        ],
        "required_data": [
            "person.name",
            "person.date_of_birth",
            "person.gender",
            "education.institution",
            "education.enrollment_id",
            "education.cgpa",
            "financial.income.annual_gross",
            "financial.bank.account_status"
        ],
        "required_documents": [
            "Aadhaar Identity Card",
            "University Enrollment / Bonafide Certificate",
            "Verified Income Certificate (valid for current financial year)",
            "Bank Passbook / Mandate Form"
        ],
        "connected_systems": [
            "UIDAI Identity Connector",
            "DigiLocker NAD Academic Connector",
            "State Revenue & Income Verification API",
            "NPCI / PFMS Direct Benefit Transfer (DBT) API",
            "National Scholarship Portal (NSP) Core Orchestrator"
        ],
        "workflow_steps": [
            "Identity Verification",
            "Academic Credential Verification",
            "Income Eligibility Verification",
            "PFMS Direct Benefit Bank Verification",
            "Comprehensive Multi-System Eligibility Check",
            "Digital Sanction & Final Submission"
        ],
        "current_status": "Active",
        "avg_processing_time": "Instant with GovBridge (Traditional: 45-60 days)"
    },
    {
        "id": "service_income_cert_02",
        "name": "State EWS / Low Income Digital Certificate Verification",
        "department": "Department of Revenue & Land Administration",
        "category": "Welfare & Economic Status",
        "description": "Cross-verification and digital issuance of verified household income credentials for state and central welfare entitlement schemes.",
        "eligibility_criteria": [
            "State resident with verified permanent address",
            "Self-declared or IT return backed family income document"
        ],
        "required_data": ["person.name", "person.address_summary", "financial.income.certificate_number"],
        "required_documents": ["Ration Card or Electricity Bill", "Salary Slip or ITR Form"],
        "connected_systems": ["UIDAI Identity Connector", "State Revenue & Income Verification API"],
        "workflow_steps": ["Identity Verification", "Sub-Registrar Cross Check", "Digital Attestation"],
        "current_status": "Degraded Latency",
        "avg_processing_time": "2 days"
    },
    {
        "id": "service_edu_verify_03",
        "name": "Higher Education Digilocker Credential Verification",
        "department": "Ministry of Education & DigiLocker",
        "category": "Academic Depository",
        "description": "Instant cryptographic verification of university degrees, marksheets, and enrollment status directly from the UGC Academic Bank of Credits.",
        "eligibility_criteria": ["Student registered on Academic Bank of Credits (ABC) / NAD"],
        "required_data": ["person.name", "education.enrollment_id", "education.institution"],
        "required_documents": ["ABC Student ID Card"],
        "connected_systems": ["UIDAI Identity Connector", "DigiLocker NAD Academic Connector"],
        "workflow_steps": ["Student Identity Match", "University Ledger Hash Check", "Signed Credential Token Generation"],
        "current_status": "Active",
        "avg_processing_time": "Under 3 seconds"
    },
    {
        "id": "service_transit_04",
        "name": "National Student Concessional Transit Mobility Pass",
        "department": "Ministry of Housing & Urban Affairs",
        "category": "Urban Mobility & Student Support",
        "description": "Integrated 75% subsidized metro and state transport smart pass for daily commuting university students.",
        "eligibility_criteria": ["Full-time college/university student in designated urban metropolitan area"],
        "required_data": ["person.name", "person.date_of_birth", "education.institution", "education.enrollment_id"],
        "required_documents": ["College ID", "Proof of Address"],
        "connected_systems": ["UIDAI Identity Connector", "DigiLocker NAD Academic Connector", "National Common Mobility Card (NCMC)"],
        "workflow_steps": ["Identity Check", "College Enrollment Confirmation", "NCMC Card Issuance"],
        "current_status": "Active",
        "avg_processing_time": "Instant Digital Card"
    },
    {
        "id": "service_pension_05",
        "name": "Atal Pension Yojana / Social Security Entitlement",
        "department": "Ministry of Finance & PFRDA",
        "category": "Social Security & Pension",
        "description": "Periodic guaranteed monthly pension entitlement registration for citizens with automated bank mandate synchronization.",
        "eligibility_criteria": ["Indian citizen aged between 18 and 40 years with active bank account"],
        "required_data": ["person.name", "person.date_of_birth", "financial.bank.account_status"],
        "required_documents": ["Aadhaar Card", "Bank Account Verification"],
        "connected_systems": ["UIDAI Identity Connector", "NPCI / PFMS Direct Benefit Transfer (DBT) API"],
        "workflow_steps": ["Identity Match", "Age Verification", "Mandate Initialization"],
        "current_status": "Active",
        "avg_processing_time": "24 hours"
    }
]

# APPLICATIONS & WORKFLOW STATES (Req 18, 19, 20)
APPLICATIONS_DB: Dict[str, Dict[str, Any]] = {
    "APP-GB-2026-8821": {
        "id": "APP-GB-2026-8821",
        "citizen_id": "citizen_01",
        "citizen_name": "Kanika Sharma",
        "service_id": "service_scholarship_01",
        "service_name": "National Post-Matric Merit Scholarship Scheme 2026",
        "department": "Ministry of Education & Social Justice",
        "status": "In Progress",  # In Progress, Completed, Delayed, Stuck
        "created_at": "2026-09-28T18:30:00Z",
        "updated_at": "2026-09-28T20:55:00Z",
        "progress_percentage": 50,
        "current_step": "Income Eligibility Verification",
        "steps": [
            {
                "id": "step_1",
                "step_name": "Identity Verification",
                "department": "Ministry of Electronics & IT (UIDAI)",
                "system_name": "UIDAI Identity Connector",
                "status": "completed",
                "timestamp": "2026-09-28T18:30:02Z",
                "latency_ms": 112,
                "details": "Aadhaar token verified via biometric hash. Name 'Kanika Sharma' matched 100%.",
                "retry_count": 0,
                "max_retries": 5
            },
            {
                "id": "step_2",
                "step_name": "Academic Credential Verification",
                "department": "Ministry of Education",
                "system_name": "DigiLocker NAD Academic Connector",
                "status": "completed",
                "timestamp": "2026-09-28T18:30:06Z",
                "latency_ms": 185,
                "details": "DTU B.Tech CSE CGPA 8.85 verified via DigiLocker NAD Ledger. Criteria (>7.5) satisfied.",
                "retry_count": 0,
                "max_retries": 5
            },
            {
                "id": "step_3",
                "step_name": "Income Eligibility Verification",
                "department": "Department of Revenue",
                "system_name": "State Revenue & Income Verification API",
                "status": "degraded",  # DEMO FAILING STEP
                "timestamp": "2026-09-28T18:30:44Z",
                "latency_ms": 38200,  # 38.2 seconds!
                "details": "Income Verification API is experiencing transient 504 Gateway Timeouts from State Sub-Registrar Database.",
                "delay_reason": "State Revenue Income Verification API is temporarily degraded (Latency: 38.2s). GovBridge has queued the request with automated exponential retry policy.",
                "retry_count": 2,
                "max_retries": 5
            },
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
        ],
        "stuck_diagnosis": {
            "is_stuck": True,
            "current_step": "Income Eligibility Verification",
            "reason": "State Income Verification API is temporarily degraded (504 Gateway Timeout on legacy endpoint).",
            "dependency": "Department of Revenue & State Land Records Gateway",
            "current_status": "DEGRADED",
            "action_taken": "GovBridge smart orchestrator intercepted failure, prevented application crash, queued payload for retry attempt 2/5 with circuit-breaker protection.",
            "recovery_recommendation": "Use Admin Sandbox or click 'Simulate Service Recovery' to watch automated self-healing resume the application pipeline."
        }
    }
}

# CONSENT WALLET (Req 14, 15)
CONSENTS_DB: List[Dict[str, Any]] = [
    {
        "id": "consent_req_001",
        "citizen_id": "citizen_01",
        "requested_by": "National Scholarship Scheme (NSP)",
        "service_name": "Post-Matric Merit Scholarship 2026",
        "data_needed": ["Academic Transcripts (NAD)", "Annual Household Income (Revenue Dept)", "Bank DBT Mandate Status (NPCI)"],
        "purpose": "Verify academic merit, economic threshold eligibility, and enable Direct Benefit Transfer fund disbursement.",
        "duration": "Application Processing Lifecycle (Expires 31 Dec 2026)",
        "status": "active",
        "created_at": "2026-09-28T18:28:45Z",
        "expires_at": "2026-12-31T23:59:59Z",
        "legal_basis": "Digital Personal Data Protection (DPDP) Act 2023 - Section 6(1) Notice & Consent",
        "accessed_logs": [
            {"timestamp": "2026-09-28T18:30:02Z", "actor": "UIDAI Connector", "field": "person.name, person.dob", "action": "Read / Verified"},
            {"timestamp": "2026-09-28T18:30:06Z", "actor": "NAD Academic Connector", "field": "education.cgpa, education.institution", "action": "Read / Verified"}
        ]
    },
    {
        "id": "consent_req_002",
        "citizen_id": "citizen_01",
        "requested_by": "Delhi Transit Authority",
        "service_name": "Student Concessional Metro Mobility Card",
        "data_needed": ["College Enrollment Status", "Identity Proof"],
        "purpose": "Issue 75% subsidized student transit pass.",
        "duration": "Academic Year 2025-2026",
        "status": "active",
        "created_at": "2026-08-10T11:00:00Z",
        "expires_at": "2026-06-30T23:59:59Z",
        "legal_basis": "DPDP Act 2023 Consent Artifact v2.1",
        "accessed_logs": [
            {"timestamp": "2026-08-10T11:01:12Z", "actor": "NCMC Gateway", "field": "education.enrollment_id", "action": "Read / Tokenized"}
        ]
    }
]

# AI SCHEMA MAPPINGS & DRIFT ALERTS (Req 23, 24, 25, 51)
SCHEMA_MAPPINGS_DB: List[Dict[str, Any]] = [
    {
        "id": "map_001",
        "system_id": "education_api",
        "system_name": "DigiLocker NAD Academic Connector",
        "external_field": "student_full_name",
        "canonical_field": "person.name",
        "confidence_score": 94,
        "ai_rationale": "High lexical and semantic similarity (0.94) to canonical entity 'person.name'. Previous schema used 'student_name'.",
        "status": "pending",  # pending review for DEMO 2
        "suggested_at": "2026-09-28T19:15:00Z",
        "approved_by": None
    },
    {
        "id": "map_002",
        "system_id": "income_api",
        "system_name": "State Revenue & Income Verification API",
        "external_field": "gross_annual_family_income",
        "canonical_field": "financial.income.annual_gross",
        "confidence_score": 98,
        "ai_rationale": "Entity ontology matches financial household gross income specification with currency INR representation.",
        "status": "accepted",
        "suggested_at": "2026-09-20T10:00:00Z",
        "approved_by": "SysAdmin_Interoperability_Cell"
    },
    {
        "id": "map_003",
        "system_id": "identity_api",
        "system_name": "UIDAI Identity Connector",
        "external_field": "resident_dob_iso8601",
        "canonical_field": "person.date_of_birth",
        "confidence_score": 99,
        "ai_rationale": "Direct standard date ISO format matching ISO-8601 YYYY-MM-DD schema.",
        "status": "accepted",
        "suggested_at": "2026-09-15T08:00:00Z",
        "approved_by": "SysAdmin_Interoperability_Cell"
    },
    {
        "id": "map_004",
        "system_id": "bank_api",
        "system_name": "NPCI PFMS DBT API",
        "external_field": "beneficiary_aadhaar_seed_status",
        "canonical_field": "financial.bank.account_status",
        "confidence_score": 95,
        "ai_rationale": "Mapped to canonical DBT active payment flag.",
        "status": "accepted",
        "suggested_at": "2026-09-18T14:30:00Z",
        "approved_by": "SysAdmin_Interoperability_Cell"
    }
]

SCHEMA_CHANGE_ALERTS: List[Dict[str, Any]] = [
    {
        "id": "schema_alert_01",
        "system_id": "education_api",
        "system_name": "DigiLocker NAD Academic Connector",
        "old_field": "student_name",
        "new_field": "student_full_name",
        "canonical_target": "person.name",
        "confidence_score": 94,
        "affected_services": [
            "National Post-Matric Merit Scholarship Scheme 2026",
            "National Student Concessional Transit Mobility Pass"
        ],
        "affected_workflows": ["APP-GB-2026-8821", "APP-GB-2026-7714"],
        "detected_at": "2026-09-28T19:14:22Z",
        "status": "detected"  # detected, reviewed, resolved
    }
]

# DATA CONFLICT DETECTION (Req 29, 31, 52)
DATA_CONFLICTS_DB: List[Dict[str, Any]] = [
    {
        "id": "conflict_001",
        "citizen_id": "citizen_01",
        "citizen_name": "Kanika Sharma",
        "field_name": "Date of Birth (DOB)",
        "canonical_field": "person.date_of_birth",
        "source_a": {
            "system": "Identity System (UIDAI)",
            "value": "20 May 2005",
            "timestamp": "2026-01-15T09:30:00Z",
            "confidence": "Official Biometric Master"
        },
        "source_b": {
            "system": "Education System (DigiLocker/CBSE)",
            "value": "21 May 2005",
            "timestamp": "2026-02-10T14:15:00Z",
            "confidence": "Secondary School Certificate Record"
        },
        "conflict_summary": "Discrepancy detected: Identity System reports 20 May 2005 while Education System reports 21 May 2005.",
        "detected_at": "2026-09-28T18:30:05Z",
        "status": "under_manual_review",  # detected, under_manual_review, resolved
        "action_required": "GovBridge policy prohibits automatic overwriting. Manual verification required across source departments."
    }
]

# DATA LINEAGE GRAPH (Req 30)
DATA_LINEAGE_DB: List[Dict[str, Any]] = [
    {
        "canonical_field": "financial.income.annual_gross",
        "label": "Annual Household Income",
        "current_value": "₹1,80,000",
        "nodes": [
            {"id": "node_src", "label": "Source: Delhi Revenue Dept", "sub": "State Sub-Registrar Database", "type": "source", "status": "verified"},
            {"id": "node_api", "label": "API: State Income Interop Gateway", "sub": "TLS 1.3 + e-Pramaan Token", "type": "api", "status": "degraded"},
            {"id": "node_trans", "label": "Transform: Canonical Mapper", "sub": "gross_annual_family_income -> financial.income.annual_gross", "type": "transform", "status": "verified"},
            {"id": "node_val", "label": "Validation: Policy Rule Check", "sub": "Income < ₹2,50,000 Cap = TRUE", "type": "validation", "status": "verified"},
            {"id": "node_cons", "label": "Consumer: National Scholarship Portal", "sub": "Welfare Grant Disbursal Engine", "type": "consumer", "status": "queued"}
        ],
        "last_synced": "2026-09-28T18:30:44Z",
        "audit_id": "AUD-LIN-8921"
    },
    {
        "canonical_field": "education.cgpa",
        "label": "Academic Performance (CGPA)",
        "current_value": "8.85 / 10.0",
        "nodes": [
            {"id": "node_src", "label": "Source: DTU Examination ERP", "sub": "University Academic Records", "type": "source", "status": "verified"},
            {"id": "node_api", "label": "API: DigiLocker NAD Connector", "sub": "Cryptographic Hash SHA-256", "type": "api", "status": "verified"},
            {"id": "node_trans", "label": "Transform: Grade Standardizer", "sub": "scale_10_cgpa -> education.cgpa", "type": "transform", "status": "verified"},
            {"id": "node_val", "label": "Validation: Merit Threshold", "sub": "CGPA >= 7.5 = PASSED (8.85)", "type": "validation", "status": "verified"},
            {"id": "node_cons", "label": "Consumer: National Scholarship Portal", "sub": "Merit Evaluation Engine", "type": "consumer", "status": "verified"}
        ],
        "last_synced": "2026-09-28T18:30:06Z",
        "audit_id": "AUD-LIN-8819"
    }
]

# BOTTLENECK TELEMETRY & PROCESSING TIME ANALYTICS (Req 36, 37, 53)
BOTTLENECK_ANALYTICS: Dict[str, Any] = {
    "workflow_name": "National Scholarship Scheme Orchestration",
    "total_applications_evaluated": 1284,
    "primary_bottleneck": "Income Eligibility Verification",
    "primary_bottleneck_latency_sec": 38.2,
    "steps_breakdown": [
        {"step": "Identity Verification", "avg_latency_sec": 1.8, "p95_latency_sec": 2.4, "failure_rate_pct": 0.2, "status": "Optimal", "system": "UIDAI Identity Connector"},
        {"step": "Education Verification", "avg_latency_sec": 3.9, "p95_latency_sec": 5.1, "failure_rate_pct": 0.6, "status": "Optimal", "system": "DigiLocker NAD Academic Connector"},
        {"step": "Income Verification", "avg_latency_sec": 38.2, "p95_latency_sec": 62.0, "failure_rate_pct": 9.4, "status": "CRITICAL BOTTLENECK", "system": "State Revenue & Income Verification API"},
        {"step": "Bank DBT Verification", "avg_latency_sec": 2.9, "p95_latency_sec": 4.2, "failure_rate_pct": 1.1, "status": "Optimal", "system": "NPCI PFMS DBT API"}
    ],
    "failure_patterns": [
        {"rank": 1, "pattern": "Income API 504 Gateway Timeout during peak hours (10:00 - 15:00 IST)", "frequency": 412, "department": "Department of Revenue"},
        {"rank": 2, "pattern": "Legacy Education API Schema Field Mismatch (student_name -> student_full_name)", "frequency": 128, "department": "DigiLocker / State Tech Board"},
        {"rank": 3, "pattern": "NPCI APBS DBT Account Mapper Latency Spike", "frequency": 42, "department": "Ministry of Finance"},
        {"rank": 4, "pattern": "UIDAI Biometric Token Expiry on slow mobile connections", "frequency": 19, "department": "UIDAI"}
    ],
    "predictive_load_note": "Current request load: 1,284 concurrent journeys. Projected peak at 14:00 IST: 2,100 requests. Recommendation: Enable GovBridge async retry buffering for State Revenue endpoints."
}

# IMMUTABLE AUDIT TRAIL (Req 31)
AUDIT_TRAIL_DB: List[Dict[str, Any]] = [
    {
        "id": "AUD-2026-9001",
        "timestamp": "2026-09-28T20:55:01Z",
        "actor": "GovBridge Self-Healing Daemon",
        "department": "GovBridge Core",
        "action": "Circuit Breaker Retry Scheduled",
        "data_category": "Workflow State",
        "purpose": "Exponential backoff retry attempt 2/5 for degraded Revenue endpoint",
        "result": "QUEUED",
        "ip_or_system": "govbridge-worker-02.internal"
    },
    {
        "id": "AUD-2026-9002",
        "timestamp": "2026-09-28T19:14:22Z",
        "actor": "AI Schema Monitor",
        "department": "GovBridge Schema AI",
        "action": "Detected API Schema Drift",
        "data_category": "Schema Definition",
        "purpose": "DigiLocker NAD API changed 'student_name' to 'student_full_name'",
        "result": "ALERT_TRIGGERED",
        "ip_or_system": "schema-sentinel.internal"
    },
    {
        "id": "AUD-2026-9003",
        "timestamp": "2026-09-28T18:30:44Z",
        "actor": "Scholarship Orchestrator",
        "department": "Department of Revenue",
        "action": "Cross-System Income Data Request",
        "data_category": "Household Income",
        "purpose": "Verify eligibility for Post-Matric Merit Scholarship",
        "result": "TIMEOUT_INTERCEPTED",
        "ip_or_system": "10.42.18.91"
    },
    {
        "id": "AUD-2026-9004",
        "timestamp": "2026-09-28T18:30:06Z",
        "actor": "Scholarship Orchestrator",
        "department": "Ministry of Education",
        "action": "Academic Credentials Read",
        "data_category": "Academic Transcripts",
        "purpose": "Verify student CGPA 8.85 at DTU",
        "result": "VERIFIED_SUCCESS",
        "ip_or_system": "10.42.18.90"
    },
    {
        "id": "AUD-2026-9005",
        "timestamp": "2026-09-28T18:30:02Z",
        "actor": "Consent Engine",
        "department": "UIDAI / MeitY",
        "action": "DPDP Legal Consent Verification",
        "data_category": "Aadhaar Identity Proof",
        "purpose": "Citizen Kanika Sharma granted explicit tokenized identity consent",
        "result": "CONSENT_AUTHORIZED",
        "ip_or_system": "consent-broker.internal"
    },
    {
        "id": "AUD-2026-9006",
        "timestamp": "2026-09-28T18:28:45Z",
        "actor": "Citizen Kanika Sharma",
        "department": "GovBridge Portal",
        "action": "Digital Consent Grant",
        "data_category": "Multi-System Authorization",
        "purpose": "Authorized cross-department data sharing for Scholarship Application",
        "result": "SIGNATURE_RECORDED",
        "ip_or_system": "203.0.113.44 (Citizen Client)"
    }
]
