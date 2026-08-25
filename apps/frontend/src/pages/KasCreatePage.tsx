import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import KasForm from '../features/kas/KasForm'
import { useCreateKas } from '../features/kas/useKas'
import type { KasFormValues } from '../features/kas/kasSchema'

export default function KasCreatePage() {
  const navigate = useNavigate()
  const createMutation = useCreateKas()

  const handleSubmit = (data: KasFormValues) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        navigate('/kas')
      },
    })
  }

  return (
    <div>
      <button
        onClick={() => navigate('/kas')}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-4"
      >
        <ArrowLeft size={16} />
        Kembali
      </button>

      <h1 className="text-2xl font-bold text-gray-800 mb-6">Tambah Transaksi</h1>

      <div className="bg-white rounded-xl border border-gray-200 p-4 max-w-lg">
        <KasForm
          onSubmit={handleSubmit}
          isSubmitting={createMutation.isPending}
          submitError={createMutation.error}
        />
      </div>
    </div>
  )
}