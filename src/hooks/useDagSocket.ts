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

const MAX_RECONNECT = 5
const BASE_DELAY = 1000

export function useDagSocket(taskId: string | undefined) {
  const [logs, setLogs] = useState<string[]>([])
  const [connected, setConnected] = useState(false)
  const updateStatus = useTaskStore((s) => s.updateStatus)
  const logsRef = useRef<string[]>([])
  const reconnectCount = useRef(0)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!taskId) return

    let ws: WebSocket | null = null
    let cancelled = false

    const connect = () => {
      if (cancelled) return
      ws = new WebSocket(`ws://localhost:8080/api/v1/tasks/${taskId}/dag`)

      ws.onopen = () => {
        reconnectCount.current = 0
        setConnected(true)
      }

      ws.onclose = () => {
        setConnected(false)
        if (cancelled || reconnectCount.current >= MAX_RECONNECT) return
        reconnectCount.current++
        const delay = Math.min(BASE_DELAY * Math.pow(2, reconnectCount.current), 30000)
        timerRef.current = setTimeout(connect, delay)
      }

      ws.onerror = (e) => {
        console.error('[ws] error', e)
        setConnected(false)
      }

      ws.onmessage = (ev) => {
        try {
          const data = JSON.parse(ev.data) as DagEvent
          // Don't overwrite existing non-pending status with pending on reconnect.
          // The server sends all agents as pending when WebSocket first connects.
          const currentStatus = useTaskStore.getState().statuses[data.node_name]
          if (data.status === 'pending' && currentStatus && currentStatus !== 'pending') {
            return
          }
          updateStatus(data.node_name, data.status as AgentStatus)
          if (data.logs && data.logs.length > 0) {
            logsRef.current = [...logsRef.current, ...data.logs].slice(-50)
            setLogs(logsRef.current)
          }
        } catch (err) {
          console.error('[ws] parse error', err)
        }
      }
    }

    connect()

    return () => {
      cancelled = true
      if (timerRef.current) clearTimeout(timerRef.current)
      ws?.close()
    }
  }, [taskId, updateStatus])

  return { logs, connected }
}
