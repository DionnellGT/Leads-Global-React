import axios from "axios"

/**
 * Cliente para GlobalApi (login/register/check-status), distinto del
 * cliente de `@/lib/api` que apunta al backend de leads. GlobalApi
 * expone sus rutas bajo el prefijo global `/api` (ver su main.ts:
 * `app.setGlobalPrefix('api')`), así que VITE_GLOBAL_API_URL debe
 * incluirlo, ej: https://globalapi.elavellano.cl/api
 */
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_GLOBAL_API_URL,
})

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
