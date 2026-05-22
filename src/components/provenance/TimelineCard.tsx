// 溯源时间线单条记录卡片。Phase 7 接 D3 timeline 时被 timeline 内部调用。
interface TimelineCardProps {
  agent: string
  action: string
  confidence: number
  timestamp: string
  onClick?: () => void
}

export function TimelineCard({ agent, action, confidence, timestamp, onClick }: TimelineCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="block w-full rounded border border-slate-700 bg-slate-800 p-3 text-left text-sm hover:border-blue-500"
    >
      <div className="flex items-center justify-between">
        <span className="font-mono text-slate-200">{agent}</span>
        <span className="text-xs text-slate-400">{timestamp}</span>
      </div>
      <div className="mt-1 text-slate-300">{action}</div>
      <div className="mt-1 text-xs text-slate-500">conf {confidence.toFixed(2)}</div>
    </button>
  )
}
