# 前端架构

## 技术栈速览

| 维度 | 选型 | 为什么 |
|------|------|--------|
| 构建 | Vite 5 | 启动快 / HMR 一致性好 / 生态成熟 |
| 框架 | React 18 | 团队熟悉 + 生态最广 |
| 类型 | TypeScript 5 严格模式 | 跨仓契约靠 tygo 自动生成，全栈类型安全 |
| 状态 | Zustand | 比 Redux 轻 / 不强制 reducer，按域拆 store |
| 路由 | React Router v6 | data routers 之外的能力前端用不到 |
| 样式 | Tailwind CSS | 唯一样式方案，所有组件 className |
| DAG | ReactFlow | DAG 节点 + 边自定义渲染最成熟 |
| 图谱 | Cytoscape.js | 本体力导向布局 / 时序回放 |
| 时间线 | D3.js | 溯源 timeline 需要自定义 axis |
| Markdown | react-markdown | 报告页 + 脚注下钻 |
| 动效 | Framer Motion | 节点状态切换 / 页面转场 |

---

## 数据流

```
后端 HTTP/WS  ←→  api/ 层  ←→  hooks/ (副作用)  ←→  store/ (Zustand)
                                                       ↓
                                                  pages/ (组装)
                                                       ↓
                                                  components/ (展示)
```

**关键约束**：
- 组件**永远不直接调 API**，必须经过 hooks
- hooks 是 API ↔ store 的唯一桥梁
- store 是 page/component 共享状态的唯一来源
- 页面内一次性的 UI 状态用 `useState`，跨组件共享才进 store

---

## 5 个页面职责

| 页面 | 路径 | 核心组件 | 数据源 |
|------|------|---------|--------|
| TaskLaunch | `/` | Monaco Editor / SchemaConfig | `POST /api/v1/tasks` |
| DagMonitor | `/dag/:taskId` | ReactFlow / StatusNode / ParticleEdge | WebSocket `/ws/dag/:taskId` |
| Provenance | `/provenance/:reportId` | D3 Timeline / MerkleNode | `GET /api/v1/audit/:reportId` |
| OntologyGraph | `/ontology` | Cytoscape Canvas / TimeSlider | `GET /api/v1/ontology/graph` |
| ReportView | `/report/:id` | react-markdown / FootnoteDrawer | `GET /api/v1/reports/:id` |

---

## WebSocket 生命周期

DAG 实时监控是唯一的 WS 用例，必须在 hooks 层单点管理：

```ts
// hooks/useDagSocket.ts
export function useDagSocket(taskId: string) {
  useEffect(() => {
    const ws = new WebSocket(`/ws/dag/${taskId}`)
    ws.onmessage = (ev) => store.update(JSON.parse(ev.data))
    return () => ws.close()  // ⚠️ 必须在 cleanup 关
  }, [taskId])
}
```

**绝对不要**：
- 在组件内直接 `new WebSocket(...)`
- 多个组件各自建 WS 连接（连接数爆炸）
- 忘记 cleanup（StrictMode 下会触发两次连接，cleanup 必须幂等）

---

## 路由结构

```tsx
<Routes>
  <Route path="/" element={<TaskLaunch />} />
  <Route path="/dag/:taskId" element={<DagMonitor />} />
  <Route path="/provenance/:reportId" element={<Provenance />} />
  <Route path="/ontology" element={<OntologyGraph />} />
  <Route path="/report/:id" element={<ReportView />} />
</Routes>
```

---

## 构建产物

`vite build` 产物在 `dist/`：
- 单 HTML + 拆分 chunk（vendor / 各 page）
- Tailwind 经 PurgeCSS 后 < 30KB
- ReactFlow / Cytoscape 用 dynamic import 避免首屏过大（Phase 7 实施）
