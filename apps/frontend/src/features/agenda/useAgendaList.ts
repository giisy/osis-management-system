import { useQuery } from '@tanstack/react-query'
import { getAgendaList } from './agendaApi'

export const useAgendaList = () => {
  return useQuery({
    queryKey: ['agenda-list'],
    queryFn: getAgendaList,
  })
}