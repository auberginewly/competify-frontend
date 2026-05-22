---
name: new-page
description: 新增一个 page，包含路由注册 + 引用 hooks + 不写业务逻辑的三层边界检查
---

# /new-page — 新增页面的标准流程

触发时机：用户说「加一个页面」「新页面 XXX」「实现 /xxx 路由」。

## 前置阅读

1. `docs/component-patterns.md` — pages/components/hooks 三层边界
2. `docs/frontend-architecture.md` — 数据流 + 路由结构
3. `src/App.tsx` — 看现有路由怎么挂的
4. `../competify-backend/docs/api.md` — 这个页面要调哪些后端接口

## 执行步骤

### Step 1：确认页面定位

问用户：
- 路径是什么？（如 `/settings`）
- 主要数据从哪来？REST / WebSocket / 静态
- 是否需要 URL 参数？（如 `:taskId`）
- 跨页面共享的状态有吗？是否要进 store

### Step 2：在 `src/pages/` 新建文件

命名 PascalCase 与组件名一致：`Settings.tsx`。骨架：

```tsx
import { useParams } from 'react-router-dom'
import { useXxxApi } from '@/hooks/useXxxApi'

export default function Settings() {
  const { id } = useParams<{ id: string }>()
  const { data, loading, error } = useXxxApi(id)

  if (loading) return <div className="p-8 text-slate-400">加载中…</div>
  if (error)   return <div className="p-8 text-status-error">{error.message}</div>

  return (
    <div className="space-y-6 p-8">
      <h1 className="text-2xl font-semibold">设置</h1>
      {/* 组装 components */}
    </div>
  )
}
```

**铁律**：page 不写业务逻辑、不直接 fetch / new WebSocket，全部走 hooks。

### Step 3：注册路由

编辑 `src/App.tsx`，在 `<Routes>` 加：

```tsx
<Route path="/settings" element={<Settings />} />
```

如果是常用页面，同时把 NavLink 加到 `navItems` 数组。

### Step 4：API / Hook 准备

如果该 page 需要新的后端调用：
- API 函数加在 `src/api/<domain>.ts`（按业务域分文件）
- Hook 包一层放在 `src/hooks/use<Xxx>.ts`
- 类型从 `@/types/api` import（**禁止**手写，由后端 sync-types 生成）

### Step 5：组件拆分

如果 page 超过 150 行，立刻拆 component 到 `src/components/<domain>/`，单文件 ≤ 200 行。

### Step 6：验证

```bash
npm run type-check
npm run build
```

dev server 跑起来手动点一下路由：
```bash
npm run dev
```

## 完成检查清单

- [ ] `src/pages/Xxx.tsx` 创建，单文件 ≤ 150 行
- [ ] `src/App.tsx` 注册路由
- [ ] page 没有直接 fetch / axios / new WebSocket
- [ ] 所有 API 类型来自 `@/types/api`，无 `any`
- [ ] `npm run build` 通过

## 反模式（禁止）

- ❌ page 内 `useEffect(() => { fetch(...) })`（应在 hooks）
- ❌ page 内直接读 store 复杂派生数据（拆 hook）
- ❌ page 超过 150 行还不拆 component
- ❌ 手改 `types/api.ts`（由后端生成）
