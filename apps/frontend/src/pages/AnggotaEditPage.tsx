import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { api } from '../lib/axios'
import AnggotaForm from '../features/anggota/AnggotaForm'
import { useUpdateAnggota } from '../features/anggota/useAnggotaMutation'
import type { AnggotaFormData } from '../features/anggota/anggotaSchema'
import type { Anggota } from '../features/anggota/anggotaApi'

export default function AnggotaEditPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const updateMutation = useUpdateAnggota(id!)

  const { data, isLoading } = useQuery({
    queryKey: ['anggota-detail', id],
    queryFn: async () => {
      const response = await api.get<{ success: boolean; data: Anggota }>(`/api/anggota/${id}`)
      return response.data
    },
  })

  const handleSubmit = (formData: AnggotaFormData) => {
    const payload = { ...formData }
    if (!payload.password) {
      delete payload.password
    }

    updateMutation.mutate(payload, {
      onSuccess: () => {
        navigate('/anggota')
      },
    })
  }

  if (isLoading) {
    return <p className="text-gray-500">Memuat data...</p>
  }

  if (!data) {
    return <p className="text-red-500">Anggota tidak ditemukan.</p>
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

      <h1 className="text-2xl font-bold text-gray-800 mb-6">Edit Anggota</h1>

      <div className="bg-white rounded-xl border border-gray-200 p-4 max-w-lg">
        <AnggotaForm
          mode="edit"
          defaultValues={data.data}
          onSubmit={handleSubmit}
          isSubmitting={updateMutation.isPending}
          submitError={updateMutation.error}
        />
      </div>
    </div>
  )
}