import { useQuery } from '@tanstack/react-query'
import { getAgendaList } from './AgendaApi.ts'

export const useAgendaList = () => {
  return useQuery({
    queryKey: ['agenda-list'],
    queryFn: getAgendaList,
  })
}