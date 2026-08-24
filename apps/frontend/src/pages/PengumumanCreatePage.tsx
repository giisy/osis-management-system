import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import PengumumanForm from '../features/pengumuman/PengumumanForm'
import { useCreatePengumuman } from '../features/pengumuman/usePengumumanMutation'
import type { PengumumanFormValues } from '../features/pengumuman/pengumumanSchema'

export default function PengumumanCreatePage() {
  const navigate = useNavigate()
  const createMutation = useCreatePengumuman()

  const handleSubmit = (data: PengumumanFormValues) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        navigate('/pengumuman')
      },
    })
  }

  return (
    <div>
      <button
        onClick={() => navigate('/pengumuman')}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-4"
      >
        <ArrowLeft size={16} />
        Kembali
      </button>

      <h1 className="text-2xl font-bold text-gray-800 mb-6">Tambah Pengumuman</h1>

      <div className="bg-white rounded-xl border border-gray-200 p-4 max-w-lg">
        <PengumumanForm
          onSubmit={handleSubmit}
          isSubmitting={createMutation.isPending}
          submitError={createMutation.error}
        />
      </div>
    </div>
  )
}