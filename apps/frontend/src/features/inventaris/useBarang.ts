import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getBarangList, createBarang, updateBarang, deleteBarang } from './barangApi'
import type { BarangFormData } from './barangApi'

export const useBarangList = () => {
  return useQuery({
    queryKey: ['barang-list'],
    queryFn: getBarangList,
  })
}

export const useCreateBarang = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: BarangFormData) => createBarang(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['barang-list'] })
    },
  })
}

export const useUpdateBarang = (id: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: Partial<BarangFormData>) => updateBarang(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['barang-list'] })
    },
  })
}

export const useDeleteBarang = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteBarang(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['barang-list'] })
    },
  })
}