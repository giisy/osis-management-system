import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import AnggotaForm from '../features/anggota/AnggotaForm'
import { useCreateAnggota } from '../features/anggota/useAnggotaMutation'
import type { AnggotaFormData } from '../features/anggota/anggotaSchema'

export default function AnggotaCreatePage() {
  const navigate = useNavigate()
  const createMutation = useCreateAnggota()

  const handleSubmit = (data: AnggotaFormData) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        navigate('/anggota')
      },
    })
  }

  return (
    <div>
      <button
        onClick={() => navigate('/anggota')}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-4"
      >
        <ArrowLeft size={16} />
        Kembali
      </button>

      <h1 className="text-2xl font-bold text-gray-800 mb-6">Tambah Anggota</h1>

      <div className="bg-white rounded-xl border border-gray-200 p-4 max-w-lg">
        <AnggotaForm
          mode="create"
          onSubmit={handleSubmit}
          isSubmitting={createMutation.isPending}
          submitError={createMutation.error}
        />
      </div>
    </div>
  )
}