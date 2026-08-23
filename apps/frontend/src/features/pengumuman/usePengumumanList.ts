import { useQuery } from '@tanstack/react-query'
import { getPengumumanList } from './pengumumanApi'

export const usePengumumanList = () => {
  return useQuery({
    queryKey: ['pengumuman-list'],
    queryFn: getPengumumanList,
  })
}