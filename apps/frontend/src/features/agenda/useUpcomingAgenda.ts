import { useQuery } from '@tanstack/react-query'
import { getUpcomingAgenda } from './agendaApi'

export const useUpcomingAgenda = (limit: number = 5) => {
  return useQuery({
    queryKey: ['agenda-upcoming', limit],
    queryFn: () => getUpcomingAgenda(limit),
  })
}