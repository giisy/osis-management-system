import type { Dayjs } from 'dayjs'
import type { Agenda } from './agendaApi'
import { getAgendaForDate } from './agendaUtils'

interface CalendarGridProps {
  currentMonth: Dayjs
  calendarDays: Dayjs[]
  agendaList: Agenda[]
  selectedDate: Dayjs
  onSelectDate: (date: Dayjs) => void
}

const dayLabels = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']

export default function CalendarGrid({
  currentMonth,
  calendarDays,
  agendaList,
  selectedDate,
  onSelectDate,
}: CalendarGridProps) {
  const today = new Date()

  return (
    <div>
      <div className="grid grid-cols-7 mb-2">
        {dayLabels.map((label) => (
          <div key={label} className="text-center text-xs font-medium text-gray-400 py-2">
            {label}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((date) => {
          const isCurrentMonth = date.month() === currentMonth.month()
          const isToday = date.isSame(today, 'day')
          const isSelected = date.isSame(selectedDate, 'day')
          const agendaCount = getAgendaForDate(agendaList, date).length

          return (
            <button
              key={date.toISOString()}
              onClick={() => onSelectDate(date)}
              className={`aspect-square flex flex-col items-center justify-center rounded-lg text-sm relative
                ${isCurrentMonth ? 'text-gray-800' : 'text-gray-300'}
                ${isSelected ? 'bg-blue-600 text-white' : isToday ? 'bg-blue-50' : 'hover:bg-gray-100'}
              `}
            >
              <span>{date.date()}</span>
              {agendaCount > 0 && (
                <span
                  className={`w-1 h-1 rounded-full mt-0.5 ${
                    isSelected ? 'bg-white' : 'bg-blue-600'
                  }`}
                />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}