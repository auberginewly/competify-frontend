import { useEffect, useRef, useState } from 'react'
import { useTaskStore } from '@/store/taskStore'
import type { AgentStatus } from '@/types/api'

interface DagEvent {
  node_name: string
  status: string
  progress: number
  timestamp: string
  logs: string[]
}

export function useDagSocket(taskId: string | undefined) {
  const [logs, setLogs] = useState<string[]>([])
  const [connected, setConnected] = useState(false)
  const updateStatus = useTaskStore((s) => s.updateStatus)
  const logsRef = useRef<string[]>([])

  useEffect(() => {
    if (!taskId) return

    const ws = new WebSocket(`ws://localhost:8080/api/v1/tasks/${taskId}/dag`)

    ws.onopen = () => setConnected(true)
    ws.onclose = () => setConnected(false)
    ws.onerror = (e) => {
      console.error('[ws] error', e)
      setConnected(false)
    }

    ws.onmessage = (ev) => {
      try {
        const data = JSON.parse(ev.data) as DagEvent
        updateStatus(data.node_name, data.status as AgentStatus)
        if (data.logs && data.logs.length > 0) {
          logsRef.current = [...logsRef.current, ...data.logs].slice(-50)
          setLogs(logsRef.current)
        }
      } catch (err) {
        console.error('[ws] parse error', err)
      }
    }

    return () => {
      ws.close()
    }
  }, [taskId, updateStatus])

  return { logs, connected }
}
