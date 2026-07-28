import { api } from '../../lib/axios'
import type { LoginFormData } from './loginSchema'

interface LoginResponse {
  success: boolean
  message: string
  data: {
    token: string
    user: {
      id: string
      name: string
      email: string
      role: string
    }
  }
}

export const loginUser = async (payload: LoginFormData): Promise<LoginResponse> => {
  const response = await api.post('/api/auth/login', payload)
  return response.data
}