import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import ReactFlow, {
  Background,
  Controls,
  type Edge,
  MarkerType,
  type Node,
  ReactFlowProvider,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { useDagSocket } from '@/hooks/useDagSocket'
import { useTaskStore } from '@/store/taskStore'
import { StatusNode, type StatusNodeData } from '@/components/dag/StatusNode'
import type { AgentStatus } from '@/types/api'

const nodeTypes = { status: StatusNode }

interface AgentDef {
  id: string
  label: string
  x: number
  y: number
}

const agentDefs: AgentDef[] = [
  { id: 'orchestrator',   label: 'Orchestrator',   x: 400, y: 40 },
  { id: 'collector_web',  label: 'WebCollector',   x: 80,  y: 160 },
  { id: 'collector_api',  label: 'APICollector',   x: 240, y: 160 },
  { id: 'collector_fin',  label: 'Financial',      x: 400, y: 160 },
  { id: 'collector_rev',  label: 'Review',         x: 560, y: 160 },
  { id: 'collector_soc',  label: 'Social',         x: 720, y: 160 },
  { id: 'cleaner',        label: 'Cleaner',        x: 400, y: 280 },
  { id: 'analyzer_feat',  label: 'Feature',        x: 200, y: 400 },
  { id: 'analyzer_price', label: 'Pricing',        x: 360, y: 400 },
  { id: 'analyzer_tech',  label: 'Tech',           x: 520, y: 400 },
  { id: 'analyzer_mkt',   label: 'Market',         x: 680, y: 400 },
  { id: 'cross_reviewer', label: 'CrossReviewer',  x: 400, y: 520 },
  { id: 'writer',         label: 'Writer',         x: 400, y: 640 },
  { id: 'final_reviewer', label: 'FinalReviewer',  x: 400, y: 760 },
]

function buildEdges(): Edge[] {
  const e = (s: string, t: string) => ({
    id: `${s}->${t}`,
    source: s,
    target: t,
    animated: true,
    markerEnd: { type: MarkerType.ArrowClosed, color: '#64748b' },
    style: { stroke: '#64748b', strokeWidth: 1.5 },
  })
  return [
    e('orchestrator', 'collector_web'),
    e('orchestrator', 'collector_api'),
    e('orchestrator', 'collector_fin'),
    e('orchestrator', 'collector_rev'),
    e('orchestrator', 'collector_soc'),
    e('collector_web', 'cleaner'),
    e('collector_api', 'cleaner'),
    e('collector_fin', 'cleaner'),
    e('collector_rev', 'cleaner'),
    e('collector_soc', 'cleaner'),
    e('cleaner', 'analyzer_feat'),
    e('cleaner', 'analyzer_price'),
    e('cleaner', 'analyzer_tech'),
    e('cleaner', 'analyzer_mkt'),
    e('analyzer_feat', 'cross_reviewer'),
    e('analyzer_price', 'cross_reviewer'),
    e('analyzer_tech', 'cross_reviewer'),
    e('analyzer_mkt', 'cross_reviewer'),
    e('cross_reviewer', 'writer'),
    e('writer', 'final_reviewer'),
  ]
}

function buildNodes(statuses: Record<string, AgentStatus>): Node<StatusNodeData>[] {
  return agentDefs.map((a) => ({
    id: a.id,
    type: 'status',
    position: { x: a.x, y: a.y },
    data: { label: a.label, status: statuses[a.id] ?? 'pending' },
  }))
}

function DAGCanvas() {
  const { taskId } = useParams<{ taskId: string }>()
  const { logs, connected } = useDagSocket(taskId)
  const statuses = useTaskStore((s) => s.statuses)
  const nodes = useMemo(() => buildNodes(statuses), [statuses])
  const edges = useMemo(() => buildEdges(), [])

  return (
    <div className="flex h-full gap-4">
      <div className="relative flex-1 rounded-lg border border-slate-800 bg-slate-950">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          fitView
          minZoom={0.3}
          maxZoom={1.5}
          proOptions={{ hideAttribution: true }}
        >
          <Background color="#334155" gap={20} />
          <Controls />
        </ReactFlow>
        <div className="absolute right-3 top-3 rounded bg-slate-900/80 px-2 py-1 text-[10px] text-slate-400 backdrop-blur">
          task: {taskId ?? 'demo'} {connected ? '●' : '○'}
        </div>
      </div>

      <div className="flex w-64 shrink-0 flex-col gap-3">
        <div className="rounded-lg border border-slate-800 bg-slate-900 p-3">
          <div className="mb-2 text-xs font-medium text-slate-300">执行日志</div>
          <div className="h-48 space-y-1 overflow-auto text-[10px] text-slate-500">
            {logs.length === 0 && <div className="text-slate-600">等待任务启动…</div>}
            {logs.map((l, i) => (
              <div key={i} className="font-mono">{l}</div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-slate-800 bg-slate-900 p-3">
          <div className="mb-2 text-xs font-medium text-slate-300">状态图例</div>
          <div className="space-y-1.5 text-[10px]">
            {([
              ['pending', '灰 / 等待'],
              ['running', '绿 / 运行中'],
              ['review',  '黄 / 审查'],
              ['error',   '红 / 错误'],
              ['done',    '蓝 / 完成'],
            ] as [AgentStatus, string][]).map(([s, label]) => (
              <div key={s} className="flex items-center gap-2">
                <span className={`inline-block h-2 w-2 rounded-full ${
                  s === 'pending' ? 'bg-gray-400' :
                  s === 'running' ? 'bg-green-400 animate-breathe' :
                  s === 'review'  ? 'bg-yellow-400 animate-blink' :
                  s === 'error'   ? 'bg-red-400 animate-shake' :
                  'bg-blue-400'
                }`} />
                <span className="text-slate-400">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function DagMonitor() {
  return (
    <div className="flex h-full flex-col p-6">
      <header className="mb-4">
        <h1 className="text-xl font-semibold text-slate-100">DAG 实时监控</h1>
        <p className="mt-0.5 text-xs text-slate-400">
          14 个节点 · WebSocket 实时推送 · ReactFlow 画布
        </p>
      </header>
      <div className="min-h-0 flex-1">
        <ReactFlowProvider>
          <DAGCanvas />
        </ReactFlowProvider>
      </div>
    </div>
  )
}
