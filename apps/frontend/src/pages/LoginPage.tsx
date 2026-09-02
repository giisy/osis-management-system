import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { isAxiosError } from 'axios'
import { Link } from 'react-router-dom'
import { loginSchema, type LoginFormData } from '../features/auth/loginSchema'
import { useLogin } from '../features/auth/useLogin'
import AuthLayout from '../components/layout/AuthLayout'

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
    <AuthLayout title="Masuk ke akunmu" subtitle="Lanjutkan mengelola kegiatan OSIS kamu.">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
          <input
            type="email"
            {...register('email')}
            placeholder="nama@sekolah.sch.id"
            className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition"
          />
          {errors.email && <p className="text-red-500 text-xs mt-1.5">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
          <input
            type="password"
            {...register('password')}
            placeholder="••••••••"
            className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition"
          />
          {errors.password && (
            <p className="text-red-500 text-xs mt-1.5">{errors.password.message}</p>
          )}
        </div>

        {serverErrorMessage && (
          <p className="text-red-500 text-sm bg-red-50 border border-red-100 rounded-lg px-3 py-2">
            {serverErrorMessage}
          </p>
        )}

        <button
          type="submit"
          disabled={loginMutation.isPending}
          className="w-full bg-blue-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loginMutation.isPending ? 'Memproses...' : 'Masuk'}
        </button>
      </form>

      <p className="text-sm text-slate-500 text-center mt-8">
        Belum punya akun?{' '}
        <Link to="/register" className="text-blue-600 font-medium hover:underline">
          Daftar
        </Link>
      </p>
    </AuthLayout>
  )
}