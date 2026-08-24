import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { api } from '../lib/axios'
import PengumumanForm from '../features/pengumuman/PengumumanForm'
import { useUpdatePengumuman } from '../features/pengumuman/usePengumumanMutation'
import type { PengumumanFormValues } from '../features/pengumuman/pengumumanSchema'
import type { Pengumuman } from '../features/pengumuman/pengumumanApi'

export default function PengumumanEditPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const updateMutation = useUpdatePengumuman(id!)

  const { data, isLoading } = useQuery({
    queryKey: ['pengumuman-detail', id],
    queryFn: async () => {
      const response = await api.get<{ success: boolean; data: Pengumuman }>(
        `/api/pengumuman/${id}`
      )
      return response.data
    },
  })

  const handleSubmit = (formData: PengumumanFormValues) => {
    updateMutation.mutate(formData, {
      onSuccess: () => {
        navigate('/pengumuman')
      },
    })
  }

  if (isLoading) {
    return <p className="text-gray-500">Memuat data...</p>
  }

  if (!data) {
    return <p className="text-red-500">Pengumuman tidak ditemukan.</p>
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

      <h1 className="text-2xl font-bold text-gray-800 mb-6">Edit Pengumuman</h1>

      <div className="bg-white rounded-xl border border-gray-200 p-4 max-w-lg">
        <PengumumanForm
          defaultValues={data.data}
          onSubmit={handleSubmit}
          isSubmitting={updateMutation.isPending}
          submitError={updateMutation.error}
        />
      </div>
    </div>
  )
}