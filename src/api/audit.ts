import { client } from './client'
import type { AuditEvent } from '@/types/ui'

// 对应后端 internal/handler/audit.go
export const auditApi = {
  timeline:    (reportId: string) => client.get<AuditEvent[], AuditEvent[]>(`/audit/${reportId}/timeline`),
  verifyMerkle: (reportId: string) => client.post<{ ok: boolean }, { ok: boolean }>(`/audit/${reportId}/verify`),
}
