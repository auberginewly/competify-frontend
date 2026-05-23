import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { auditApi } from '@/api/audit'
import type { AuditEvent } from '@/api/audit'

function agentColor(agent: string): string {
  if (agent.includes('collector')) return 'bg-green-500'
  if (agent.includes('analyzer')) return 'bg-blue-500'
  if (agent.includes('reviewer')) return 'bg-yellow-500'
  if (agent === 'writer') return 'bg-purple-500'
  if (agent === 'orchestrator') return 'bg-pink-500'
  return 'bg-slate-500'
}

export default function Provenance() {
  const { reportId } = useParams<{ reportId: string }>()
  const [events, setEvents] = useState<AuditEvent[]>([])
  const [merkleRoot, setMerkleRoot] = useState<string>('未知')
  const [verified, setVerified] = useState<boolean | null>(null)

  useEffect(() => {
    if (!reportId) return
    auditApi.get(reportId)
      .then((res) => {
        setEvents(res.events ?? [])
        setMerkleRoot(res.events?.[0]?.merkle_hash ?? '未知')
      })
      .catch(console.error)
  }, [reportId])

  const handleVerify = () => {
    if (!reportId) return
    auditApi.verify(reportId)
      .then((res) => setVerified(res.valid))
      .catch(() => setVerified(false))
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-8">
      <header>
        <h1 className="text-2xl font-semibold text-slate-100">溯源审计时间线</h1>
        <p className="mt-1 text-sm text-slate-400">
          报告 ID: <span className="font-mono text-slate-300">{reportId}</span>
        </p>
      </header>

      <div className="rounded-lg border border-slate-800 bg-slate-900 p-6">
        <div className="mb-4 text-sm font-medium text-slate-200">Agent 执行链</div>
        {events.length === 0 ? (
          <div className="text-sm text-slate-500">暂无审计事件</div>
        ) : (
          <ol className="space-y-3 border-l-2 border-slate-700 pl-5">
            {events.map((e, i) => (
              <li key={i} className="relative">
                <span className={`absolute -left-[26px] top-1.5 h-3.5 w-3.5 rounded-full ${agentColor(e.agent)} ring-2 ring-slate-900`} />
                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    <span className="font-mono font-medium text-slate-200">{e.agent}</span>
                    <span className="ml-3 text-slate-400">{e.action}</span>
                  </div>
                  <div className="flex gap-4 text-xs text-slate-500">
                    <span className="font-mono">{e.timestamp}</span>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        )}
      </div>

      <div className="rounded-lg border border-slate-800 bg-slate-900 p-6">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium text-slate-200">Merkle Root</div>
          <button
            type="button"
            onClick={handleVerify}
            className="rounded bg-blue-600/20 px-2.5 py-1 text-xs font-medium text-blue-400 hover:bg-blue-600/30"
          >
            {verified === null ? '验证链完整性' : verified ? '✓ 验证通过' : '✗ 验证失败'}
          </button>
        </div>
        <div className="mt-3 break-all rounded bg-slate-950 p-3 font-mono text-xs text-slate-400">
          {merkleRoot}
        </div>
        {verified === true && (
          <div className="mt-2 text-xs text-green-400">
            链完整性验证通过 — 审计日志哈希匹配，无任何篡改。
          </div>
        )}
        {verified === false && (
          <div className="mt-2 text-xs text-red-400">
            链完整性验证失败 — 请检查数据源。
          </div>
        )}
      </div>
    </div>
  )
}
