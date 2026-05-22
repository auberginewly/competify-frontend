// Cytoscape 画布占位。Phase 7 用 cytoscape + cytoscape-cola 力导向布局。
interface GraphCanvasProps {
  height?: number
}

export function GraphCanvas({ height = 400 }: GraphCanvasProps) {
  return (
    <div
      className="flex items-center justify-center rounded border border-dashed border-slate-700 bg-slate-950/60 text-xs text-slate-500"
      style={{ height }}
    >
      Cytoscape 画布占位（Phase 7）
    </div>
  )
}
