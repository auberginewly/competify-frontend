import { ButtonHTMLAttributes } from 'react'

// 通用 Button。仅样式收口，不引入额外组件库。
type Variant = 'primary' | 'secondary' | 'ghost'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
}

function variantClass(v: Variant): string {
  switch (v) {
    case 'primary':   return 'bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-60'
    case 'secondary': return 'bg-slate-700 hover:bg-slate-600 text-slate-100 disabled:opacity-60'
    case 'ghost':     return 'text-slate-300 hover:bg-slate-800 disabled:opacity-60'
  }
}

export function Button({ variant = 'primary', className = '', ...rest }: ButtonProps) {
  return (
    <button
      type="button"
      className={`rounded px-4 py-2 text-sm font-medium transition-colors ${variantClass(variant)} ${className}`}
      {...rest}
    />
  )
}
