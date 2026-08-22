import { useState, useMemo } from 'react'
import dayjs, { type Dayjs } from 'dayjs'

export const useCalendar = () => {
  const [currentMonth, setCurrentMonth] = useState(dayjs())

  const goToPreviousMonth = () => setCurrentMonth((prev) => prev.subtract(1, 'month'))
  const goToNextMonth = () => setCurrentMonth((prev) => prev.add(1, 'month'))
  const goToToday = () => setCurrentMonth(dayjs())

  const calendarDays = useMemo(() => {
    const startOfMonth = currentMonth.startOf('month')
    const endOfMonth = currentMonth.endOf('month')

    const startDayOfWeek = startOfMonth.day()

    const days: Dayjs[] = []

    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(startOfMonth.subtract(startDayOfWeek - i, 'day'))
    }

    for (let d = 0; d < endOfMonth.date(); d++) {
      days.push(startOfMonth.add(d, 'day'))
    }

    const remaining = 42 - days.length
    for (let i = 1; i <= remaining; i++) {
      days.push(endOfMonth.add(i, 'day'))
    }

    return days
  }, [currentMonth])

  return {
    currentMonth,
    calendarDays,
    goToPreviousMonth,
    goToNextMonth,
    goToToday,
  }
}