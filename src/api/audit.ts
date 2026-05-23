import { client } from './client'

// 对应后端 internal/handler/audit.go
export const auditApi = {
  get:    (provenanceId: string) => client.get<any, any>(`/audit/${provenanceId}`),
  verify: (provenanceId: string) => client.get<any, any>(`/audit/${provenanceId}/verify`),
}
