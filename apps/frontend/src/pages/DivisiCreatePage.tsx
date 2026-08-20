import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import DivisiForm from '../features/divisi/DivisiForm'
import { useCreateDivisi } from '../features/divisi/useDivisiMutation'
import type { DivisiFormValues } from '../features/divisi/divisiSchema'

export default function DivisiCreatePage() {
  const navigate = useNavigate()
  const createMutation = useCreateDivisi()

  const handleSubmit = (data: DivisiFormValues) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        navigate('/divisi')
      },
    })
  }

  return (
    <div>
      <button
        onClick={() => navigate('/divisi')}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-4"
      >
        <ArrowLeft size={16} />
        Kembali
      </button>

      <h1 className="text-2xl font-bold text-gray-800 mb-6">Tambah Divisi</h1>

      <div className="bg-white rounded-xl border border-gray-200 p-4 max-w-lg">
        <DivisiForm
          onSubmit={handleSubmit}
          isSubmitting={createMutation.isPending}
          submitError={createMutation.error}
        />
      </div>
    </div>
  )
}