import { client } from './client'
import type { UserQuery } from '@/types/api'
import type { Task } from '@/types/ui'

// 对应后端 internal/handler/task.go + report.go
export const tasksApi = {
  create: (input: UserQuery) => client.post<{ task_id: string }, { task_id: string }>('/tasks', input),
  get:    (id: string)       => client.get<Task, Task>(`/tasks/${id}`),
}
