import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { useAnggotaList } from '../features/anggota/useAnggotaList'
import AnggotaCard from '../features/anggota/AnggotaCard'

export default function AnggotaPage() {
  const [page, setPage] = useState(1)
  const { data, isLoading, isError } = useAnggotaList(page, 10)

  if (isLoading) {
    return <p className="text-gray-500">Memuat data...</p>
  }

  if (isError || !data) {
    return <p className="text-red-500">Gagal memuat data anggota.</p>
  }

  const { items, totalPages } = data.data

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Anggota</h1>
        <Link
          to="/anggota/create"
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
        >
          <Plus size={16} />
          Tambah
        </Link>
      </div>

      {items.length === 0 ? (
        <p className="text-gray-500">Belum ada anggota.</p>
      ) : (
        <div className="space-y-3">
          {items.map((anggota) => (
            <Link key={anggota.id} to={`/anggota/${anggota.id}/edit`}>
              <AnggotaCard anggota={anggota} />
            </Link>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Sebelumnya
          </button>
          <span className="text-sm text-gray-500">
            Halaman {page} dari {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Selanjutnya
          </button>
        </div>
      )}
    </div>
  )
}