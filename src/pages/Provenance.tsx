import { useParams } from 'react-router-dom'

// Phase 0 placeholder. Phase 7 接入：D3 Timeline + Merkle Tree 下钻 + GET /api/v1/audit/:reportId。
export default function Provenance() {
  const { reportId } = useParams<{ reportId: string }>()

  const fakeEvents = [
    { agent: 'collector_web', action: '抓取 cursor.sh', confidence: 0.92, time: '00:00:12' },
    { agent: 'collector_api', action: 'GitHub releases', confidence: 0.88, time: '00:00:18' },
    { agent: 'cleaner',       action: 'SimHash 去重',   confidence: 0.95, time: '00:00:34' },
    { agent: 'analyzer',      action: '功能分类',       confidence: 0.81, time: '00:01:05' },
    { agent: 'cross_reviewer', action: '对抗质疑',      confidence: 0.78, time: '00:01:40' },
    { agent: 'writer',        action: '报告渲染',       confidence: 0.93, time: '00:02:10' },
  ]

  return (
    <div className="space-y-6 p-8">
      <header>
        <h1 className="text-2xl font-semibold">溯源审计时间线</h1>
        <p className="mt-1 text-sm text-slate-400">
          报告 ID: <span className="font-mono text-slate-300">{reportId}</span>
        </p>
      </header>

      <div className="rounded-lg border border-slate-800 bg-slate-900 p-6">
        <div className="mb-3 text-xs text-slate-500">
          D3 Timeline 占位（Phase 7 接 D3.js + Merkle Proof 下钻）
        </div>
        <ol className="space-y-2 border-l-2 border-slate-700 pl-4">
          {fakeEvents.map((e, i) => (
            <li key={i} className="relative">
              <span className="absolute -left-[22px] top-1.5 h-3 w-3 rounded-full bg-blue-500" />
              <div className="flex items-center justify-between text-sm">
                <div>
                  <span className="font-mono text-slate-300">{e.agent}</span>
                  <span className="ml-3 text-slate-400">{e.action}</span>
                </div>
                <div className="flex gap-4 text-xs text-slate-500">
                  <span>conf: {e.confidence.toFixed(2)}</span>
                  <span className="font-mono">{e.time}</span>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <div className="rounded-lg border border-slate-800 bg-slate-900 p-6">
        <div className="text-sm font-medium text-slate-200">Merkle Root</div>
        <div className="mt-2 break-all font-mono text-xs text-slate-400">
          0x0000000000000000000000000000000000000000000000000000000000000000
        </div>
        <div className="mt-1 text-xs text-slate-500">Phase 3 接入真实哈希。</div>
      </div>
    </div>
  )
}
