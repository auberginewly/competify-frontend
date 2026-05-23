import { useEffect, useMemo, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import { reportsApi } from '@/api/reports'
import { useTaskStore } from '@/store/taskStore'
import type { FinalReport } from '@/types/api'

function confidenceColor(c: number): string {
  if (c >= 0.9) return 'text-green-400'
  if (c >= 0.75) return 'text-blue-400'
  if (c >= 0.6) return 'text-yellow-400'
  return 'text-red-400'
}

function confidenceLabel(c: number): string {
  if (c >= 0.9) return 'HIGH'
  if (c >= 0.75) return 'MEDIUM'
  if (c >= 0.6) return 'LOW'
  return 'SUSPICIOUS'
}

export default function ReportView() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const taskId = useTaskStore((s) => s.taskId)
  const [report, setReport] = useState<FinalReport | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // "demo" path with no real task: show prompt instead of Cursor mock
  const isDemo = id === 'demo' && !taskId

  useEffect(() => {
    if (!id || isDemo) { setLoading(false); return }
    setLoading(true)
    reportsApi.get(id)
      .then(setReport)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [id, isDemo])

  const footnotes = report?.footnotes ?? []
  const overallConfidence = useMemo(() => {
    if (footnotes.length === 0) return 0
    const sum = footnotes.reduce((acc, f) => acc + f.confidence, 0)
    return sum / footnotes.length
  }, [footnotes])

  if (isDemo) return (
    <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
      <div className="text-4xl">📋</div>
      <div className="text-lg font-medium text-slate-200">暂无报告</div>
      <div className="text-sm text-slate-400">请先在「任务发起」页输入竞品并提交分析任务。</div>
      <button
        onClick={() => navigate('/')}
        className="mt-2 rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-500"
      >
        去发起任务 →
      </button>
    </div>
  )

  if (loading) return <div className="p-8 text-slate-400">加载报告中…</div>
  // 202: report still generating — show a friendly wait message
  if (!loading && !report) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
        <div className="text-4xl">⏳</div>
        <div className="text-lg font-medium text-slate-200">报告生成中，请稍候…</div>
        <div className="text-sm text-slate-400">LLM 正在分析各维度数据，通常需要 30–90 秒。</div>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 rounded bg-slate-700 px-4 py-2 text-sm text-slate-200 hover:bg-slate-600"
        >
          刷新查看
        </button>
      </div>
    )
  }
  if (error) return <div className="p-8 text-red-400">加载失败: {error}</div>

  const content = report?.content ?? ''
  const merkleRoot = report?.merkle_root ?? '未知'

  return (
    <div className="mx-auto flex max-w-5xl gap-6 p-8">
      <article className="flex-1 space-y-6">
        <header>
          <div className="text-xs text-slate-500">报告 ID: {id}</div>
          <h1 className="mt-1 text-2xl font-semibold text-slate-100">
            竞品分析报告
          </h1>
          <div className="mt-2 flex items-center gap-4 text-xs text-slate-400">
            <span>整体置信度:
              <span className={`ml-1 font-medium ${confidenceColor(overallConfidence)}`}>
                {confidenceLabel(overallConfidence)} ({overallConfidence.toFixed(2)})
              </span>
            </span>
            <span>•</span>
            <span className="font-mono text-slate-500">{merkleRoot.slice(0, 18)}…</span>
          </div>
        </header>

        <div className="prose prose-invert max-w-none prose-headings:text-slate-100 prose-p:text-slate-300 prose-strong:text-slate-200 prose-table:text-slate-300 prose-th:text-slate-200 prose-td:text-slate-300 prose-tr:border-slate-700">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>

        <div className="rounded-lg border border-slate-800 bg-slate-900 p-5">
          <div className="text-sm font-medium text-slate-200">Merkle Root</div>
          <div className="mt-2 break-all font-mono text-xs text-slate-400">
            {merkleRoot}
          </div>
          <Link
            to={`/provenance/${id}`}
            className="mt-3 inline-block text-xs text-blue-400 hover:text-blue-300"
          >
            查看完整溯源审计链 →
          </Link>
        </div>
      </article>

      <aside className="w-72 shrink-0 space-y-4">
        <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
          <div className="text-sm font-medium text-slate-200">溯源脚注</div>
          <div className="mt-3 space-y-3">
            {footnotes.length === 0 && <div className="text-xs text-slate-500">暂无脚注数据</div>}
            {footnotes.map((fn) => (
              <div key={fn.id} className="rounded border border-slate-700/60 bg-slate-800/40 p-2.5">
                <div className="text-xs text-slate-300">{fn.conclusion}</div>
                <div className="mt-1.5 flex items-center justify-between text-[10px]">
                  <span className={`font-medium ${confidenceColor(fn.confidence)}`}>
                    {confidenceLabel(fn.confidence)} {fn.confidence.toFixed(2)}
                  </span>
                  <Link
                    to={`/provenance/${id}?footnote=${fn.id}`}
                    className="text-blue-400 hover:text-blue-300"
                  >
                    验证
                  </Link>
                </div>
                <div className="mt-1 truncate font-mono text-[9px] text-slate-600">
                  {fn.viking_uri}
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  )
}
