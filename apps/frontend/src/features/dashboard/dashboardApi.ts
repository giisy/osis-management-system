import { api } from '../../lib/axios'

interface AnggotaPerRole {
  role: string
  jumlah: number
}

interface AnggotaTerbaru {
  id: string
  name: string
  role: string
  createdAt: string
}

interface PertumbuhanAnggota {
  bulan: string
  tahun: number
  jumlah: number
}

interface DashboardStats {
  totalAnggota: number
  anggotaPerRole: AnggotaPerRole[]
  anggotaBaruBulanIni: number
  anggotaTerbaru: AnggotaTerbaru[]
  pertumbuhanAnggota: PertumbuhanAnggota[]
}

interface DashboardStatsResponse {
  success: boolean
  data: DashboardStats
}

export const getDashboardStats = async (): Promise<DashboardStatsResponse> => {
  const response = await api.get('/api/dashboard/stats')
  return response.data
}