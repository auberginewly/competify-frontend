import { useParams } from 'react-router-dom'

// Phase 0 placeholder. Phase 7 接入：react-markdown + 脚注下钻 + GET /api/v1/reports/:id。
export default function ReportView() {
  const { id } = useParams<{ id: string }>()

  const fakeSections = [
    {
      title: '产品定位',
      body: 'Cursor 是基于 VS Code fork 的 AI-native 编辑器，主打 AI Pair Programming 体验。',
      confidence: 0.91,
      sources: 4,
    },
    {
      title: '核心功能',
      body: 'Tab 自动补全 / Composer 多文件编辑 / Agent Mode 自主任务执行 / @Codebase 上下文索引。',
      confidence: 0.88,
      sources: 7,
    },
    {
      title: '定价策略',
      body: 'Free / Pro $20/月 / Business $40/月。Pro 包含 500 次 fast request + 无限 slow request。',
      confidence: 0.95,
      sources: 3,
    },
    {
      title: '技术栈推断',
      body: '编辑器：Electron + VS Code fork。模型：自训 Tab 模型 + GPT-4o / Claude Sonnet。',
      confidence: 0.72,
      sources: 5,
    },
  ]

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-8">
      <header>
        <div className="text-xs text-slate-500">报告 ID: {id}</div>
        <h1 className="mt-1 text-2xl font-semibold">竞品分析报告 — Cursor</h1>
        <div className="mt-2 flex gap-3 text-xs text-slate-400">
          <span>Phase 0 占位</span>
          <span>•</span>
          <span>Merkle Root: <span className="font-mono">0x000...000</span></span>
        </div>
      </header>

      <article className="space-y-4">
        {fakeSections.map((s, i) => (
          <section key={i} className="rounded-lg border border-slate-800 bg-slate-900 p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-slate-100">{s.title}</h2>
              <div className="flex gap-3 text-xs text-slate-500">
                <span>conf {s.confidence.toFixed(2)}</span>
                <span>{s.sources} 处来源</span>
              </div>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-slate-300">{s.body}</p>
            <button
              type="button"
              disabled
              className="mt-3 text-xs text-blue-400 opacity-60"
            >
              查看溯源链 →
            </button>
          </section>
        ))}
      </article>

      <p className="text-xs text-slate-500">
        Phase 0 占位。Phase 7 接 react-markdown + 脚注下钻，跳转 /provenance/:reportId。
      </p>
    </div>
  )
}
