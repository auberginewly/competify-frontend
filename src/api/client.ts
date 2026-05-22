import axios, { AxiosError } from 'axios'

// Axios 实例 + 拦截器。组件 / hook 不直接 import axios，只 import 各 API 文件。
export const client = axios.create({
  baseURL: '/api/v1',
  timeout: 30_000,
  headers: { 'Content-Type': 'application/json' },
})

client.interceptors.response.use(
  (res) => res.data,
  (err: AxiosError<{ message?: string }>) => {
    const msg = err.response?.data?.message ?? err.message
    return Promise.reject(new Error(`[api] ${msg}`))
  },
)
