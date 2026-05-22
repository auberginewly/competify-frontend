# 状态管理（Zustand）

## 核心原则

**3 类状态的归属：**

| 状态类型 | 归属 | 例子 |
|---------|------|------|
| 单组件内部 UI 状态 | `useState` | Modal 是否打开 / 输入框临时值 / hover |
| 跨组件共享状态 | Zustand store | DAG 节点状态 / 当前任务 ID / 全局 toast |
| 服务端缓存 | hooks + store | API 返回的 task / report 数据 |

**铁律**：单组件用不到的状态绝不进 store。Zustand 不是全局变量仓库。

---

## Store 拆分（按域）

```
store/
├── taskStore.ts    ← 任务 + DAG 实时状态（被 TaskLaunch / DagMonitor 共享）
└── uiStore.ts      ← UI 全局状态（toast / modal / theme）
```

**禁止**：
- 一个 `globalStore` 装所有东西
- 把页面专属 state 放进 store（用 `useState` 即可）

### 何时拆新 store

满足以下任一条件再考虑新 store：
1. 跨 3+ 个页面共享
2. 有独立的生命周期（如 ontology 图谱状态在切页面后还要保留）
3. 与现有 store 完全无业务关系

---

## taskStore 设计示例

```ts
import { create } from 'zustand'
import type { AgentStatus, DagNode, DagEdge } from '@/types/api'

interface TaskState {
  taskId: string | null
  nodes: DagNode[]
  edges: DagEdge[]
  statuses: Record<string, AgentStatus>

  setTask: (id: string) => void
  update: (msg: { agentId: string; status: AgentStatus }) => void
  reset: () => void
}

export const useTaskStore = create<TaskState>((set) => ({
  taskId: null,
  nodes: [],
  edges: [],
  statuses: {},

  setTask: (id) => set({ taskId: id, statuses: {} }),
  update: (msg) => set((s) => ({
    statuses: { ...s.statuses, [msg.agentId]: msg.status },
  })),
  reset: () => set({ taskId: null, nodes: [], edges: [], statuses: {} }),
}))
```

**注意**：
- selector 用法（`useTaskStore(s => s.taskId)`）确保只在订阅字段变化时重渲染
- 写 action 不要直接 mutate state（用 spread 或 immer middleware）

---

## 在组件里的用法

```tsx
// ✅ Good: selector + 解耦
function StatusBadge({ agentId }: { agentId: string }) {
  const status = useTaskStore((s) => s.statuses[agentId])
  return <div className={`text-status-${status}`}>{status}</div>
}

// ❌ Bad: 整个 store 都订阅，任何字段变都会重渲染
function StatusBadge({ agentId }: { agentId: string }) {
  const store = useTaskStore()
  return <div>{store.statuses[agentId]}</div>
}
```

---

## 反模式

- ❌ 把 props 包一层进 store 当全局变量（让 props 直接传下去）
- ❌ 在 store 里写大段业务逻辑（应该在 hooks/api 里）
- ❌ store 之间互相 `getState()` 调用形成循环依赖（拆 store 拆错了）
- ❌ 把临时 UI 状态（hover/focus）放进 store
