import { useQuery } from '@tanstack/react-query'
import { getDivisiList } from './divisiApi'

export const useDivisiList = () => {
  return useQuery({
    queryKey: ['divisi-list'],
    queryFn: getDivisiList,
  })
}