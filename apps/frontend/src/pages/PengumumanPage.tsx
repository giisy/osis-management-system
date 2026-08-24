import { Link } from 'react-router-dom'
import { Plus, Trash2, Pencil, User } from 'lucide-react'
import { isAxiosError } from 'axios'
import { usePengumumanList } from '../features/pengumuman/usePengumumanList'
import { useDeletePengumuman } from '../features/pengumuman/usePengumumanMutation'
import dayjs from '../lib/dayjs'

export default function PengumumanPage() {
  const { data, isLoading, isError } = usePengumumanList()
  const deleteMutation = useDeletePengumuman()

  const handleDelete = (id: string, judul: string) => {
    const confirmed = window.confirm(`Yakin ingin menghapus pengumuman "${judul}"?`)
    if (!confirmed) return

    deleteMutation.mutate(id, {
      onError: (error) => {
        const message = isAxiosError(error)
          ? error.response?.data?.message
          : 'Gagal menghapus pengumuman.'
        alert(message)
      },
    })
  }

  if (isLoading) {
    return <p className="text-gray-500">Memuat data...</p>
  }

  if (isError || !data) {
    return <p className="text-red-500">Gagal memuat data pengumuman.</p>
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Pengumuman</h1>
        <Link
          to="/pengumuman/create"
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
        >
          <Plus size={16} />
          Tambah
        </Link>
      </div>

      {data.data.length === 0 ? (
        <p className="text-gray-500">Belum ada pengumuman.</p>
      ) : (
        <div className="space-y-3">
          {data.data.map((pengumuman) => (
            <div
              key={pengumuman.id}
              className="bg-white rounded-xl border border-gray-200 p-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800">{pengumuman.judul}</p>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">{pengumuman.isi}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <User size={12} />
                      {pengumuman.creator.name}
                    </span>
                    <span>{dayjs(pengumuman.createdAt).format('D MMM YYYY')}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 ml-3">
                  <Link
                    to={`/pengumuman/${pengumuman.id}/edit`}
                    className="p-2 rounded-lg hover:bg-gray-100 text-gray-500"
                  >
                    <Pencil size={16} />
                  </Link>
                  <button
                    onClick={() => handleDelete(pengumuman.id, pengumuman.judul)}
                    className="p-2 rounded-lg hover:bg-red-50 text-red-500"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}