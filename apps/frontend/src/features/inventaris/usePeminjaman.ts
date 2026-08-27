import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getPeminjamanList, createPeminjaman, kembalikanPeminjaman } from './peminjamanApi'
import type { PeminjamanFormData, StatusPeminjaman } from './peminjamanApi'

export const usePeminjamanList = (status?: StatusPeminjaman) => {
  return useQuery({
    queryKey: ['peminjaman-list', status],
    queryFn: () => getPeminjamanList(status),
  })
}

export const useCreatePeminjaman = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: PeminjamanFormData) => createPeminjaman(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['peminjaman-list'] })
      queryClient.invalidateQueries({ queryKey: ['barang-list'] })
    },
  })
}

export const useKembalikanPeminjaman = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => kembalikanPeminjaman(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['peminjaman-list'] })
      queryClient.invalidateQueries({ queryKey: ['barang-list'] })
    },
  })
}