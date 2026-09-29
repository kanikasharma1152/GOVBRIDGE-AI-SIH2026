"""
GovBridge Canonical Data Models and Pydantic Schemas
"""
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from datetime import datetime

class CitizenProfile(BaseModel):
    id: str
    name: str
    dob: str
    gender: str
    email: str
    phone: str
    is_demo: bool = True
    attributes: Dict[str, Any]

class ServiceItem(BaseModel):
    id: str
    name: str
    department: str
    category: str
    description: str
    eligibility_criteria: List[str]
    required_data: List[str]
    required_documents: List[str]
    connected_systems: List[str]
    workflow_steps: List[str]
    current_status: str = "Active"
    avg_processing_time: str = "3-5 days"

class IntentMatchRequest(BaseModel):
    intent: str
    citizen_id: Optional[str] = "citizen_01"

class IntentMatchResponse(BaseModel):
    matched_service: ServiceItem
    confidence: float
    reasoning: List[str]
    required_data: List[str]
    available_verified_data: Dict[str, Any]
    missing_data: List[str]
    required_documents: List[str]
    available_documents: List[str]
    missing_documents: List[str]
    connected_systems: List[Dict[str, str]]
    recommended_action: str

class ApplicationCreateRequest(BaseModel):
    citizen_id: str
    service_id: str
    use_authorized_data: bool = True
    authorized_fields: List[str]
    consent_granted: bool = True

class WorkflowStep(BaseModel):
    id: str
    step_name: str
    department: str
    system_name: str
    status: str # "completed", "in_progress", "degraded", "queued", "pending", "failed"
    timestamp: str
    latency_ms: int
    details: str
    delay_reason: Optional[str] = None
    retry_count: int = 0
    max_retries: int = 5

class ApplicationRecord(BaseModel):
    id: str
    citizen_id: str
    citizen_name: str
    service_id: str
    service_name: str
    department: str
    status: str # "In Progress", "Completed", "Action Required", "Stuck"
    created_at: str
    updated_at: str
    progress_percentage: int
    current_step: str
    steps: List[WorkflowStep]
    stuck_diagnosis: Optional[Dict[str, Any]] = None

class ConsentItem(BaseModel):
    id: str
    citizen_id: str
    requested_by: str
    service_name: str
    data_needed: List[str]
    purpose: str
    duration: str
    status: str # "active", "pending", "revoked", "denied"
    created_at: str
    expires_at: str
    legal_basis: str = "Digital Personal Data Protection (DPDP) Act 2023"

class ConsentActionRequest(BaseModel):
    consent_id: str
    action: str # "approve", "deny", "revoke"
    allowed_fields: Optional[List[str]] = None

class IntegrationStatus(BaseModel):
    id: str
    name: str
    department: str
    category: str
    status: str # "healthy", "degraded", "offline"
    latency_ms: int
    uptime_percentage: float
    error_rate_percentage: float
    request_volume: int
    last_successful_request: str
    authentication: str
    version: str
    endpoint_url: str
    dependencies: List[str]
    data_provided: List[str]
    data_requested: List[str]
    is_simulated: bool = True

class SchemaMapping(BaseModel):
    id: str
    system_id: str
    system_name: str
    external_field: str
    canonical_field: str
    confidence_score: int
    ai_rationale: str
    status: str # "accepted", "pending", "rejected"
    suggested_at: str
    approved_by: Optional[str] = None

class SchemaChangeAlert(BaseModel):
    id: str
    system_id: str
    system_name: str
    old_field: str
    new_field: str
    canonical_target: str
    confidence_score: int
    affected_services: List[str]
    affected_workflows: List[str]
    detected_at: str
    status: str # "detected", "reviewed", "resolved"

class DataConflict(BaseModel):
    id: str
    citizen_id: str
    citizen_name: str
    field_name: str
    canonical_field: str
    source_a: Dict[str, Any] # {system, value, timestamp}
    source_b: Dict[str, Any] # {system, value, timestamp}
    detected_at: str
    status: str # "detected", "under_manual_review", "resolved"
    action_required: str

class AuditEntry(BaseModel):
    id: str
    timestamp: str
    actor: str
    department: str
    action: str
    data_category: str
    purpose: str
    result: str # "SUCCESS", "VERIFIED", "BLOCKED", "QUEUED", "CONSENT_RECORDED"
    ip_or_system: str
