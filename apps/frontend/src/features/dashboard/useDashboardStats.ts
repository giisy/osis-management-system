import { useQuery } from '@tanstack/react-query'
import { getDashboardStats } from './dashboardApi'

export const useDashboardStats = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: getDashboardStats,
    enabled,
  })
}