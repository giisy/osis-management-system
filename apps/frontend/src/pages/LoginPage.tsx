import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { isAxiosError } from 'axios'
import { loginSchema, type LoginFormData } from '../features/auth/loginSchema'
import { useLogin } from '../features/auth/useLogin'
import { Link } from 'react-router-dom'

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const loginMutation = useLogin()

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data)
  }

  const serverErrorMessage = isAxiosError(loginMutation.error)
    ? loginMutation.error.response?.data?.message
    : null

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-bold text-blue-600 mb-6">
          OSIS Management System
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              {...register('email')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              {...register('password')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          {serverErrorMessage && (
            <p className="text-red-500 text-sm text-center">{serverErrorMessage}</p>
          )}

          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loginMutation.isPending ? 'Memproses...' : 'Login'}
          </button>
        </form>
      </div>
              <p className="text-sm text-gray-500 text-center mt-4">
          Belum punya akun?{' '}
          <Link to="/register" className="text-blue-600 hover:underline">
            Daftar
          </Link>
        </p>
    </div>
  )
}