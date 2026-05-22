# API 集成规范

## 核心原则

1. **所有 HTTP 调用集中在 `src/api/`**，组件 / hook 直接 import 函数，禁止裸 fetch
2. **类型契约由后端单一真相源生成**：`../competify-backend/internal/schema/types.go` → tygo → `src/types/api.ts`
3. **永远不手改 `types/api.ts`**，下次 sync 会被覆盖

---

## 目录结构

```
src/api/
├── client.ts       ← Axios 实例 + 拦截器 + 错误标准化
├── tasks.ts        ← /api/v1/tasks/*
├── reports.ts      ← /api/v1/reports/*
├── ontology.ts     ← /api/v1/ontology/*
└── audit.ts        ← /api/v1/audit/*
```

每个文件对应后端一个 handler（详见 `../competify-backend/docs/api.md`）。

---

## client.ts 模板

```ts
import axios, { AxiosError } from 'axios'

export const client = axios.create({
  baseURL: '/api/v1',
  timeout: 30_000,
  headers: { 'Content-Type': 'application/json' },
})

client.interceptors.response.use(
  (res) => res.data,
  (err: AxiosError<{ message?: string }>) => {
    const msg = err.response?.data?.message ?? err.message
    return Promise.reject(new Error(`[api] ${msg}`))
  },
)
```

---

## 单个 API 文件示例

```ts
// api/tasks.ts
import { client } from './client'
import type { Task, CreateTaskInput, FinalReport } from '@/types/api'

export const tasksApi = {
  create: (input: CreateTaskInput) => client.post<Task>('/tasks', input),
  get:    (id: string)              => client.get<Task>(`/tasks/${id}`),
  report: (id: string)              => client.get<FinalReport>(`/tasks/${id}/report`),
}
```

---

## hooks 包一层（消费方）

```ts
// hooks/useTaskApi.ts
import { useState } from 'react'
import { tasksApi } from '@/api/tasks'
import type { Task, CreateTaskInput } from '@/types/api'

export function useCreateTask() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const submit = async (input: CreateTaskInput): Promise<Task | null> => {
    setLoading(true)
    setError(null)
    try {
      return await tasksApi.create(input)
    } catch (e) {
      setError(e as Error)
      return null
    } finally {
      setLoading(false)
    }
  }

  return { submit, loading, error }
}
```

---

## 类型同步流程

```
后端改 schema.types.go
    ↓ make sync-types (在 backend 跑)
    ↓ tygo 生成
src/types/api.ts (前端，不要手改)
    ↓ npm run type-check
检测出哪些 page/component 用了旧字段
    ↓ 顺势改
```

**触发 `/verify-types` skill**：会自动跑 `npm run type-check` 并提示是否需要切到后端同步。

---

## 错误处理

- **网络/HTTP 错误**：由 `client.ts` 的拦截器统一抛 `Error('[api] xxx')`
- **业务错误**：组件 / hook 层拿 message 显示 toast
- **404 / 403**：可以加路由级拦截（`react-router` loader 或 `errorElement`），暂不实施

```tsx
// 组件展示错误
const { submit, error, loading } = useCreateTask()
if (error) return <ErrorBanner msg={error.message} />
```

---

## WebSocket（特殊情况）

DAG 监控用 WS，不放 `api/`，而是 `hooks/useDagSocket.ts`，因为它是订阅而非请求-响应。

```ts
export function useDagSocket(taskId: string) {
  useEffect(() => {
    const ws = new WebSocket(`/ws/dag/${taskId}`)
    ws.onmessage = (ev) => useTaskStore.getState().update(JSON.parse(ev.data))
    return () => ws.close()
  }, [taskId])
}
```

---

## 反模式

- ❌ 组件里 `axios.get(...)` / `fetch(...)`
- ❌ 在 `api/` 文件里直接操作 store（让 hook 做这件事）
- ❌ API 返回类型用 `any`（必须从 `types/api.ts` import）
- ❌ 在 `api/` 文件做 UI 决策（toast/redirect 应该在组件/hooks 层）
- ❌ 改后端字段不跑 `make sync-types`
