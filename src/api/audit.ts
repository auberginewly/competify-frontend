import { client } from './client'

export interface AuditEvent {
  agent: string
  action: string
  timestamp: string
  merkle_hash: string
}

export interface AuditLogResponse {
  provenance_id: string
  events: AuditEvent[]
}

export interface VerifyMerkleResponse {
  valid: boolean
  root_hash: string
}

// 对应后端 internal/handler/audit.go
export const auditApi = {
  get:    (provenanceId: string) => client.get<AuditLogResponse, AuditLogResponse>(`/audit/${provenanceId}`),
  verify: (provenanceId: string) => client.get<VerifyMerkleResponse, VerifyMerkleResponse>(`/audit/${provenanceId}/verify`),
}
