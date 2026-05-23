import { useEffect, useMemo, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import { reportsApi } from '@/api/reports'
import type { FinalReport } from '@/types/api'

const fakeFootnotes = [
  { id: 'fn-1', conclusion: 'Cursor 核心功能矩阵', confidence: 0.88, provenance_id: 'prov-1', viking_uri: 'viking://competify/tasks/task_cursor/analyzers/feature' },
  { id: 'fn-2', conclusion: 'Cursor 定价策略', confidence: 0.95, provenance_id: 'prov-2', viking_uri: 'viking://competify/tasks/task_cursor/analyzers/pricing' },
  { id: 'fn-3', conclusion: 'Cursor 技术栈推断', confidence: 0.72, provenance_id: 'prov-3', viking_uri: 'viking://competify/tasks/task_cursor/analyzers/tech' },
]

const fakeMerkleRoot = '0x7a3f9e2b1c8d4e5f6a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f'

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
  const [report, setReport] = useState<FinalReport | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    reportsApi.get(id)
      .then(setReport)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [id])

  const overallConfidence = useMemo(() => {
    const sum = fakeFootnotes.reduce((acc, f) => acc + f.confidence, 0)
    return sum / fakeFootnotes.length
  }, [])

  if (loading) return <div className="p-8 text-slate-400">加载报告中…</div>
  if (error) return <div className="p-8 text-red-400">加载失败: {error}</div>

  const content = report?.content ?? ''
  const merkleRoot = report?.merkle_root ?? fakeMerkleRoot

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
            {fakeFootnotes.map((fn) => (
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
