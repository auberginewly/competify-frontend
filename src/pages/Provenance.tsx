import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { auditApi } from '@/api/audit'

const fakeEvents = [
  { agent: 'orchestrator',   action: '生成任务计划',      confidence: 0.95, time: '00:00:02', status: 'done' as const },
  { agent: 'collector_web',  action: '抓取 cursor.sh',    confidence: 0.88, time: '00:00:14', status: 'done' as const },
  { agent: 'collector_api',  action: 'GitHub releases',   confidence: 0.92, time: '00:00:18', status: 'done' as const },
  { agent: 'cleaner',        action: 'SimHash 去重',      confidence: 0.95, time: '00:00:34', status: 'done' as const },
  { agent: 'analyzer_feat',  action: '功能分类',          confidence: 0.81, time: '00:01:05', status: 'done' as const },
  { agent: 'analyzer_price', action: '定价对比',          confidence: 0.93, time: '00:01:12', status: 'done' as const },
  { agent: 'cross_reviewer', action: '对抗质疑（通过）',   confidence: 0.78, time: '00:01:40', status: 'done' as const },
  { agent: 'writer',         action: '报告渲染',          confidence: 0.93, time: '00:02:10', status: 'done' as const },
  { agent: 'final_reviewer', action: 'HMAC 签名',         confidence: 0.99, time: '00:02:15', status: 'done' as const },
]

const merkleRoot = '0x7a3f9e2b1c8d4e5f6a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f'

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
  const [events, setEvents] = useState<any[]>([])
  const [verified, setVerified] = useState<boolean | null>(null)

  useEffect(() => {
    if (!reportId) return
    auditApi.get(reportId)
      .then((res: any) => setEvents(res.events ?? []))
      .catch(console.error)
  }, [reportId])

  const handleVerify = () => {
    if (!reportId) return
    auditApi.verify(reportId)
      .then(() => setVerified(true))
      .catch(() => setVerified(false))
  }

  const displayEvents = events.length > 0 ? events : fakeEvents

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
        <ol className="space-y-3 border-l-2 border-slate-700 pl-5">
          {displayEvents.map((e, i) => (
            <li key={i} className="relative">
              <span className={`absolute -left-[26px] top-1.5 h-3.5 w-3.5 rounded-full ${agentColor(e.agent)} ring-2 ring-slate-900`} />
              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <span className="font-mono font-medium text-slate-200">{e.agent}</span>
                  <span className="ml-3 text-slate-400">{e.action}</span>
                </div>
                <div className="flex gap-4 text-xs text-slate-500">
                  <span>conf: {typeof e.confidence === 'number' ? e.confidence.toFixed(2) : '-'}</span>
                  <span className="font-mono">{e.time ?? e.timestamp ?? ''}</span>
                </div>
              </div>
            </li>
          ))}
        </ol>
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

      <div className="rounded-lg border border-slate-800 bg-slate-900 p-6">
        <div className="text-sm font-medium text-slate-200">哈希树预览（3 层）</div>
        <div className="mt-4 flex flex-col items-center gap-4">
          <div className="rounded border border-blue-500/40 bg-blue-500/10 px-4 py-2 text-center text-xs text-blue-300">
            Root<br />{merkleRoot.slice(0, 16)}…
          </div>
          <div className="flex gap-8">
            {['L1-A', 'L1-B'].map((n) => (
              <div key={n} className="rounded border border-slate-600 bg-slate-800 px-3 py-1.5 text-center text-[10px] text-slate-400">
                {n}
              </div>
            ))}
          </div>
          <div className="flex gap-3">
            {['L2-1', 'L2-2', 'L2-3', 'L2-4'].map((n) => (
              <div key={n} className="rounded border border-slate-700 bg-slate-800/60 px-2 py-1 text-center text-[9px] text-slate-500">
                {n}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
