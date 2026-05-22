import { useEffect, useState } from 'react'
import { auditApi } from '@/api/audit'
import type { AuditEvent } from '@/types/ui'

// 溯源时间线 hook。Phase 0 签名落地，Phase 3 后端有 endpoint 时拉数据。
export function useProvenance(reportId: string | undefined) {
  const [events, setEvents] = useState<AuditEvent[]>([])
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!reportId) return
    auditApi
      .timeline(reportId)
      .then(setEvents)
      .catch((e: Error) => setError(e))
  }, [reportId])

  return { events, error }
}
