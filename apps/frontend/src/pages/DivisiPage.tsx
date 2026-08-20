import { Link } from 'react-router-dom'
import { Plus, Users, Pencil, Trash2 } from 'lucide-react'
import { useDivisiList } from '../features/divisi/useDivisiList'
import { useDeleteDivisi } from '../features/divisi/useDivisiMutation'
import { isAxiosError } from 'axios'

export default function DivisiPage() {
  const { data, isLoading, isError } = useDivisiList()
  const deleteMutation = useDeleteDivisi()

  const handleDelete = (id: string, nama: string) => {
    const confirmed = window.confirm(`Yakin ingin menghapus divisi "${nama}"?`)
    if (!confirmed) return

    deleteMutation.mutate(id, {
      onError: (error) => {
        const message = isAxiosError(error)
          ? error.response?.data?.message
          : 'Gagal menghapus divisi.'
        alert(message)
      },
    })
  }

  if (isLoading) {
    return <p className="text-gray-500">Memuat data...</p>
  }

  if (isError || !data) {
    return <p className="text-red-500">Gagal memuat data divisi.</p>
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Divisi</h1>
        <Link
          to="/divisi/create"
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
        >
          <Plus size={16} />
          Tambah
        </Link>
      </div>

      {data.data.length === 0 ? (
        <p className="text-gray-500">Belum ada divisi.</p>
      ) : (
        <div className="space-y-3">
          {data.data.map((divisi) => (
            <div
              key={divisi.id}
              className="bg-white rounded-xl border border-gray-200 p-4 flex items-start justify-between"
            >
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800">{divisi.nama}</p>
                {divisi.deskripsi && (
                  <p className="text-sm text-gray-500 mt-1">{divisi.deskripsi}</p>
                )}
                <div className="flex items-center gap-1 text-xs text-gray-400 mt-2">
                  <Users size={12} />
                  <span>{divisi._count?.anggota ?? 0} anggota</span>
                </div>
              </div>

              <div className="flex items-center gap-1 ml-3">
                <Link
                  to={`/divisi/${divisi.id}/edit`}
                  className="p-2 rounded-lg hover:bg-gray-100 text-gray-500"
                >
                  <Pencil size={16} />
                </Link>
                <button
                  onClick={() => handleDelete(divisi.id, divisi.nama)}
                  className="p-2 rounded-lg hover:bg-red-50 text-red-500"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}