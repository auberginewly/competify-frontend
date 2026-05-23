import { useEffect, useState } from 'react'
import { tasksApi } from '@/api/tasks'
import type { UserQuery, AgentStatus } from '@/types/api'

export interface TaskState {
  task_id: string
  status: AgentStatus
  created_at: string
}

// 任务创建 hook。
export function useCreateTask() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const submit = async (input: UserQuery): Promise<string | null> => {
    setLoading(true)
    setError(null)
    try {
      const res = await tasksApi.create(input)
      return res.task_id
    } catch (e) {
      setError(e as Error)
      return null
    } finally {
      setLoading(false)
    }
  }

  return { submit, loading, error }
}

// 轮询任务状态 hook。interval 单位 ms，默认 2000。
export function useGetTask(taskId: string | undefined, interval = 2000) {
  const [task, setTask] = useState<TaskState | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!taskId) return

    let cancelled = false
    const poll = async () => {
      setLoading(true)
      try {
        const res = await tasksApi.get(taskId)
        if (!cancelled) {
          setTask(res as unknown as TaskState)
          setError(null)
        }
      } catch (e) {
        if (!cancelled) setError(e as Error)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    poll()
    const timer = setInterval(poll, interval)
    return () => {
      cancelled = true
      clearInterval(timer)
    }
  }, [taskId, interval])

  return { task, loading, error }
}
