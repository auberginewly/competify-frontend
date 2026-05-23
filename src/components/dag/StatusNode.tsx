import { memo } from 'react'
import type { NodeProps } from 'reactflow'
import type { AgentStatus } from '@/types/api'

export interface StatusNodeData {
  label: string
  status: AgentStatus
}

function statusBorder(s: AgentStatus): string {
  switch (s) {
    case 'pending': return 'border-status-pending'
    case 'running': return 'border-status-running'
    case 'review':  return 'border-status-review'
    case 'error':   return 'border-status-error'
    case 'done':    return 'border-status-done'
    default:        return 'border-status-pending'
  }
}

function statusText(s: AgentStatus): string {
  switch (s) {
    case 'pending': return 'text-status-pending'
    case 'running': return 'text-status-running'
    case 'review':  return 'text-status-review'
    case 'error':   return 'text-status-error'
    case 'done':    return 'text-status-done'
    default:        return 'text-status-pending'
  }
}

function statusAnimation(s: AgentStatus): string {
  switch (s) {
    case 'running': return 'animate-breathe'
    case 'review':  return 'animate-blink'
    case 'error':   return 'animate-shake'
    default:        return ''
  }
}

export const StatusNode = memo(function StatusNode({ data }: NodeProps<StatusNodeData>) {
  const { label, status } = data
  return (
    <div
      className={`
        min-w-[96px] rounded border-2 bg-slate-800 px-2 py-1.5 text-center text-xs font-medium
        ${statusBorder(status)} ${statusText(status)} ${statusAnimation(status)}
      `}
    >
      <div className="leading-tight">{label}</div>
      <div className="mt-0.5 text-[10px] opacity-70">{status}</div>
    </div>
  )
})
