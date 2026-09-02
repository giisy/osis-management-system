import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from 'react-router-dom'
import { isAxiosError } from 'axios'
import { registerSchema, type RegisterFormData } from '../features/auth/registerSchema'
import { useRegister } from '../features/auth/useRegister'
import AuthLayout from '../components/layout/AuthLayout'

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const registerMutation = useRegister()

  const onSubmit = (data: RegisterFormData) => {
    registerMutation.mutate(data)
  }

  const errorMessage = isAxiosError(registerMutation.error)
    ? registerMutation.error.response?.data?.message
    : null

  return (
    <AuthLayout title="Buat akun baru" subtitle="Gabung dan mulai kelola kegiatan OSIS.">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Nama</label>
          <input
            {...register('name')}
            placeholder="Nama lengkap"
            className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition"
          />
          {errors.name && <p className="text-red-500 text-xs mt-1.5">{errors.name.message}</p>}
        </div>

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
            placeholder="Minimal 8 karakter"
            className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition"
          />
          {errors.password && (
            <p className="text-red-500 text-xs mt-1.5">{errors.password.message}</p>
          )}
        </div>

        {errorMessage && (
          <p className="text-red-500 text-sm bg-red-50 border border-red-100 rounded-lg px-3 py-2">
            {errorMessage}
          </p>
        )}

        <button
          type="submit"
          disabled={registerMutation.isPending}
          className="w-full bg-blue-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {registerMutation.isPending ? 'Mendaftar...' : 'Daftar'}
        </button>
      </form>

      <p className="text-sm text-slate-500 text-center mt-8">
        Sudah punya akun?{' '}
        <Link to="/login" className="text-blue-600 font-medium hover:underline">
          Masuk
        </Link>
      </p>
    </AuthLayout>
  )
}