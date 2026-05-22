// Phase 0 placeholder. Phase 7 接入：Cytoscape.js 力导向图 + TimeSlider + GET /api/v1/ontology/graph。
export default function OntologyGraph() {
  const fakeNodes = [
    { id: 'Cursor',      type: 'Competitor', x: 30, y: 30 },
    { id: 'Tab',         type: 'Feature',    x: 70, y: 20 },
    { id: 'Composer',    type: 'Feature',    x: 75, y: 50 },
    { id: 'Pro Tier',    type: 'Pricing',    x: 20, y: 70 },
    { id: 'TypeScript',  type: 'Tech',       x: 60, y: 80 },
  ]

  const typeColor = (t: string) => {
    switch (t) {
      case 'Competitor': return 'bg-blue-500/20 text-blue-300 border-blue-500'
      case 'Feature':    return 'bg-green-500/20 text-green-300 border-green-500'
      case 'Pricing':    return 'bg-yellow-500/20 text-yellow-300 border-yellow-500'
      case 'Tech':       return 'bg-purple-500/20 text-purple-300 border-purple-500'
      default:           return 'bg-slate-700 text-slate-200 border-slate-600'
    }
  }

  return (
    <div className="space-y-6 p-8">
      <header>
        <h1 className="text-2xl font-semibold">本体图谱</h1>
        <p className="mt-1 text-sm text-slate-400">
          竞品 / 功能 / 定价 / 技术栈 / 市场事件 的关联视图。
        </p>
      </header>

      <div className="rounded-lg border border-slate-800 bg-slate-900 p-6">
        <div className="mb-3 text-xs text-slate-500">
          Cytoscape.js 画布占位（Phase 7 接力导向布局 + 时序播放）
        </div>
        <div className="relative h-80 rounded border border-dashed border-slate-700 bg-slate-950/60">
          {fakeNodes.map((n) => (
            <div
              key={n.id}
              className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 px-3 py-1 text-xs font-medium ${typeColor(n.type)}`}
              style={{ left: `${n.x}%`, top: `${n.y}%` }}
            >
              {n.id}
            </div>
          ))}
        </div>
        <div className="mt-3 flex gap-4 text-xs text-slate-500">
          <span><span className="text-blue-300">●</span> Competitor</span>
          <span><span className="text-green-300">●</span> Feature</span>
          <span><span className="text-yellow-300">●</span> Pricing</span>
          <span><span className="text-purple-300">●</span> Tech</span>
        </div>
      </div>

      <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
        <div className="text-sm text-slate-300">时序播放</div>
        <div className="mt-2 h-2 rounded bg-slate-700">
          <div className="h-2 w-1/3 rounded bg-blue-500" />
        </div>
        <div className="mt-1 text-xs text-slate-500">2025-01 — 2026-05（占位）</div>
      </div>
    </div>
  )
}
