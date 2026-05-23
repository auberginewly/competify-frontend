import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AgentStatus } from '@/types/api'
import type { DagEdge, DagNode } from '@/types/ui'

// 跨页面共享：当前任务 + DAG 节点状态。
// 单页面临时 UI 状态请用 useState，不要进这里。
interface TaskState {
  taskId: string | null
  nodes: DagNode[]
  edges: DagEdge[]
  statuses: Record<string, AgentStatus>

  setTask: (id: string) => void
  setGraph: (nodes: DagNode[], edges: DagEdge[]) => void
  updateStatus: (agentId: string, status: AgentStatus) => void
  reset: () => void
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set) => ({
      taskId: null,
      nodes: [],
      edges: [],
      statuses: {},

      setTask: (id) => set({ taskId: id, statuses: {} }),
      setGraph: (nodes, edges) => set({ nodes, edges }),
      updateStatus: (agentId, status) =>
        set((s) => ({ statuses: { ...s.statuses, [agentId]: status } })),
      reset: () => set({ taskId: null, nodes: [], edges: [], statuses: {} }),
    }),
    {
      name: 'competify-task',
    }
  )
)
