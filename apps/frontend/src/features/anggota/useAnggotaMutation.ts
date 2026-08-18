import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createAnggota, updateAnggota } from './anggotaApi'
import type { AnggotaFormData } from './anggotaSchema'

export const useCreateAnggota = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: AnggotaFormData) => createAnggota(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anggota-list'] })
    },
  })
}

export const useUpdateAnggota = (id: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: Partial<AnggotaFormData>) => updateAnggota(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anggota-list'] })
    },
  })
}