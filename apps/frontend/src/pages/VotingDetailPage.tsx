import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Lock, Unlock, Trash2 } from 'lucide-react'
import { isAxiosError } from 'axios'
import {
  useVotingDetail,
  useVote,
  useTutupVoting,
  useBukaVoting,
  useDeleteVoting,
  useHasilVoting,
} from '../features/voting/useVoting'
import dayjs from '../lib/dayjs'

export default function VotingDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { data, isLoading } = useVotingDetail(id!)
  const voteMutation = useVote(id!)
  const tutupMutation = useTutupVoting()
  const bukaMutation = useBukaVoting()
  const deleteMutation = useDeleteVoting()

  const voting = data?.data
  const isDitutup = voting?.status === 'DITUTUP'

  const { data: hasilData } = useHasilVoting(id!, isDitutup)

  const userJson = localStorage.getItem('user')
  const user = userJson ? JSON.parse(userJson) : null
  const isPengurus = ['SUPER_ADMIN', 'ADMIN', 'KETUA'].includes(user?.role)

  const handleVote = (pilihanId: string) => {
    voteMutation.mutate(pilihanId, {
      onError: (error) => {
        const message = isAxiosError(error)
          ? error.response?.data?.message
          : 'Gagal memberikan suara.'
        alert(message)
      },
    })
  }

  const handleTutup = () => {
    if (!id) return
    const confirmed = window.confirm('Tutup voting ini? Hasil akan bisa dilihat setelah ditutup.')
    if (!confirmed) return
    tutupMutation.mutate(id)
  }

  const handleBuka = () => {
    if (!id) return
    bukaMutation.mutate(id)
  }

  const handleDelete = () => {
    if (!id) return
    const confirmed = window.confirm('Yakin ingin menghapus voting ini? Semua suara akan hilang.')
    if (!confirmed) return
    deleteMutation.mutate(id, {
      onSuccess: () => navigate('/voting'),
    })
  }

  if (isLoading) {
    return <p className="text-gray-500">Memuat data...</p>
  }

  if (!voting) {
    return <p className="text-red-500">Voting tidak ditemukan.</p>
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => navigate('/voting')}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft size={16} />
          Kembali
        </button>

        {isPengurus && (
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 text-sm text-red-500 hover:text-red-700"
          >
            <Trash2 size={16} />
            Hapus
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
        <div className="flex items-start justify-between mb-2">
          <h1 className="text-xl font-bold text-gray-800">{voting.judul}</h1>
          <span
            className={`text-xs font-medium px-2 py-1 rounded-full ${
              voting.status === 'TERBUKA'
                ? 'bg-green-50 text-green-600'
                : 'bg-gray-100 text-gray-500'
            }`}
          >
            {voting.status === 'TERBUKA' ? 'Terbuka' : 'Ditutup'}
          </span>
        </div>

        {voting.deskripsi && <p className="text-sm text-gray-500 mb-2">{voting.deskripsi}</p>}

        <p className="text-xs text-gray-400">
          Dibuat oleh {voting.creator.name} — {dayjs(voting.createdAt).format('D MMM YYYY')}
        </p>

        {isPengurus && (
          <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
            {voting.status === 'TERBUKA' ? (
              <button
                onClick={handleTutup}
                className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                <Lock size={14} />
                Tutup Voting
              </button>
            ) : (
              <button
                onClick={handleBuka}
                className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                <Unlock size={14} />
                Buka Kembali
              </button>
            )}
          </div>
        )}
      </div>

      {!isDitutup ? (
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h2 className="font-semibold text-gray-800 mb-3">
            {voting.sudahVoting ? 'Kamu sudah memberikan suara' : 'Pilih salah satu'}
          </h2>
          <div className="space-y-2">
            {voting.pilihan?.map((pilihan) => (
              <button
                key={pilihan.id}
                onClick={() => handleVote(pilihan.id)}
                disabled={voting.sudahVoting || voteMutation.isPending}
                className="w-full text-left px-4 py-3 border border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
              >
                {pilihan.teks}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h2 className="font-semibold text-gray-800 mb-3">
            Hasil ({hasilData?.data.totalSuara ?? 0} suara)
          </h2>
          <div className="space-y-3">
            {hasilData?.data.hasil.map((item) => {
              const total = hasilData.data.totalSuara || 1
              const persentase = Math.round((item.jumlah / total) * 100)
              return (
                <div key={item.id}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-700">{item.teks}</span>
                    <span className="text-gray-500">
                      {item.jumlah} suara ({persentase}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${persentase}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}