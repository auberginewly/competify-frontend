import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCreateTask } from '@/hooks/useTaskApi'

const dimensions = [
  { key: 'feature', label: '功能维度' },
  { key: 'pricing', label: '定价维度' },
  { key: 'tech',    label: '技术栈维度' },
  { key: 'market',  label: '市场维度' },
]

export default function TaskLaunch() {
  const navigate = useNavigate()
  const { submit, loading } = useCreateTask()
  const [name, setName] = useState('Cursor')
  const [url, setUrl] = useState('https://cursor.com')
  const [selected, setSelected] = useState<string[]>(['feature', 'pricing'])

  const toggle = (key: string) => {
    setSelected((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    )
  }

  const handleSubmit = async () => {
    if (!name.trim() || selected.length === 0) return
    const result = await submit({
      competitor_name: name,
      target_url: url,
      dimensions: selected,
      priority: 3,
      requested_by: 'demo-user',
    })
    if (result) {
      navigate(`/dag/${result}`)
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-8">
      <header>
        <h1 className="text-2xl font-semibold text-slate-100">发起竞品分析任务</h1>
        <p className="mt-1 text-sm text-slate-400">
          输入竞品名称或 URL，选择分析维度，提交后自动跳转到 DAG 监控页。
        </p>
      </header>

      <section className="space-y-5 rounded-lg border border-slate-800 bg-slate-900 p-6">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-300">竞品名称</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-200 outline-none focus:border-blue-500"
            placeholder="例如：Cursor"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-300">目标 URL（可选）</label>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full rounded border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-200 outline-none focus:border-blue-500"
            placeholder="https://cursor.com"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">分析维度</label>
          <div className="grid grid-cols-2 gap-3">
            {dimensions.map((d) => {
              const active = selected.includes(d.key)
              return (
                <button
                  key={d.key}
                  type="button"
                  onClick={() => toggle(d.key)}
                  className={`
                    rounded border px-3 py-2.5 text-left text-sm transition
                    ${active
                      ? 'border-blue-500/60 bg-blue-500/10 text-blue-300'
                      : 'border-slate-700 bg-slate-800/60 text-slate-400 hover:border-slate-600'}
                  `}
                >
                  <div className="flex items-center justify-between">
                    <span>{d.label}</span>
                    {active && <span className="text-blue-400">✓</span>}
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        <button
          type="button"
          disabled={!name.trim() || selected.length === 0 || loading}
          onClick={handleSubmit}
          className={`
            w-full rounded px-4 py-2.5 text-sm font-medium text-white transition
            ${loading || !name.trim() || selected.length === 0
              ? 'cursor-not-allowed bg-blue-600/50'
              : 'bg-blue-600 hover:bg-blue-500'}
          `}
        >
          {loading ? '创建任务中…' : '提交分析任务'}
        </button>
      </section>

      <div className="rounded-lg border border-slate-800 bg-slate-900 p-4 text-xs text-slate-500">
        <div className="mb-1 font-medium text-slate-400">快速体验</div>
        <p>输入「Cursor」并选择功能+定价维度，提交后可在 DAG 监控页看到 14 个 Agent 节点的自动模拟执行过程。</p>
      </div>
    </div>
  )
}
