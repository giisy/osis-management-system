import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { isAxiosError } from 'axios'
import { pengumumanSchema, type PengumumanFormValues } from './pengumumanSchema'
import type { Pengumuman } from './pengumumanApi'

interface PengumumanFormProps {
  defaultValues?: Pengumuman
  onSubmit: (data: PengumumanFormValues) => void
  isSubmitting: boolean
  submitError?: unknown
}

export default function PengumumanForm({
  defaultValues,
  onSubmit,
  isSubmitting,
  submitError,
}: PengumumanFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PengumumanFormValues>({
    resolver: zodResolver(pengumumanSchema),
    defaultValues: defaultValues
      ? {
          judul: defaultValues.judul,
          isi: defaultValues.isi,
        }
      : undefined,
  })

  const errorMessage = isAxiosError(submitError)
    ? submitError.response?.data?.message
    : null

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Judul</label>
        <input
          {...register('judul')}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.judul && <p className="text-red-500 text-sm mt-1">{errors.judul.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Isi</label>
        <textarea
          {...register('isi')}
          rows={5}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.isi && <p className="text-red-500 text-sm mt-1">{errors.isi.message}</p>}
      </div>

      {errorMessage && <p className="text-red-500 text-sm text-center">{errorMessage}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Menyimpan...' : 'Simpan'}
      </button>
    </form>
  )
}