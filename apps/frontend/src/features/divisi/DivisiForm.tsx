import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { isAxiosError } from 'axios'
import { divisiSchema, type DivisiFormValues } from './divisiSchema'
import type { Divisi } from './divisiApi'

interface DivisiFormProps {
  defaultValues?: Divisi
  onSubmit: (data: DivisiFormValues) => void
  isSubmitting: boolean
  submitError?: unknown
}

export default function DivisiForm({
  defaultValues,
  onSubmit,
  isSubmitting,
  submitError,
}: DivisiFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DivisiFormValues>({
    resolver: zodResolver(divisiSchema),
    defaultValues: defaultValues
      ? {
          nama: defaultValues.nama,
          deskripsi: defaultValues.deskripsi ?? '',
        }
      : undefined,
  })

  const errorMessage = isAxiosError(submitError)
    ? submitError.response?.data?.message
    : null

return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nama Divisi</label>
        <input
          {...register('nama')}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.nama && <p className="text-red-500 text-sm mt-1">{errors.nama.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
        <textarea
          {...register('deskripsi')}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
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