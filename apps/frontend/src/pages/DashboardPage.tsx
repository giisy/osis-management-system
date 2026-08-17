import { Users, UserPlus, TrendingUp } from 'lucide-react'
import { useDashboardStats } from '../features/dashboard/useDashboardStats'
import StatCard from '../features/dashboard/StatCard'

export default function DashboardPage() {
  const { data, isLoading, isError } = useDashboardStats()

  if (isLoading) {
    return <p className="text-gray-500">Memuat data...</p>
  }

  if (isError || !data) {
    return <p className="text-red-500">Gagal memuat data dashboard.</p>
  }

  const stats = data.data

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <StatCard
          label="Total Anggota"
          value={stats.totalAnggota}
          icon={Users}
          color="blue"
        />
        <StatCard
          label="Anggota Baru Bulan Ini"
          value={stats.anggotaBaruBulanIni}
          icon={UserPlus}
          color="green"
        />
        <StatCard
          label="Total Admin"
          value={stats.anggotaPerRole.find((r) => r.role === 'ADMIN')?.jumlah ?? 0}
          icon={TrendingUp}
          color="orange"
        />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Anggota Terbaru</h2>

        {stats.anggotaTerbaru.length === 0 ? (
          <p className="text-gray-500 text-sm">Belum ada anggota.</p>
        ) : (
          <div className="divide-y divide-gray-100">
            {stats.anggotaTerbaru.map((anggota) => (
              <div key={anggota.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium text-gray-800">{anggota.name}</p>
                  <p className="text-xs text-gray-500">{anggota.role}</p>
                </div>
                <p className="text-xs text-gray-400">
                  {new Date(anggota.createdAt).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}