import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'
import type { Agenda } from './agendaApi'

export const getAgendaForDate = (agendaList: Agenda[], date: Dayjs) => {
  return agendaList.filter((agenda) => dayjs(agenda.waktuMulai).isSame(date, 'day'))
}