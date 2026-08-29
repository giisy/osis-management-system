import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { isAxiosError } from 'axios'
import dayjs from '../../lib/dayjs'
import { agendaSchema, type AgendaFormValues } from './agendaSchema'
import type { Agenda, AgendaPayload } from './agendaApi'

interface AgendaFormProps {
  defaultValues?: Agenda
  defaultDate?: string
  onSubmit: (data: AgendaPayload) => void
  isSubmitting: boolean
  submitError?: unknown
}

export default function AgendaForm({
  defaultValues,
  defaultDate,
  onSubmit,
  isSubmitting,
  submitError,
}: AgendaFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AgendaFormValues>({
    resolver: zodResolver(agendaSchema),
    defaultValues: defaultValues
      ? {
          judul: defaultValues.judul,
          deskripsi: defaultValues.deskripsi ?? '',
          lokasi: defaultValues.lokasi ?? '',
          tanggalMulai: dayjs(defaultValues.waktuMulai).format('YYYY-MM-DD'),
          jamMulai: dayjs(defaultValues.waktuMulai).format('HH:mm'),
          tanggalSelesai: defaultValues.waktuSelesai
            ? dayjs(defaultValues.waktuSelesai).format('YYYY-MM-DD')
            : '',
          jamSelesai: defaultValues.waktuSelesai
            ? dayjs(defaultValues.waktuSelesai).format('HH:mm')
            : '',
        }
      : {
          tanggalMulai: defaultDate ?? dayjs().format('YYYY-MM-DD'),
          jamMulai: '08:00',
        },
  })

  const errorMessage = isAxiosError(submitError)
    ? submitError.response?.data?.message
    : null

  const handleFormSubmit = (data: AgendaFormValues) => {
    const waktuMulai = dayjs(`${data.tanggalMulai}T${data.jamMulai}`).toISOString()
    const waktuSelesai =
      data.tanggalSelesai && data.jamSelesai
        ? dayjs(`${data.tanggalSelesai}T${data.jamSelesai}`).toISOString()
        : undefined

    onSubmit({
      judul: data.judul,
      deskripsi: data.deskripsi || undefined,
      lokasi: data.lokasi || undefined,
      waktuMulai,
      waktuSelesai,
    })
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Judul</label>
        <input
          {...register('judul')}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.judul && <p className="text-red-500 text-sm mt-1">{errors.judul.message}</p>}
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
        <label className="block text-sm font-medium text-gray-700 mb-1">Lokasi</label>
        <input
          {...register('lokasi')}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Mulai</label>
          <input
            type="date"
            {...register('tanggalMulai')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.tanggalMulai && (
            <p className="text-red-500 text-sm mt-1">{errors.tanggalMulai.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Jam Mulai</label>
          <input
            type="time"
            {...register('jamMulai')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.jamMulai && (
            <p className="text-red-500 text-sm mt-1">{errors.jamMulai.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tanggal Selesai <span className="text-gray-400">(opsional)</span>
          </label>
          <input
            type="date"
            {...register('tanggalSelesai')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Jam Selesai <span className="text-gray-400">(opsional)</span>
          </label>
          <input
            type="time"
            {...register('jamSelesai')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      {errors.tanggalSelesai && (
        <p className="text-red-500 text-sm">{errors.tanggalSelesai.message}</p>
      )}

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