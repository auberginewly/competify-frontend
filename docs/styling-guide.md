# 样式规范（Tailwind only）

## 唯一样式方案

**仅用 Tailwind CSS。** 不引入 styled-components / CSS Modules / Sass，避免多套样式系统并存导致认知负担。

例外：`src/styles/globals.css` 写 Tailwind base/utilities import + 极少量全局 reset。

---

## 状态色编码（与后端 Agent 状态枚举对齐）

所有需要表达 Agent 状态的地方必须用统一的色 + 动效：

| 状态 | Tailwind 颜色类 | 动效类 | 含义 |
|------|----------------|--------|------|
| pending | `text-status-pending` `bg-status-pending` | — | 灰，等待中 |
| running | `text-status-running` `bg-status-running` | `animate-breathe` | 绿，呼吸灯 |
| review | `text-status-review` `bg-status-review` | `animate-blink` | 黄，闪烁，等待人工 |
| error | `text-status-error` `bg-status-error` | `animate-shake` | 红，震动 |
| done | `text-status-done` `bg-status-done` | — | 蓝，完成 |

颜色定义在 `tailwind.config.ts`，动效 keyframes 同一文件。

---

## 工具函数

写一个集中的状态 → className 映射（建议放 `src/components/dag/statusColor.ts`）：

```ts
import type { AgentStatus } from '@/types/api'

export function statusBadge(status: AgentStatus): string {
  const base = 'inline-block rounded px-2 py-0.5 text-xs font-medium'
  switch (status) {
    case 'pending': return `${base} text-status-pending bg-status-pending/10`
    case 'running': return `${base} text-status-running bg-status-running/10 animate-breathe`
    case 'review':  return `${base} text-status-review bg-status-review/10 animate-blink`
    case 'error':   return `${base} text-status-error bg-status-error/10 animate-shake`
    case 'done':    return `${base} text-status-done bg-status-done/10`
  }
}
```

**禁止**在组件内手写 `bg-yellow-500 animate-pulse` 这类直接颜色 + 动效，必须经过映射函数。

---

## 通用色板

- 背景：`bg-slate-950`（最深）/ `bg-slate-900`（卡片）/ `bg-slate-800`（输入框）
- 文字：`text-slate-100`（主）/ `text-slate-400`（次）/ `text-slate-500`（说明）
- 边框：`border-slate-700`（弱）/ `border-slate-600`（中）
- 强调：`text-blue-400`（链接 / 主操作）

---

## 排版

- 标题：`text-2xl font-semibold`（页面）/ `text-lg font-medium`（卡片）
- 正文：`text-sm`（默认）/ `text-base`（重要内容）
- 等宽：`font-mono`（代码片段、ID）

---

## 间距

- 页面级 padding：`p-6` 或 `px-8 py-6`
- 卡片内 padding：`p-4`
- 元素间距：`space-y-3`（垂直） / `gap-3`（grid/flex）

---

## 动效（Framer Motion）

只在 5 个场景用：
1. DAG 节点状态切换（高亮 1s）
2. 页面切换（fade 200ms）
3. Modal 弹出（scale + opacity 150ms）
4. Drawer 滑入（x: 100% → 0, 250ms）
5. List 增删（layout animation）

其余动画走 Tailwind keyframes，不要为了一点交互引入 motion。

---

## 反模式

- ❌ 内联 `style={{ color: '#xxx' }}`（用 Tailwind 类）
- ❌ 直接写 `bg-yellow-500`（用 `bg-status-review` 走映射）
- ❌ 引入 daisyUI / shadcn 等组件库（先用 `components/ui/` 自建基础组件）
- ❌ 全局 CSS 写组件样式（应该在组件 className 里）
- ❌ Framer Motion 包整个页面（按需用在关键交互）
