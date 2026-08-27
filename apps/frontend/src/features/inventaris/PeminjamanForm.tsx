import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { isAxiosError } from 'axios'
import dayjs from '../../lib/dayjs'
import {
  peminjamanSchema,
  type PeminjamanFormInput,
  type PeminjamanFormValues,
} from './peminjamanSchema'
import { useBarangList } from './useBarang'

interface PeminjamanFormProps {
  onSubmit: (data: PeminjamanFormValues) => void
  isSubmitting: boolean
  submitError?: unknown
}

export default function PeminjamanForm({
  onSubmit,
  isSubmitting,
  submitError,
}: PeminjamanFormProps) {
  const { data: barangData } = useBarangList()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PeminjamanFormInput, unknown, PeminjamanFormValues>({
    resolver: zodResolver(peminjamanSchema),
    defaultValues: {
      tanggalPinjam: dayjs().format('YYYY-MM-DD'),
    },
  })

  const errorMessage = isAxiosError(submitError)
    ? submitError.response?.data?.message
    : null

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Barang</label>
        <select
          {...register('barangId')}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Pilih barang</option>
          {barangData?.data
            .filter((b) => b.kondisi !== 'RUSAK_BERAT')
            .map((barang) => (
              <option key={barang.id} value={barang.id}>
                {barang.nama} (tersedia: {barang.stokTersedia})
              </option>
            ))}
        </select>
        {errors.barangId && (
          <p className="text-red-500 text-sm mt-1">{errors.barangId.message}</p>
        )}
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
        <label className="block text-sm font-medium text-gray-700 mb-1">Keperluan</label>
        <input
          {...register('keperluan')}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Pinjam</label>
        <input
          type="date"
          {...register('tanggalPinjam')}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.tanggalPinjam && (
          <p className="text-red-500 text-sm mt-1">{errors.tanggalPinjam.message}</p>
        )}
      </div>

      {errorMessage && <p className="text-red-500 text-sm text-center">{errorMessage}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Menyimpan...' : 'Pinjam'}
      </button>
    </form>
  )
}