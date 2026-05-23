import { useState } from 'react'

interface NodeDef {
  id: string
  type: 'Competitor' | 'Feature' | 'Pricing' | 'Tech'
  x: number
  y: number
}

const fakeNodes: NodeDef[] = [
  { id: 'Cursor',      type: 'Competitor', x: 50, y: 45 },
  { id: 'Tab',         type: 'Feature',    x: 25, y: 25 },
  { id: 'Composer',    type: 'Feature',    x: 75, y: 25 },
  { id: 'Agent Mode',  type: 'Feature',    x: 25, y: 65 },
  { id: 'Pro Tier',    type: 'Pricing',    x: 75, y: 65 },
  { id: 'TypeScript',  type: 'Tech',       x: 50, y: 85 },
]

const typeColor = (t: string) => {
  switch (t) {
    case 'Competitor': return 'border-blue-400 bg-blue-500/20 text-blue-300'
    case 'Feature':    return 'border-green-400 bg-green-500/20 text-green-300'
    case 'Pricing':    return 'border-yellow-400 bg-yellow-500/20 text-yellow-300'
    case 'Tech':       return 'border-purple-400 bg-purple-500/20 text-purple-300'
    default:           return 'border-slate-600 bg-slate-700 text-slate-200'
  }
}

const typeLabel = (t: string) => {
  switch (t) {
    case 'Competitor': return '竞品'
    case 'Feature':    return '功能'
    case 'Pricing':    return '定价'
    case 'Tech':       return '技术'
    default:           return t
  }
}

export default function OntologyGraph() {
  const [hovered, setHovered] = useState<string | null>(null)

  return (
    <div className="space-y-6 p-8">
      <header>
        <h1 className="text-2xl font-semibold text-slate-100">本体图谱</h1>
        <p className="mt-1 text-sm text-slate-400">
          竞品 / 功能 / 定价 / 技术栈 的关联视图。
        </p>
      </header>

      <div className="rounded-lg border border-slate-800 bg-slate-900 p-6">
        <div className="relative h-96 rounded border border-dashed border-slate-700 bg-slate-950/60">
          {fakeNodes.map((n) => (
            <div
              key={n.id}
              className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-lg border-2 px-3 py-1.5 text-xs font-medium transition hover:scale-110 ${typeColor(n.type)} ${hovered === n.id ? 'ring-2 ring-white/20' : ''}`}
              style={{ left: `${n.x}%`, top: `${n.y}%` }}
              onMouseEnter={() => setHovered(n.id)}
              onMouseLeave={() => setHovered(null)}
            >
              {n.id}
              {hovered === n.id && (
                <div className="absolute left-1/2 top-full z-10 mt-1.5 -translate-x-1/2 whitespace-nowrap rounded bg-slate-800 px-2 py-1 text-[10px] text-slate-300 shadow-lg ring-1 ring-slate-700">
                  {typeLabel(n.type)} 节点
                </div>
              )}
            </div>
          ))}

          {/* Fake edges drawn as absolutely positioned lines */}
          <svg className="pointer-events-none absolute inset-0 h-full w-full">
            <line x1="50%" y1="45%" x2="25%" y2="25%" stroke="#334155" strokeWidth="1" strokeDasharray="4" />
            <line x1="50%" y1="45%" x2="75%" y2="25%" stroke="#334155" strokeWidth="1" strokeDasharray="4" />
            <line x1="50%" y1="45%" x2="25%" y2="65%" stroke="#334155" strokeWidth="1" strokeDasharray="4" />
            <line x1="50%" y1="45%" x2="75%" y2="65%" stroke="#334155" strokeWidth="1" strokeDasharray="4" />
            <line x1="50%" y1="45%" x2="50%" y2="85%" stroke="#334155" strokeWidth="1" strokeDasharray="4" />
          </svg>
        </div>

        <div className="mt-4 flex gap-5 text-xs text-slate-400">
          {(
            [
              ['Competitor', 'border-blue-400 bg-blue-500/20 text-blue-300'],
              ['Feature',    'border-green-400 bg-green-500/20 text-green-300'],
              ['Pricing',    'border-yellow-400 bg-yellow-500/20 text-yellow-300'],
              ['Tech',       'border-purple-400 bg-purple-500/20 text-purple-300'],
            ] as [string, string][]
          ).map(([label, cls]) => (
            <span key={label} className="flex items-center gap-1.5">
              <span className={`inline-block h-2.5 w-2.5 rounded border ${cls}`} />
              {label}
            </span>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-slate-300">时序播放</div>
          <div className="text-xs text-slate-500">2025-01 — 2026-05</div>
        </div>
        <div className="mt-3 h-2 rounded bg-slate-700">
          <div className="h-2 w-2/3 rounded bg-blue-500" />
        </div>
      </div>
    </div>
  )
}
