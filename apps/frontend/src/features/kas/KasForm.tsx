import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { isAxiosError } from 'axios'
import dayjs from '../../lib/dayjs'
import { kasSchema, type KasFormInput, type KasFormValues } from './kasSchema'
import type { Transaksi } from './kasApi'

interface KasFormProps {
  defaultValues?: Transaksi
  onSubmit: (data: KasFormValues) => void
  isSubmitting: boolean
  submitError?: unknown
}

export default function KasForm({
  defaultValues,
  onSubmit,
  isSubmitting,
  submitError,
}: KasFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<KasFormInput, unknown, KasFormValues>({
    resolver: zodResolver(kasSchema),
    defaultValues: defaultValues
      ? {
          jenis: defaultValues.jenis,
          jumlah: defaultValues.jumlah,
          keterangan: defaultValues.keterangan,
          tanggal: dayjs(defaultValues.tanggal).format('YYYY-MM-DD'),
        }
      : {
          jenis: 'PEMASUKAN',
          tanggal: dayjs().format('YYYY-MM-DD'),
        },
  })

  const errorMessage = isAxiosError(submitError)
    ? submitError.response?.data?.message
    : null

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Jenis</label>
        <select
          {...register('jenis')}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="PEMASUKAN">Pemasukan</option>
          <option value="PENGELUARAN">Pengeluaran</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Jumlah (Rp)</label>
        <input
          type="number"
          {...register('jumlah')}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.jumlah && <p className="text-red-500 text-sm mt-1">{errors.jumlah.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Keterangan</label>
        <input
          {...register('keterangan')}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.keterangan && (
          <p className="text-red-500 text-sm mt-1">{errors.keterangan.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal</label>
        <input
          type="date"
          {...register('tanggal')}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.tanggal && <p className="text-red-500 text-sm mt-1">{errors.tanggal.message}</p>}
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