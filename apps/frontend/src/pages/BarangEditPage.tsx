import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Trash2 } from 'lucide-react'
import { isAxiosError } from 'axios'
import BarangForm from '../features/inventaris/BarangForm'
import { useBarangList, useUpdateBarang, useDeleteBarang } from '../features/inventaris/useBarang'
import type { BarangFormValues } from '../features/inventaris/barangSchema'

export default function BarangEditPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: listData, isLoading } = useBarangList()
  const updateMutation = useUpdateBarang(id!)
  const deleteMutation = useDeleteBarang()

  const barang = listData?.data.find((b) => b.id === id)

  const handleSubmit = (formData: BarangFormValues) => {
    updateMutation.mutate(formData, {
      onSuccess: () => {
        navigate('/inventaris')
      },
    })
  }

  const handleDelete = () => {
    const confirmed = window.confirm('Yakin ingin menghapus barang ini?')
    if (!confirmed || !id) return

    deleteMutation.mutate(id, {
      onSuccess: () => {
        navigate('/inventaris')
      },
      onError: (error) => {
        const message = isAxiosError(error)
          ? error.response?.data?.message
          : 'Gagal menghapus barang.'
        alert(message)
      },
    })
  }

  if (isLoading) {
    return <p className="text-gray-500">Memuat data...</p>
  }

  if (!barang) {
    return <p className="text-red-500">Barang tidak ditemukan.</p>
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => navigate('/inventaris')}
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

      <h1 className="text-2xl font-bold text-gray-800 mb-6">Edit Barang</h1>

      <div className="bg-white rounded-xl border border-gray-200 p-4 max-w-lg">
        <BarangForm
          defaultValues={barang}
          onSubmit={handleSubmit}
          isSubmitting={updateMutation.isPending}
          submitError={updateMutation.error}
        />
      </div>
    </div>
  )
}