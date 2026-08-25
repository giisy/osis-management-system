import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Trash2 } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { api } from '../lib/axios'
import KasForm from '../features/kas/KasForm'
import { useUpdateKas, useDeleteKas } from '../features/kas/useKas'
import type { KasFormValues } from '../features/kas/kasSchema'
import type { Transaksi } from '../features/kas/kasApi'

export default function KasEditPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const updateMutation = useUpdateKas(id!)
  const deleteMutation = useDeleteKas()

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

  const handleDelete = () => {
    const confirmed = window.confirm('Yakin ingin menghapus transaksi ini?')
    if (!confirmed || !id) return

    deleteMutation.mutate(id, {
      onSuccess: () => {
        navigate('/kas')
      },
      onError: (error) => {
        const message = isAxiosError(error)
          ? error.response?.data?.message
          : 'Gagal menghapus transaksi.'
        alert(message)
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
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => navigate('/kas')}
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