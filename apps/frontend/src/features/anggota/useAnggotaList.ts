import { useQuery } from '@tanstack/react-query'
import { getAnggotaList } from './anggotaApi'

export const useAnggotaList = (page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: ['anggota-list', page, limit],
    queryFn: () => getAnggotaList(page, limit),
  })
}