import { useEffect } from 'react'
import { useTaskStore } from '@/store/taskStore'

// DAG 实时状态订阅。Phase 0 仅签名占位，Phase 7 接 WebSocket。
//
// 关键约束（见 docs/frontend-architecture.md WebSocket 生命周期）：
// 1. 单点管理：组件不直接 new WebSocket
// 2. cleanup 必须关连接，避免 StrictMode 重复连接泄漏
export function useDagSocket(taskId: string | undefined) {
  const updateStatus = useTaskStore((s) => s.updateStatus)

  useEffect(() => {
    if (!taskId) return
    // TODO Phase 7: const ws = new WebSocket(`/ws/dag/${taskId}`)
    //               ws.onmessage = (ev) => updateStatus(JSON.parse(ev.data).agent, ...)
    //               return () => ws.close()
  }, [taskId, updateStatus])
}
