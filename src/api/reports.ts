import { client } from './client'
import type { FinalReport } from '@/types/api'

// 对应后端 internal/handler/report.go
export const reportsApi = {
  // Returns null when the backend responds 202 (report still generating).
  get: (id: string) =>
    client.get<FinalReport>(`/reports/${id}`).then((data: any) =>
      data?.status === 'processing' ? null : (data as FinalReport)
    ),
  approve: (id: string) => client.post<void, void>(`/reports/${id}/approve`),
}
