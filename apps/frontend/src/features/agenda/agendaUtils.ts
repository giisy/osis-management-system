import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'
import type { Agenda } from './AgendaApi'

export const getAgendaForDate = (agendaList: Agenda[], date: Dayjs) => {
  return agendaList.filter((agenda) => dayjs(agenda.waktuMulai).isSame(date, 'day'))
}