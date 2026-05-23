import { useEffect, useState } from 'react'
import { auditApi } from '@/api/audit'
import type { AuditEvent } from '@/api/audit'

// 溯源时间线 hook。调用后端 /api/v1/audit/:id 获取审计事件。
export function useProvenance(reportId: string | undefined) {
  const [events, setEvents] = useState<AuditEvent[]>([])
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!reportId) return
    auditApi
      .get(reportId)
      .then((res) => setEvents(res.events ?? []))
      .catch((e: Error) => setError(e))
  }, [reportId])

  return { events, error }
}
