import { client } from './client'
import type { FinalReport } from '@/types/api'
import type { CreateTaskInput, Task } from '@/types/ui'

// 对应后端 internal/handler/task.go + report.go
export const tasksApi = {
  create: (input: CreateTaskInput) => client.post<Task, Task>('/tasks', input),
  get:    (id: string)              => client.get<Task, Task>(`/tasks/${id}`),
  report: (id: string)              => client.get<FinalReport, FinalReport>(`/tasks/${id}/report`),
}
