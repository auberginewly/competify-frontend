---
name: new-component
description: 新增展示组件，按功能域选目录、强制 200 行限制、props 类型严格定义
---

# /new-component — 新增组件的标准流程

触发时机：用户说「加个组件」「新组件 XXX」「拆一下 Xxx 这个组件」。

## 前置阅读

1. `docs/component-patterns.md` — 三层边界 + 组件规范
2. `docs/styling-guide.md` — Tailwind 状态色编码
3. 看现有同域组件：`src/components/<域>/`

## 执行步骤

### Step 1：选目录

| 功能域 | 子目录 |
|--------|--------|
| DAG 监控（节点 / 边 / 工具栏） | `components/dag/` |
| 溯源审计（时间线 / Merkle Tree） | `components/provenance/` |
| 本体图谱（画布 / 滑块） | `components/ontology/` |
| 跨页面通用（按钮 / 卡片 / Modal） | `components/ui/` |

如果不属于以上 4 类，新建子目录前先想清楚是不是该归并到现有目录。

### Step 2：新建文件

命名 PascalCase + named export（**只有 page 用 default export**）：

```tsx
// src/components/dag/StatusBadge.tsx
import type { AgentStatus } from '@/types/api'

interface StatusBadgeProps {
  status: AgentStatus
  label?: string
}

export function StatusBadge({ status, label }: StatusBadgeProps) {
  // …
}
```

### Step 3：约束清单

- ✅ Props 用 interface 显式定义，禁用 `any`
- ✅ 没有 `useEffect` 调 API（应该让 page 通过 hooks 拿到数据再传 props）
- ✅ 没有 `useStore` 直接读全局状态（如果需要状态由 props 传）
- ✅ 单文件 ≤ 200 行
- ✅ 状态色通过 `docs/styling-guide.md` 里的映射函数走，不硬编码 `bg-yellow-500`

### Step 4：例外情况

某些组件确实需要订阅 store（如全局 Toast），可以用 selector：

```tsx
const toast = useUiStore((s) => s.toast)  // 仅订阅 toast 字段
```

但**列表组件 / 卡片组件 / 通用基础组件** 不应订阅 store，必须 props down。

### Step 5：验证

```bash
npm run type-check       # 类型检查
npm run lint             # ESLint
npm run dev              # 跑起来肉眼看
```

## 完成检查清单

- [ ] 文件放在正确的子目录
- [ ] named export，命名 PascalCase
- [ ] Props interface 显式，无 any
- [ ] 单文件 ≤ 200 行
- [ ] 没有 fetch / axios / WebSocket / setTimeout 副作用
- [ ] 状态色经映射函数（如果用了状态色）
- [ ] `npm run build` 通过

## 反模式（禁止）

- ❌ 在 component 内 `axios.get(...)`
- ❌ 在 component 内 `new WebSocket(...)`
- ❌ Props 类型 `any` / `object` / `Record<string, any>`
- ❌ 硬编码 `bg-yellow-400 animate-pulse`（走映射）
- ❌ 单文件 > 200 行还不拆
- ❌ 默认 export（除 page 外）
