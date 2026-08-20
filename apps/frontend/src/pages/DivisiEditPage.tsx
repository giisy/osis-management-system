import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { api } from '../lib/axios'
import DivisiForm from '../features/divisi/DivisiForm'
import { useUpdateDivisi } from '../features/divisi/useDivisiMutation'
import type { DivisiFormValues } from '../features/divisi/divisiSchema'
import type { Divisi } from '../features/divisi/divisiApi'

export default function DivisiEditPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const updateMutation = useUpdateDivisi(id!)

  const { data, isLoading } = useQuery({
    queryKey: ['divisi-detail', id],
    queryFn: async () => {
      const response = await api.get<{ success: boolean; data: Divisi }>(`/api/divisi/${id}`)
      return response.data
    },
  })

  const handleSubmit = (formData: DivisiFormValues) => {
    updateMutation.mutate(formData, {
      onSuccess: () => {
        navigate('/divisi')
      },
    })
  }

  if (isLoading) {
    return <p className="text-gray-500">Memuat data...</p>
  }

  if (!data) {
    return <p className="text-red-500">Divisi tidak ditemukan.</p>
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

      <h1 className="text-2xl font-bold text-gray-800 mb-6">Edit Divisi</h1>

      <div className="bg-white rounded-xl border border-gray-200 p-4 max-w-lg">
        <DivisiForm
          defaultValues={data.data}
          onSubmit={handleSubmit}
          isSubmitting={updateMutation.isPending}
          submitError={updateMutation.error}
        />
      </div>
    </div>
  )
}