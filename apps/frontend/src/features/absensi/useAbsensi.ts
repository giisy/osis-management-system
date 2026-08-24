import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { checkinAbsensi, getRiwayatSaya, getRekapAgenda } from './absensiApi'

export const useCheckin = (agendaId: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => checkinAbsensi(agendaId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['riwayat-absensi-saya'] })
      queryClient.invalidateQueries({ queryKey: ['rekap-absensi', agendaId] })
    },
  })
}

export const useRiwayatSaya = () => {
  return useQuery({
    queryKey: ['riwayat-absensi-saya'],
    queryFn: getRiwayatSaya,
  })
}

export const useRekapAgenda = (agendaId: string) => {
  return useQuery({
    queryKey: ['rekap-absensi', agendaId],
    queryFn: () => getRekapAgenda(agendaId),
  })
}