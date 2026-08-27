import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { isAxiosError } from 'axios'
import { barangSchema, type BarangFormInput, type BarangFormValues } from './barangSchema'
import type { Barang } from './barangApi'

interface BarangFormProps {
  defaultValues?: Barang
  onSubmit: (data: BarangFormValues) => void
  isSubmitting: boolean
  submitError?: unknown
}

export default function BarangForm({
  defaultValues,
  onSubmit,
  isSubmitting,
  submitError,
}: BarangFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BarangFormInput, unknown, BarangFormValues>({
    resolver: zodResolver(barangSchema),
    defaultValues: defaultValues
      ? {
          nama: defaultValues.nama,
          deskripsi: defaultValues.deskripsi ?? '',
          jumlah: defaultValues.jumlah,
          kondisi: defaultValues.kondisi,
        }
      : {
          kondisi: 'BAIK',
        },
  })

  const errorMessage = isAxiosError(submitError)
    ? submitError.response?.data?.message
    : null

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nama Barang</label>
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
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Jumlah</label>
        <input
          type="number"
          {...register('jumlah')}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.jumlah && <p className="text-red-500 text-sm mt-1">{errors.jumlah.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Kondisi</label>
        <select
          {...register('kondisi')}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="BAIK">Baik</option>
          <option value="RUSAK_RINGAN">Rusak Ringan</option>
          <option value="RUSAK_BERAT">Rusak Berat</option>
        </select>
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