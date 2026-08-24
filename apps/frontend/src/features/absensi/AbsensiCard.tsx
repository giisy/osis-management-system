import { isAxiosError } from 'axios'
import { CheckCircle2, Users } from 'lucide-react'
import { useCheckin, useRekapAgenda } from './useAbsensi'

interface AbsensiCardProps {
  agendaId: string
  canViewRekap: boolean
}

const statusLabel: Record<string, string> = {
  HADIR: 'Hadir',
  IZIN: 'Izin',
  ALFA: 'Alfa',
}

const statusColor: Record<string, string> = {
  HADIR: 'bg-green-50 text-green-600',
  IZIN: 'bg-yellow-50 text-yellow-600',
  ALFA: 'bg-red-50 text-red-600',
}

export default function AbsensiCard({ agendaId, canViewRekap }: AbsensiCardProps) {
  const checkinMutation = useCheckin(agendaId)
  const { data: rekapData, isLoading: isRekapLoading } = useRekapAgenda(agendaId)


  const handleCheckin = () => {
    checkinMutation.mutate(undefined, {
      onError: (error) => {
        const message = isAxiosError(error)
          ? error.response?.data?.message
          : 'Gagal check-in.'
        alert(message)
      },
    })
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <h2 className="font-semibold text-gray-800 mb-3">Absensi</h2>

      <button
        onClick={handleCheckin}
        disabled={checkinMutation.isPending}
        className="flex items-center justify-center gap-2 w-full bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 transition disabled:opacity-50"
      >
        <CheckCircle2 size={18} />
        {checkinMutation.isPending ? 'Memproses...' : 'Check-in'}
      </button>

      {canViewRekap && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2 mb-3 text-sm text-gray-500">
            <Users size={14} />
            Rekap Kehadiran
          </div>

          {isRekapLoading ? (
            <p className="text-sm text-gray-400">Memuat...</p>
          ) : rekapData ? (
            <>
              <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="text-center p-2 bg-green-50 rounded-lg">
                  <p className="text-lg font-bold text-green-600">{rekapData.data.rekap.hadir}</p>
                  <p className="text-xs text-gray-500">Hadir</p>
                </div>
                <div className="text-center p-2 bg-yellow-50 rounded-lg">
                  <p className="text-lg font-bold text-yellow-600">{rekapData.data.rekap.izin}</p>
                  <p className="text-xs text-gray-500">Izin</p>
                </div>
                <div className="text-center p-2 bg-red-50 rounded-lg">
                  <p className="text-lg font-bold text-red-600">{rekapData.data.rekap.alfa}</p>
                  <p className="text-xs text-gray-500">Alfa</p>
                </div>
              </div>

              {rekapData.data.items.length === 0 ? (
                <p className="text-sm text-gray-400">Belum ada yang tercatat.</p>
              ) : (
                <div className="space-y-2">
                  {rekapData.data.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between text-sm">
                      <span className="text-gray-700">{item.user.name}</span>
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColor[item.status]}`}
                      >
                        {statusLabel[item.status]}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : null}
        </div>
      )}
    </div>
  )
}