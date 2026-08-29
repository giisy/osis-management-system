import type { Dayjs } from 'dayjs'
import { Link } from 'react-router-dom'
import { Clock, MapPin, Plus } from 'lucide-react'
import type { Agenda } from './agendaApi'

interface AgendaDayPanelProps {
  selectedDate: Dayjs
  agendaList: Agenda[]
}

export default function AgendaDayPanel({ selectedDate, agendaList }: AgendaDayPanelProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 mt-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-gray-800">
          {selectedDate.locale('id').format('dddd, D MMMM YYYY')}
        </h2>
        <Link
          to={`/agenda/create?date=${selectedDate.format('YYYY-MM-DD')}`}
          className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100"
        >
          <Plus size={16} />
        </Link>
      </div>

      {agendaList.length === 0 ? (
        <p className="text-sm text-gray-400">Tidak ada agenda di tanggal ini.</p>
      ) : (
        <div className="space-y-3">
          {agendaList.map((agenda) => (
            <Link
              key={agenda.id}
              to={`/agenda/${agenda.id}/edit`}
              className="block p-3 rounded-lg border border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 transition"
            >
              <p className="font-medium text-gray-800">{agenda.judul}</p>
              <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Clock size={12} />
                  {new Date(agenda.waktuMulai).toLocaleTimeString('id-ID', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
                {agenda.lokasi && (
                  <span className="flex items-center gap-1">
                    <MapPin size={12} />
                    {agenda.lokasi}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}