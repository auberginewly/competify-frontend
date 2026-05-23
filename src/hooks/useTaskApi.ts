import { useState } from 'react'
import { tasksApi } from '@/api/tasks'
import type { UserQuery } from '@/types/api'
import type { Task } from '@/types/ui'

// 任务创建 hook。封装 loading/error 给 page 用。
export function useCreateTask() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const submit = async (input: UserQuery): Promise<Task | null> => {
    setLoading(true)
    setError(null)
    try {
      const res = await tasksApi.create(input)
      // 后端返回 { task_id }，前端 Task 需要 { task_id, status, created_at }
      // 这里构造一个临时 Task 对象
      return {
        task_id: res.task_id,
        status: 'pending' as Task['status'],
        created_at: new Date().toISOString(),
      }
    } catch (e) {
      setError(e as Error)
      return null
    } finally {
      setLoading(false)
    }
  }

  return { submit, loading, error }
}
