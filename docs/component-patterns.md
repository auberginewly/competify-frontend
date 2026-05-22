# 组件设计规范

## 三层边界

```
pages/        →  只组装，调 hooks，传 props 给 components
components/   →  纯展示，props in → JSX out
hooks/        →  所有副作用（API/WebSocket/Timer/订阅）
```

**违反任意一条都会立刻在 review 时被打回**。

---

## pages/ 规范

- 一个 page = 一个文件 = 一个默认导出
- 文件命名 PascalCase：`DagMonitor.tsx`
- 不超过 150 行；超了说明业务逻辑漏到 page 里了，下移到 hooks
- 唯一允许直接调的：路由 hooks (`useParams`)、本地 UI 状态 (`useState`)、自定义 hooks

```tsx
// ✅ Good
export default function DagMonitor() {
  const { taskId } = useParams()
  const { nodes, edges, status } = useDagSocket(taskId!)
  return <DagCanvas nodes={nodes} edges={edges} status={status} />
}

// ❌ Bad: page 内直接 fetch
export default function DagMonitor() {
  const [data, setData] = useState()
  useEffect(() => { fetch('/api/...').then(...) }, [])  // 应该在 hooks/api 里
  return <div>{...}</div>
}
```

---

## components/ 规范

按功能域分子目录：

| 子目录 | 用途 |
|--------|------|
| `dag/` | DAG 监控相关（StatusNode / ParticleEdge / DagToolbar） |
| `provenance/` | 溯源相关（MerkleNode / TimelineCard） |
| `ontology/` | 本体图谱（GraphCanvas / TimeSlider） |
| `ui/` | 跨页面通用基础组件（Button / Card / Modal / Drawer） |

**规则**：
- 单文件 **≤ 200 行**
- 默认 named export（除 page 外）
- Props 用 TypeScript interface 严格定义，禁用 `any`
- 不引入任何 store、不调任何 API、不发起任何副作用
- 副作用想触发 = 在 props 上声明 callback，把决策权交给上层

```tsx
// ✅ Good
interface StatusNodeProps {
  agentId: string
  status: 'pending' | 'running' | 'review' | 'error' | 'done'
  onClick?: () => void
}

export function StatusNode({ agentId, status, onClick }: StatusNodeProps) {
  return <div className={statusColor(status)} onClick={onClick}>{agentId}</div>
}

// ❌ Bad
export function StatusNode({ agentId }: { agentId: string }) {
  const status = useDagStore(s => s.statuses[agentId])  // 不该在 component 里读 store
  return <div>...</div>
}
```

---

## hooks/ 规范

- 文件命名：`useXxx.ts`，单文件一个 hook
- 内部可调 api 层、操作 store、订阅 WS、设置 timer
- 返回值用对象解构（不返回数组，避免位置依赖）
- 副作用必须有 cleanup（`useEffect` 返回函数）

```ts
export function useDagSocket(taskId: string) {
  const update = useDagStore(s => s.update)
  useEffect(() => {
    const ws = new WebSocket(`/ws/dag/${taskId}`)
    ws.onmessage = (ev) => update(JSON.parse(ev.data))
    return () => ws.close()
  }, [taskId, update])
  return useDagStore(s => ({ nodes: s.nodes, edges: s.edges }))
}
```

---

## 反模式

- ❌ 组件内直接 import axios / fetch
- ❌ 在 component props 上同时声明 `onSuccess` + `onError` + `onLoading`（用 hook 返回值统一管理）
- ❌ 用 `useEffect` + `setState` 做派生状态（应该 `useMemo`）
- ❌ 一个组件吃 5+ props（拆 sub-component）
- ❌ 给 component 注入 store / context（应该 props down）

---

## 新增组件流程

跑 `/new-component`，会问：
1. 属于哪个功能域？决定子目录
2. 是否纯展示？需要 callback 还是 store？
3. 命名、props 类型签名
