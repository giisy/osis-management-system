import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Plus, RotateCcw } from 'lucide-react'
import { isAxiosError } from 'axios'
import { usePeminjamanList, useCreatePeminjaman, useKembalikanPeminjaman } from '../features/inventaris/usePeminjaman'
import PeminjamanForm from '../features/inventaris/PeminjamanForm'
import dayjs from '../lib/dayjs'
import type { PeminjamanFormValues } from '../features/inventaris/peminjamanSchema'
import type { StatusPeminjaman } from '../features/inventaris/peminjamanApi'

export default function PeminjamanPage() {
  const [showForm, setShowForm] = useState(false)
  const [filterStatus, setFilterStatus] = useState<StatusPeminjaman | undefined>('DIPINJAM')

  const { data, isLoading, isError } = usePeminjamanList(filterStatus)
  const createMutation = useCreatePeminjaman()
  const kembalikanMutation = useKembalikanPeminjaman()

  const handleSubmit = (data: PeminjamanFormValues) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        setShowForm(false)
      },
    })
  }

  const handleKembalikan = (id: string) => {
    const confirmed = window.confirm('Tandai barang ini sudah dikembalikan?')
    if (!confirmed) return

    kembalikanMutation.mutate(id, {
      onError: (error) => {
        const message = isAxiosError(error)
          ? error.response?.data?.message
          : 'Gagal menandai pengembalian.'
        alert(message)
      },
    })
  }

  return (
    <div>
      <Link
        to="/inventaris"
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-4"
      >
        <ArrowLeft size={16} />
        Kembali ke Inventaris
      </Link>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Peminjaman</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
        >
          <Plus size={16} />
          {showForm ? 'Tutup Form' : 'Pinjam Barang'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 max-w-lg">
          <PeminjamanForm
            onSubmit={handleSubmit}
            isSubmitting={createMutation.isPending}
            submitError={createMutation.error}
          />
        </div>
      )}

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setFilterStatus('DIPINJAM')}
          className={`px-3 py-1.5 text-sm rounded-lg border ${
            filterStatus === 'DIPINJAM'
              ? 'bg-blue-600 text-white border-blue-600'
              : 'border-gray-300 text-gray-600'
          }`}
        >
          Sedang Dipinjam
        </button>
        <button
          onClick={() => setFilterStatus(undefined)}
          className={`px-3 py-1.5 text-sm rounded-lg border ${
            !filterStatus ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-300 text-gray-600'
          }`}
        >
          Semua Riwayat
        </button>
      </div>

      {isLoading ? (
        <p className="text-gray-500">Memuat data...</p>
      ) : isError || !data ? (
        <p className="text-red-500">Gagal memuat data peminjaman.</p>
      ) : data.data.length === 0 ? (
        <p className="text-gray-500">Belum ada peminjaman.</p>
      ) : (
        <div className="space-y-3">
          {data.data.map((peminjaman) => (
            <div key={peminjaman.id} className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-gray-800">
                    {peminjaman.barang.nama} ({peminjaman.jumlah}x)
                  </p>
                  <p className="text-sm text-gray-500 mt-1">{peminjaman.user.name}</p>
                  {peminjaman.keperluan && (
                    <p className="text-xs text-gray-400 mt-1">{peminjaman.keperluan}</p>
                  )}
                  <p className="text-xs text-gray-400 mt-1">
                    Dipinjam: {dayjs(peminjaman.tanggalPinjam).format('D MMM YYYY')}
                    {peminjaman.tanggalKembali &&
                      ` — Dikembalikan: ${dayjs(peminjaman.tanggalKembali).format('D MMM YYYY')}`}
                  </p>
                </div>

                {peminjaman.status === 'DIPINJAM' ? (
                  <button
                    onClick={() => handleKembalikan(peminjaman.id)}
                    className="flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg bg-orange-50 text-orange-600 hover:bg-orange-100"
                  >
                    <RotateCcw size={14} />
                    Kembalikan
                  </button>
                ) : (
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-50 text-green-600">
                    Selesai
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}