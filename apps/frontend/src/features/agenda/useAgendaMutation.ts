import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createAgenda, updateAgenda, deleteAgenda } from './agendaApi'
import type { AgendaPayload } from './agendaApi'

export const useCreateAgenda = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: AgendaPayload) => createAgenda(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agenda-list'] })
    },
  })
}

export const useUpdateAgenda = (id: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: Partial<AgendaPayload>) => updateAgenda(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agenda-list'] })
    },
  })
}

export const useDeleteAgenda = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteAgenda(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agenda-list'] })
    },
  })
}