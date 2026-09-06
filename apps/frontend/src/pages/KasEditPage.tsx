import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { api } from '../lib/axios'
import KasForm from '../features/kas/KasForm'
import { useUpdateKas } from '../features/kas/useKas'
import type { KasFormValues } from '../features/kas/kasSchema'
import type { Transaksi } from '../features/kas/kasApi'

export default function KasEditPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const updateMutation = useUpdateKas(id!)

  const { data, isLoading } = useQuery({
    queryKey: ['kas-detail', id],
    queryFn: async () => {
      const response = await api.get<{ success: boolean; data: Transaksi }>(`/api/kas/${id}`)
      return response.data
    },
  })

  const handleSubmit = (formData: KasFormValues) => {
    updateMutation.mutate(formData, {
      onSuccess: () => {
        navigate('/kas')
      },
    })
  }

  if (isLoading) {
    return <p className="text-gray-500">Memuat data...</p>
  }

  if (!data) {
    return <p className="text-red-500">Transaksi tidak ditemukan.</p>
  }

  return (
    <div>
      <div className="mb-4">
        <button
          onClick={() => navigate('/kas')}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft size={16} />
          Kembali
        </button>
      </div>

      <h1 className="text-2xl font-bold text-gray-800 mb-6">Edit Transaksi</h1>

      <div className="bg-white rounded-xl border border-gray-200 p-4 max-w-lg">
        <KasForm
          defaultValues={data.data}
          onSubmit={handleSubmit}
          isSubmitting={updateMutation.isPending}
          submitError={updateMutation.error}
        />
      </div>
    </div>
  )
}