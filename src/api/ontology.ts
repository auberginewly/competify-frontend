import { client } from './client'
import type { Competitor } from '@/types/api'
import type { DagEdge, DagNode } from '@/types/ui'

// 对应后端 internal/handler/ontology.go
export const ontologyApi = {
  graph:           () => client.get<{ nodes: DagNode[]; edges: DagEdge[] }, { nodes: DagNode[]; edges: DagEdge[] }>('/ontology/graph'),
  listCompetitors: () => client.get<Competitor[], Competitor[]>('/ontology/competitors'),
  list:            () => client.get<Competitor[], Competitor[]>('/ontology/competitors'),
  getCompetitor:   (name: string) => client.get<Competitor, Competitor>(`/ontology/competitors/${name}`),
}
