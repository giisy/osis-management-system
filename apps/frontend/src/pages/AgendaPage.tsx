import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import dayjs from '../lib/dayjs'
import { useAgendaList } from '../features/agenda/useAgendaList'
import { useCalendar } from '../features/agenda/useCalendar'
import CalendarGrid from '../features/agenda/CalendarGrid'
import AgendaDayPanel from '../features/agenda/AgendaDayPanel'
import { getAgendaForDate } from '../features/agenda/agendaUtils'

export default function AgendaPage() {
  const { data, isLoading, isError } = useAgendaList()
  const { currentMonth, calendarDays, goToPreviousMonth, goToNextMonth, goToToday } =
    useCalendar()
  const [selectedDate, setSelectedDate] = useState(dayjs())

  if (isLoading) {
    return <p className="text-gray-500">Memuat data...</p>
  }

  if (isError || !data) {
    return <p className="text-red-500">Gagal memuat data agenda.</p>
  }

  const agendaList = data.data
  const agendaForSelectedDate = getAgendaForDate(agendaList, selectedDate)

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Agenda</h1>

      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={goToPreviousMonth}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <ChevronLeft size={18} />
          </button>

          <div className="text-center">
            <p className="font-semibold text-gray-800">
              {currentMonth.format('MMMM YYYY')}
            </p>
            <button
              onClick={goToToday}
              className="text-xs text-blue-600 hover:underline"
            >
              Hari ini
            </button>
          </div>

          <button
            onClick={goToNextMonth}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        <CalendarGrid
          currentMonth={currentMonth}
          calendarDays={calendarDays}
          agendaList={agendaList}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
        />
      </div>

      <AgendaDayPanel selectedDate={selectedDate} agendaList={agendaForSelectedDate} />
    </div>
  )
}