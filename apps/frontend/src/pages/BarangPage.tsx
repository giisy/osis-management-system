import { Link } from 'react-router-dom'
import { Plus, Package, Pencil, Trash2 } from 'lucide-react'
import { isAxiosError } from 'axios'
import { useBarangList } from '../features/inventaris/useBarang'
import { useDeleteBarang } from '../features/inventaris/useBarang'

const kondisiLabel: Record<string, string> = {
  BAIK: 'Baik',
  RUSAK_RINGAN: 'Rusak Ringan',
  RUSAK_BERAT: 'Rusak Berat',
}

const kondisiColor: Record<string, string> = {
  BAIK: 'bg-green-50 text-green-600',
  RUSAK_RINGAN: 'bg-yellow-50 text-yellow-600',
  RUSAK_BERAT: 'bg-red-50 text-red-600',
}

export default function BarangPage() {
  const { data, isLoading, isError } = useBarangList()
  const deleteMutation = useDeleteBarang()

  const handleDelete = (id: string, nama: string) => {
    const confirmed = window.confirm(`Yakin ingin menghapus barang "${nama}"?`)
    if (!confirmed) return

    deleteMutation.mutate(id, {
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

  if (isError || !data) {
    return <p className="text-red-500">Gagal memuat data barang.</p>
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Inventaris</h1>
        <div className="flex gap-2">
          <Link
            to="/peminjaman"
            className="flex items-center gap-2 border border-gray-300 text-gray-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
          >
            Peminjaman
          </Link>
          <Link
            to="/inventaris/create"
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
          >
            <Plus size={16} />
            Tambah
          </Link>
        </div>
      </div>

      {data.data.length === 0 ? (
        <p className="text-gray-500">Belum ada barang.</p>
      ) : (
        <div className="space-y-3">
          {data.data.map((barang) => (
            <div key={barang.id} className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Package size={16} className="text-gray-400" />
                    <p className="font-semibold text-gray-800">{barang.nama}</p>
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full ${kondisiColor[barang.kondisi]}`}
                    >
                      {kondisiLabel[barang.kondisi]}
                    </span>
                  </div>
                  {barang.deskripsi && (
                    <p className="text-sm text-gray-500 mt-1">{barang.deskripsi}</p>
                  )}
                  <p className="text-xs text-gray-400 mt-2">
                    Stok tersedia: <span className="font-medium">{barang.stokTersedia}</span> dari{' '}
                    {barang.jumlah} ({barang.jumlahDipinjam} dipinjam)
                  </p>
                </div>

                <div className="flex items-center gap-1 ml-3">
                  <Link
                    to={`/inventaris/${barang.id}/edit`}
                    className="p-2 rounded-lg hover:bg-gray-100 text-gray-500"
                  >
                    <Pencil size={16} />
                  </Link>
                  <button
                    onClick={() => handleDelete(barang.id, barang.nama)}
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