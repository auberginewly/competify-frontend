import { useState } from 'react'
import { tasksApi } from '@/api/tasks'
import type { CreateTaskInput, Task } from '@/types/ui'

// 任务创建 hook。封装 loading/error 给 page 用。
// Phase 0 签名落地，Phase 2 后端有 endpoint 时即可调用。
export function useCreateTask() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const submit = async (input: CreateTaskInput): Promise<Task | null> => {
    setLoading(true)
    setError(null)
    try {
      return await tasksApi.create(input)
    } catch (e) {
      setError(e as Error)
      return null
    } finally {
      setLoading(false)
    }
  }

  return { submit, loading, error }
}
