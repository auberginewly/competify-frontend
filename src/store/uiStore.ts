import { create } from 'zustand'

// 全局 UI 状态。toast / modal / theme 等真正跨页面的临时状态。
interface UiState {
  toast: string | null
  showToast: (msg: string) => void
  clearToast: () => void
}

export const useUiStore = create<UiState>((set) => ({
  toast: null,
  showToast: (msg) => set({ toast: msg }),
  clearToast: () => set({ toast: null }),
}))
