import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Trash2 } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { api } from '../lib/axios'
import AgendaForm from '../features/agenda/AgendaForm'
import { useUpdateAgenda, useDeleteAgenda } from '../features/agenda/useAgendaMutation'
import type { AgendaPayload, Agenda } from '../features/agenda/AgendaApi'

export default function AgendaEditPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const updateMutation = useUpdateAgenda(id!)
  const deleteMutation = useDeleteAgenda()

  const { data, isLoading } = useQuery({
    queryKey: ['agenda-detail', id],
    queryFn: async () => {
      const response = await api.get<{ success: boolean; data: Agenda }>(`/api/agenda/${id}`)
      return response.data
    },
  })

  const handleSubmit = (formData: AgendaPayload) => {
    updateMutation.mutate(formData, {
      onSuccess: () => {
        navigate('/agenda')
      },
    })
  }

  const handleDelete = () => {
    const confirmed = window.confirm('Yakin ingin menghapus agenda ini?')
    if (!confirmed || !id) return

    deleteMutation.mutate(id, {
      onSuccess: () => {
        navigate('/agenda')
      },
      onError: (error) => {
        const message = isAxiosError(error)
          ? error.response?.data?.message
          : 'Gagal menghapus agenda.'
        alert(message)
      },
    })
  }

  if (isLoading) {
    return <p className="text-gray-500">Memuat data...</p>
  }

  if (!data) {
    return <p className="text-red-500">Agenda tidak ditemukan.</p>
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => navigate('/agenda')}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft size={16} />
          Kembali
        </button>

        <button
          onClick={handleDelete}
          className="flex items-center gap-2 text-sm text-red-500 hover:text-red-700"
        >
          <Trash2 size={16} />
          Hapus
        </button>
      </div>

      <h1 className="text-2xl font-bold text-gray-800 mb-6">Edit Agenda</h1>

      <div className="bg-white rounded-xl border border-gray-200 p-4 max-w-lg">
        <AgendaForm
          defaultValues={data.data}
          onSubmit={handleSubmit}
          isSubmitting={updateMutation.isPending}
          submitError={updateMutation.error}
        />
      </div>
    </div>
  )
}