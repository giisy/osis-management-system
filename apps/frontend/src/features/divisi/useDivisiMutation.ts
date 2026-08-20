import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createDivisi, updateDivisi, deleteDivisi } from './divisiApi'
import type { DivisiFormData } from './divisiApi'

export const useCreateDivisi = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: DivisiFormData) => createDivisi(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['divisi-list'] })
    },
  })
}

export const useUpdateDivisi = (id: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: Partial<DivisiFormData>) => updateDivisi(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['divisi-list'] })
    },
  })
}

export const useDeleteDivisi = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteDivisi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['divisi-list'] })
    },
  })
}