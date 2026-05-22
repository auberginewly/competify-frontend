import { useParams } from 'react-router-dom'

// Phase 0 placeholder. Phase 7 接入：ReactFlow + useDagSocket(taskId) + StatusNode + ParticleEdge。
export default function DagMonitor() {
  const { taskId } = useParams<{ taskId: string }>()

  const fakeAgents: Array<{ id: string; status: 'pending' | 'running' | 'review' | 'error' | 'done' }> = [
    { id: 'orchestrator',   status: 'done' },
    { id: 'collector_web',  status: 'done' },
    { id: 'collector_api',  status: 'running' },
    { id: 'cleaner',        status: 'pending' },
    { id: 'analyzer',       status: 'pending' },
    { id: 'cross_reviewer', status: 'pending' },
    { id: 'writer',         status: 'pending' },
  ]

  const statusClass = (s: typeof fakeAgents[number]['status']) => {
    switch (s) {
      case 'pending': return 'border-status-pending text-status-pending'
      case 'running': return 'border-status-running text-status-running animate-breathe'
      case 'review':  return 'border-status-review text-status-review animate-blink'
      case 'error':   return 'border-status-error text-status-error animate-shake'
      case 'done':    return 'border-status-done text-status-done'
    }
  }

  return (
    <div className="space-y-6 p-8">
      <header>
        <h1 className="text-2xl font-semibold">DAG 实时监控</h1>
        <p className="mt-1 text-sm text-slate-400">
          任务 ID: <span className="font-mono text-slate-300">{taskId}</span>
        </p>
      </header>

      <div className="rounded-lg border border-slate-800 bg-slate-900 p-6">
        <div className="mb-4 text-xs text-slate-500">
          ReactFlow 画布占位区（Phase 7 接 ReactFlow + WebSocket）
        </div>
        <div className="grid grid-cols-3 gap-3 md:grid-cols-4 lg:grid-cols-7">
          {fakeAgents.map((a) => (
            <div
              key={a.id}
              className={`rounded border-2 bg-slate-800 px-3 py-3 text-center text-xs ${statusClass(a.status)}`}
            >
              <div className="font-medium">{a.id}</div>
              <div className="mt-1 opacity-80">{a.status}</div>
            </div>
          ))}
        </div>
      </div>

      <p className="text-xs text-slate-500">Phase 0 占位页面。真实 DAG 可视化在 Phase 7。</p>
    </div>
  )
}
