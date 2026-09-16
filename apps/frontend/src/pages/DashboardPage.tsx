import { Link } from 'react-router-dom'
import { Users, UserPlus, TrendingUp, CalendarDays, Megaphone, MapPin, User } from 'lucide-react'
import { useDashboardStats } from '../features/dashboard/useDashboardStats'
import StatCard from '../features/dashboard/StatCard'
import { useUpcomingAgenda } from '../features/agenda/useUpcomingAgenda'
import { usePengumumanList } from '../features/pengumuman/usePengumumanList'
import { canManageAnggota, getCurrentRole } from '../lib/permissions'
import dayjs from '../lib/dayjs'

const MAX_PREVIEW_ITEMS = 5

export default function DashboardPage() {
  const canViewStats = canManageAnggota(getCurrentRole())

  const { data: agendaData, isLoading: isAgendaLoading } = useUpcomingAgenda(MAX_PREVIEW_ITEMS)
  // TODO: backend belum punya param limit/endpoint /latest untuk pengumuman —
  // sementara masih fetch semua lalu slice di client. Ganti begitu Kilo AI
  // menambahkan dukungan limit di GET /api/pengumuman (dicatat di review Sprint 15).
  const { data: pengumumanData, isLoading: isPengumumanLoading } = usePengumumanList()
  const { data: statsData, isLoading: isStatsLoading } = useDashboardStats(canViewStats)

  const upcomingAgenda = agendaData?.data ?? []

  const latestPengumuman = [...(pengumumanData?.data ?? [])]
    .sort((a, b) => dayjs(b.createdAt).valueOf() - dayjs(a.createdAt).valueOf())
    .slice(0, MAX_PREVIEW_ITEMS)

  const stats = statsData?.data

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CalendarDays size={18} className="text-blue-600" />
              <h2 className="text-lg font-bold text-gray-800">Agenda Terdekat</h2>
            </div>
            <Link to="/agenda" className="text-xs text-blue-600 hover:underline whitespace-nowrap">
              Lihat Semua
            </Link>
          </div>

          {isAgendaLoading ? (
            <p className="text-gray-500 text-sm">Memuat data...</p>
          ) : upcomingAgenda.length === 0 ? (
            <p className="text-gray-500 text-sm">Tidak ada agenda mendatang.</p>
          ) : (
            <div className="divide-y divide-gray-100">
              {upcomingAgenda.map((agenda) => (
                <div key={agenda.id} className="py-3">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-medium text-gray-800">{agenda.judul}</p>
                    <p className="text-xs text-gray-400 whitespace-nowrap">
                      {dayjs(agenda.waktuMulai).format('D MMM, HH:mm')}
                    </p>
                  </div>
                  {agenda.lokasi && (
                    <p className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                      <MapPin size={12} />
                      {agenda.lokasi}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Megaphone size={18} className="text-orange-600" />
              <h2 className="text-lg font-bold text-gray-800">Pengumuman</h2>
            </div>
            <Link to="/pengumuman" className="text-xs text-blue-600 hover:underline whitespace-nowrap">
              Lihat Semua
            </Link>
          </div>

          {isPengumumanLoading ? (
            <p className="text-gray-500 text-sm">Memuat data...</p>
          ) : latestPengumuman.length === 0 ? (
            <p className="text-gray-500 text-sm">Belum ada pengumuman.</p>
          ) : (
            <div className="divide-y divide-gray-100">
              {latestPengumuman.map((pengumuman) => (
                <div key={pengumuman.id} className="py-3">
                  <p className="font-medium text-gray-800">{pengumuman.judul}</p>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-1">{pengumuman.isi}</p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <User size={12} />
                      {pengumuman.creator.name}
                    </span>
                    <span>{dayjs(pengumuman.createdAt).format('D MMM YYYY')}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {canViewStats && (
        <div>
          <h2 className="text-sm font-semibold text-gray-500 mb-3">Statistik Anggota</h2>
          {isStatsLoading ? (
            <p className="text-gray-500 text-sm">Memuat statistik...</p>
          ) : stats ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
          ) : (
            <p className="text-red-500 text-sm">Gagal memuat statistik.</p>
          )}
        </div>
      )}
    </div>
  )
}