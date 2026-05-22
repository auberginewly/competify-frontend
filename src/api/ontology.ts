import { client } from './client'
import type { DagEdge, DagNode } from '@/types/ui'

// 对应后端 internal/handler/ontology.go
// Phase 0 占位类型：本体图谱节点/边复用 DagNode/Edge，Phase 5 落地后由 tygo 替换。
export const ontologyApi = {
  graph:           () => client.get<{ nodes: DagNode[]; edges: DagEdge[] }, { nodes: DagNode[]; edges: DagEdge[] }>('/ontology/graph'),
  listCompetitors: () => client.get<string[], string[]>('/ontology/competitors'),
}
