import { client } from './client'
import type { FinalReport } from '@/types/api'

// 对应后端 internal/handler/report.go
export const reportsApi = {
  get:     (id: string) => client.get<FinalReport, FinalReport>(`/reports/${id}`),
  approve: (id: string) => client.post<void, void>(`/reports/${id}/approve`),
}
