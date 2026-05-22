import type { ReactNode } from 'react'

// 通用卡片容器。
interface CardProps {
  title?: ReactNode
  children: ReactNode
  className?: string
}

export function Card({ title, children, className = '' }: CardProps) {
  return (
    <section className={`rounded-lg border border-slate-800 bg-slate-900 p-5 ${className}`}>
      {title && <div className="mb-3 text-sm font-medium text-slate-200">{title}</div>}
      {children}
    </section>
  )
}
