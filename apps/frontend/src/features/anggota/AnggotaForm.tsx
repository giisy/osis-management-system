import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { isAxiosError } from 'axios'
import { anggotaSchema, type AnggotaFormInput, type AnggotaFormData } from './anggotaSchema'
import { useDivisiList } from '../divisi/useDivisiList'
import type { Anggota } from './anggotaApi'

interface AnggotaFormProps {
  mode: 'create' | 'edit'
  defaultValues?: Anggota
  onSubmit: (data: AnggotaFormData) => void
  isSubmitting: boolean
  submitError?: unknown
}

export default function AnggotaForm({
  mode,
  defaultValues,
  onSubmit,
  isSubmitting,
  submitError,
}: AnggotaFormProps) {
  const { data: divisiData } = useDivisiList()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AnggotaFormInput, unknown, AnggotaFormData>({
    resolver: zodResolver(anggotaSchema),
    defaultValues: defaultValues
      ? {
          name: defaultValues.name,
          email: defaultValues.email,
          nis: defaultValues.nis ?? '',
          kelas: defaultValues.kelas ?? '',
          jenisKelamin: (defaultValues.jenisKelamin as 'L' | 'P') ?? undefined,
          noTelepon: defaultValues.noTelepon ?? '',
          alamat: defaultValues.alamat ?? '',
          divisiId: defaultValues.divisi?.id ?? '',
        }
      : undefined,
  })
  const errorMessage = isAxiosError(submitError)
    ? submitError.response?.data?.message
    : null

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nama</label>
        <input
          {...register('name')}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input
          type="email"
          {...register('email')}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Password {mode === 'edit' && <span className="text-gray-400">(kosongkan jika tidak diubah)</span>}
        </label>
        <input
          type="password"
          {...register('password')}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">NIS</label>
        <input
          {...register('nis')}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.nis && <p className="text-red-500 text-sm mt-1">{errors.nis.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Kelas</label>
        <input
          {...register('kelas')}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Kelamin</label>
        <select
          {...register('jenisKelamin')}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Pilih</option>
          <option value="L">Laki-laki</option>
          <option value="P">Perempuan</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">No. Telepon</label>
        <input
          {...register('noTelepon')}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Alamat</label>
        <textarea
          {...register('alamat')}
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Divisi</label>
        <select
          {...register('divisiId')}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Tanpa Divisi</option>
          {divisiData?.data.map((divisi) => (
            <option key={divisi.id} value={divisi.id}>
              {divisi.nama}
            </option>
          ))}
        </select>
      </div>

      {errorMessage && <p className="text-red-500 text-sm text-center">{errorMessage}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Menyimpan...' : mode === 'create' ? 'Tambah Anggota' : 'Simpan Perubahan'}
      </button>
    </form>
  )
}