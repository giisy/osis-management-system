import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createPengumuman, updatePengumuman, deletePengumuman } from './pengumumanApi'
import type { PengumumanFormData } from './pengumumanApi'

export const useCreatePengumuman = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: PengumumanFormData) => createPengumuman(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pengumuman-list'] })
    },
  })
}

export const useUpdatePengumuman = (id: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: Partial<PengumumanFormData>) => updatePengumuman(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pengumuman-list'] })
    },
  })
}

export const useDeletePengumuman = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deletePengumuman(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pengumuman-list'] })
    },
  })
}