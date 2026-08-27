import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import BarangForm from '../features/inventaris/BarangForm'
import { useCreateBarang } from '../features/inventaris/useBarang'
import type { BarangFormValues } from '../features/inventaris/barangSchema'

export default function BarangCreatePage() {
  const navigate = useNavigate()
  const createMutation = useCreateBarang()

  const handleSubmit = (data: BarangFormValues) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        navigate('/inventaris')
      },
    })
  }

  return (
    <div>
      <button
        onClick={() => navigate('/inventaris')}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-4"
      >
        <ArrowLeft size={16} />
        Kembali
      </button>

      <h1 className="text-2xl font-bold text-gray-800 mb-6">Tambah Barang</h1>

      <div className="bg-white rounded-xl border border-gray-200 p-4 max-w-lg">
        <BarangForm
          onSubmit={handleSubmit}
          isSubmitting={createMutation.isPending}
          submitError={createMutation.error}
        />
      </div>
    </div>
  )
}