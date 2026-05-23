// Phase 0 placeholder types — 前端独立维护，仅用于 placeholder UI。
// Phase 2 后端实现 HTTP handler 时，这些类型会迁回 backend internal/schema/types.go
// 然后通过 tygo 进入 types/api.ts，本文件即可删除对应条目。

import type { AgentStatus } from './api'

// 任务响应占位（对齐后端 stub 返回的 taskStatus）
export interface Task {
  task_id: string
  status: AgentStatus
  created_at: string
}

// DAG WebSocket payload 占位
export interface DagNode {
  id: string
  agent: string
  status: AgentStatus
}

export interface DagEdge {
  source: string
  target: string
}

// 审计事件占位
export interface AuditEvent {
  agent: string
  action: string
  confidence: number
  timestamp: string
  merkle_hash: string
}

// 报告片段占位（Phase 7 接 react-markdown 后由 backend FinalReport / DraftReport 替代）
export interface ReportSection {
  title: string
  body: string
  confidence: number
  source_count: number
}
