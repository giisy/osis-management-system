import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, TrendingUp, TrendingDown, Wallet } from 'lucide-react'
import { useKasList, useLaporanKas } from '../features/kas/useKas'
import { formatRupiah } from '../lib/formatRupiah'
import dayjs from '../lib/dayjs'
import type { JenisTransaksi } from '../features/kas/kasApi'

export default function KasPage() {
  const [page, setPage] = useState(1)
  const [filterJenis, setFilterJenis] = useState<JenisTransaksi | undefined>(undefined)

  const { data: laporanData, isLoading: isLaporanLoading } = useLaporanKas()
  const { data: listData, isLoading: isListLoading } = useKasList(page, 10, filterJenis)

  if (isLaporanLoading || isListLoading) {
    return <p className="text-gray-500">Memuat data...</p>
  }

  const laporan = laporanData?.data
  const { items = [], totalPages = 1 } = listData?.data ?? {}

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Kas</h1>
        <Link
          to="/kas/create"
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
        >
          <Plus size={16} />
          Tambah
        </Link>
      </div>

      {laporan && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-blue-50 text-blue-600">
              <Wallet size={22} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Saldo</p>
              <p className="text-xl font-bold text-gray-800">{formatRupiah(laporan.saldo)}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-green-50 text-green-600">
              <TrendingUp size={22} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Pemasukan</p>
              <p className="text-xl font-bold text-gray-800">
                {formatRupiah(laporan.totalPemasukan)}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-red-50 text-red-600">
              <TrendingDown size={22} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Pengeluaran</p>
              <p className="text-xl font-bold text-gray-800">
                {formatRupiah(laporan.totalPengeluaran)}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => {
            setFilterJenis(undefined)
            setPage(1)
          }}
          className={`px-3 py-1.5 text-sm rounded-lg border ${
            !filterJenis ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-300 text-gray-600'
          }`}
        >
          Semua
        </button>
        <button
          onClick={() => {
            setFilterJenis('PEMASUKAN')
            setPage(1)
          }}
          className={`px-3 py-1.5 text-sm rounded-lg border ${
            filterJenis === 'PEMASUKAN'
              ? 'bg-green-600 text-white border-green-600'
              : 'border-gray-300 text-gray-600'
          }`}
        >
          Pemasukan
        </button>
        <button
          onClick={() => {
            setFilterJenis('PENGELUARAN')
            setPage(1)
          }}
          className={`px-3 py-1.5 text-sm rounded-lg border ${
            filterJenis === 'PENGELUARAN'
              ? 'bg-red-600 text-white border-red-600'
              : 'border-gray-300 text-gray-600'
          }`}
        >
          Pengeluaran
        </button>
      </div>

      {items.length === 0 ? (
        <p className="text-gray-500">Belum ada transaksi.</p>
      ) : (
        <div className="space-y-3">
          {items.map((transaksi) => (
            <Link
              key={transaksi.id}
              to={`/kas/${transaksi.id}/edit`}
              className="block bg-white rounded-xl border border-gray-200 p-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-800">{transaksi.keterangan}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {dayjs(transaksi.tanggal).format('D MMM YYYY')} — {transaksi.creator.name}
                  </p>
                </div>
                <p
                  className={`font-semibold ${
                    transaksi.jenis === 'PEMASUKAN' ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {transaksi.jenis === 'PEMASUKAN' ? '+' : '-'}
                  {formatRupiah(transaksi.jumlah)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 disabled:opacity-40"
          >
            Sebelumnya
          </button>
          <span className="text-sm text-gray-500">
            Halaman {page} dari {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 disabled:opacity-40"
          >
            Selanjutnya
          </button>
        </div>
      )}
    </div>
  )
}