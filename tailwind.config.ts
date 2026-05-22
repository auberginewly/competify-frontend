import type { Config } from 'tailwindcss'

// 状态色编码（与后端 Agent 状态枚举对齐，详见 docs/styling-guide.md）
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        status: {
          pending: '#94a3b8', // 灰
          running: '#22c55e', // 绿（呼吸灯）
          review:  '#eab308', // 黄（闪烁）
          error:   '#ef4444', // 红（震动）
          done:    '#3b82f6', // 蓝
        },
      },
      animation: {
        breathe: 'breathe 2s ease-in-out infinite',
        blink:   'blink 1s steps(2, start) infinite',
        shake:   'shake 0.4s linear infinite',
      },
      keyframes: {
        breathe: {
          '0%, 100%': { opacity: '0.6' },
          '50%':      { opacity: '1' },
        },
        blink: {
          'to': { visibility: 'hidden' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%':      { transform: 'translateX(-2px)' },
          '75%':      { transform: 'translateX(2px)' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config
