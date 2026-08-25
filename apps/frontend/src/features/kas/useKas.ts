import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getKasList,
  getLaporanKas,
  createKas,
  updateKas,
  deleteKas,
} from './kasApi'
import type { KasFormData, JenisTransaksi } from './kasApi'

export const useKasList = (page: number = 1, limit: number = 10, jenis?: JenisTransaksi) => {
  return useQuery({
    queryKey: ['kas-list', page, limit, jenis],
    queryFn: () => getKasList(page, limit, jenis),
  })
}

export const useLaporanKas = () => {
  return useQuery({
    queryKey: ['laporan-kas'],
    queryFn: getLaporanKas,
  })
}

export const useCreateKas = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: KasFormData) => createKas(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kas-list'] })
      queryClient.invalidateQueries({ queryKey: ['laporan-kas'] })
    },
  })
}

export const useUpdateKas = (id: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: Partial<KasFormData>) => updateKas(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kas-list'] })
      queryClient.invalidateQueries({ queryKey: ['laporan-kas'] })
    },
  })
}

export const useDeleteKas = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteKas(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kas-list'] })
      queryClient.invalidateQueries({ queryKey: ['laporan-kas'] })
    },
  })
}