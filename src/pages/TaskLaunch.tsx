// Phase 0 placeholder. Phase 7 接入：Monaco Editor + Schema 配置 + POST /api/v1/tasks。
export default function TaskLaunch() {
  return (
    <div className="space-y-6 p-8">
      <header>
        <h1 className="text-2xl font-semibold">发起竞品分析任务</h1>
        <p className="mt-1 text-sm text-slate-400">
          输入竞品名称或 URL，配置分析维度，提交后跳转到 DAG 监控页。
        </p>
      </header>

      <section className="space-y-4 rounded-lg border border-slate-800 bg-slate-900 p-6">
        <div>
          <label className="mb-2 block text-sm text-slate-300">竞品名称 / URL</label>
          <div className="h-10 rounded border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-500">
            占位输入框（Phase 7 接 Monaco Editor）
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {['功能维度', '定价维度', '技术栈维度'].map((dim) => (
            <div
              key={dim}
              className="rounded border border-slate-700 bg-slate-800/60 p-3 text-sm text-slate-400"
            >
              <div className="text-slate-200">{dim}</div>
              <div className="mt-1 text-xs">占位 Schema 配置</div>
            </div>
          ))}
        </div>

        <button
          type="button"
          disabled
          className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white opacity-60"
        >
          提交分析任务（未接入）
        </button>
      </section>

      <p className="text-xs text-slate-500">Phase 0 占位页面。功能将在 Phase 7 接入。</p>
    </div>
  )
}
