import type { AgentStatus } from '@/types/api'

// DAG 节点。Phase 7 接 ReactFlow 时作为 custom node type。
interface StatusNodeProps {
  agentId: string
  status: AgentStatus
  onClick?: () => void
}

function statusClass(s: AgentStatus): string {
  const base = 'rounded border-2 bg-slate-800 px-3 py-2 text-xs font-medium'
  switch (s) {
    case 'pending': return `${base} border-status-pending text-status-pending`
    case 'running': return `${base} border-status-running text-status-running animate-breathe`
    case 'review':  return `${base} border-status-review text-status-review animate-blink`
    case 'error':   return `${base} border-status-error text-status-error animate-shake`
    case 'done':    return `${base} border-status-done text-status-done`
    default:        return `${base} border-status-pending text-status-pending`
  }
}

export function StatusNode({ agentId, status, onClick }: StatusNodeProps) {
  return (
    <div className={statusClass(status)} onClick={onClick}>
      <div>{agentId}</div>
      <div className="mt-0.5 opacity-70">{status}</div>
    </div>
  )
}
