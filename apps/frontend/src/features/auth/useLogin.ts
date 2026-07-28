import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { loginUser } from './authApi'

export const useLogin = () => {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: loginUser,
    onSuccess: (response) => {
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))
      navigate('/dashboard')
    },
  })
}