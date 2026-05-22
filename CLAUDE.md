# CompetifyAI Frontend — CLAUDE.md

> 这是给 Claude Code 看的前端工程指南。开始 vibe coding 前请确认你已经读过这个文件。

---

## 项目简介

CompetifyAI 前端 — **React 18 + Vite + ReactFlow** 单页应用，5 个核心页面，做 AI Agent 协作过程的可视化。

后端在 `../competify-backend/`（Go + Eino）。API/WebSocket 契约见 `../competify-backend/docs/api.md`。

**配套设计文档**（必读）：
- `../CompetifyAI 技术架构方案/` — 整体设计
- `../CompetifyAI 工程实现指南.md` — 前端 §4

---

## 技术栈

| 维度 | 选型 |
|------|------|
| 框架 | React 18 + TypeScript |
| 构建 | Vite 5 |
| 样式 | Tailwind CSS（**唯一**样式方案，不引 styled-components / CSS Modules） |
| 状态 | Zustand（按域拆分） |
| 路由 | React Router v6 |
| 图谱 | ReactFlow（DAG）/ Cytoscape.js（本体） / D3.js（溯源时间线） |
| 编辑器 | Monaco Editor |
| Markdown | react-markdown |
| 动效 | Framer Motion |
| HTTP | Axios |

---

## 目录边界（铁律，违反 = 堆屎山起点）

| 目录 | 职责 | 禁止事项 |
|------|------|---------|
| `pages/` | 只组装组件 + 调 hooks | 写业务逻辑、直接 fetch |
| `components/` | 纯展示 props in → JSX out，按功能域分子目录 | 副作用、API 调用、单文件 > 200 行 |
| `hooks/` | 所有副作用（API/WebSocket/Timer/订阅） | 渲染 JSX |
| `api/` | 所有 HTTP 调用（基于 axios 封装） | 在组件里 `fetch(...)` |
| `store/` | Zustand store，按域拆分 | 全局大 store、绕过 store 共享状态 |
| `types/api.ts` | **tygo 从后端生成，禁止手动编辑** | 任何手工修改 |
| `styles/` | 全局 CSS + Tailwind 入口 | 业务样式（应写在组件 className） |

**单组件 ≤ 200 行**，超了立刻拆。

---

## 后端契约

API 路径规范见 `../competify-backend/docs/api.md`，前端必须严格对齐。

**类型同步规则**：
- 后端改了 `internal/schema/types.go`，会跑 `make sync-types` 自动覆盖 `src/types/api.ts`
- 前端编译失败 = 后端字段对不上 = 跑 `/verify-types` 排查
- **永远不要手改 `types/api.ts`**

---

## 状态色编码（与后端 Agent 状态枚举对齐）

| 状态 | Tailwind 类 | 动效 |
|------|-------------|------|
| pending | `text-status-pending` 灰 | 无 |
| running | `text-status-running` 绿 | `animate-breathe` 呼吸灯 |
| review | `text-status-review` 黄 | `animate-blink` 闪烁 |
| error | `text-status-error` 红 | `animate-shake` 震动 |
| done | `text-status-done` 蓝 | 无 |

详见 `docs/styling-guide.md`。

---

## Skill 速查

| 场景 | Skill |
|------|-------|
| 新增页面 | `/new-page` |
| 新增组件 | `/new-component` |
| 验证类型同步 | `/verify-types` |

---

## 规范文档导航

| 任务 | 读哪个文档 |
|------|-----------|
| 不知道数据怎么流的 | `docs/frontend-architecture.md` |
| 不知道组件放哪 | `docs/component-patterns.md` |
| 想加新的状态/不清楚 store 边界 | `docs/state-management.md` |
| 写 API 调用 | `docs/api-integration.md` |
| 不确定颜色/动效 | `docs/styling-guide.md` |

---

## 如何运行

```bash
npm install
npm run dev          # 启动 dev server (默认 5173)
npm run build        # 生产构建
npm run type-check   # 仅做类型检查
npm run lint         # ESLint
```

dev server 通过 Vite proxy 转发 `/api` 和 `/ws` 到 `localhost:8080`（后端）。

---

## 提交规范（Commit Discipline）

**分支策略**：单线推进，不建 feature 分支，所有改动直接在 `main` 上提交。回滚用 `git revert`，不 force push。

**提交前必做 checklist**（完成一个 Phase/模块后，commit 前跑一遍）：

```bash
npm run type-check   # TypeScript 必须零报错
npm run build        # 生产构建必须通过
npm run lint         # ESLint
```

1. **代码可用性**：`npm run type-check` 零报错、`npm run build` 通过。
2. **Skill 辅助验证**：提交前调用 `/verification-before-completion` 做最终检查；遇到 bug 先用 `/systematic-debugging`。
3. **边界条件**：检查空状态（empty state）、加载态（loading）、错误态（error）、响应式断点。
4. **架构可维护性**：组件是否 ≤ 200 行、是否违反目录边界（pages 不写业务、components 不副作用）、是否直接 `fetch`。

**Commit 拆分原则**：
- 一个 commit 只做一件事（如"feat: 实现 DAG 监控页面"、"fix: 修复 WebSocket 重连逻辑"）。
- 禁止把多个不相关的改动塞进同一个 commit。
- **用 `/commit-message-zh` 生成中文 Conventional Commit**，不手写。

---

## 语言约定（来自全局 CLAUDE.md）

- 回复用中文，代码注释用英文，commit 用中文 Conventional Commits
- 输出追求简洁，推理过程详尽
- 优先编辑文件，不重写整个文件
- 复杂任务先 plan
