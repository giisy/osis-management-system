import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { registerUser } from './authApi'

export const useRegister = () => {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      navigate('/login?registered=true')
    },
  })
}