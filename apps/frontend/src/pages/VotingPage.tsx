import { Link } from 'react-router-dom'
import { Plus, Users, CheckCircle } from 'lucide-react'
import { useVotingList } from '../features/voting/useVoting'
import dayjs from '../lib/dayjs'
export default function VotingPage() {
  const { data, isLoading, isError } = useVotingList()

  if (isLoading) {
    return <p className="text-gray-500">Memuat data...</p>
  }

  if (isError || !data) {
    return <p className="text-red-500">Gagal memuat data voting.</p>
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Voting</h1>
        <Link
          to="/voting/create"
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
        >
          <Plus size={16} />
          Buat Voting
        </Link>
      </div>

      {data.data.length === 0 ? (
        <p className="text-gray-500">Belum ada sesi voting.</p>
      ) : (
        <div className="space-y-3">
          {data.data.map((voting) => (
            <Link
              key={voting.id}
              to={`/voting/${voting.id}`}
              className="block bg-white rounded-xl border border-gray-200 p-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-gray-800">{voting.judul}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {dayjs(voting.createdAt).format('D MMM YYYY')} — {voting.creator.name}
                  </p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <CheckCircle size={12} />
                      {voting.jumlahPilihan} pilihan
                    </span>
                    <span className="flex items-center gap-1">
                      <Users size={12} />
                      {voting.totalSuara} suara
                    </span>
                  </div>
                </div>
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
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}