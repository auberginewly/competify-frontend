// Frontend-only types that do not exist in the backend schema.
// Backend-generated types live in types/api.ts (tygo output).

import type { AgentStatus } from './api'

export interface Task {
  task_id: string
  status: AgentStatus
  created_at: string
}

export interface DagNode {
  id: string
  agent: string
  status: AgentStatus
}

export interface DagEdge {
  source: string
  target: string
}
