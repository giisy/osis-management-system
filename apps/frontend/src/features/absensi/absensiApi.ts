import { api } from '../../lib/axios'

export type AbsensiStatus = 'HADIR' | 'IZIN' | 'ALFA'

export interface Absensi {
  id: string
  status: AbsensiStatus
  waktuCheckIn: string
  agenda: {
    id: string
    judul: string
    lokasi: string | null
    waktuMulai: string
    waktuSelesai: string | null
  }
  createdAt: string
}

interface AbsensiListResponse {
  success: boolean
  data: Absensi[]
}

export const checkinAbsensi = async (agendaId: string) => {
  const response = await api.post(`/api/absensi/${agendaId}/checkin`)
  return response.data
}

export const getRiwayatSaya = async () => {
  const response = await api.get<AbsensiListResponse>('/api/absensi/saya')
  return response.data
}

export interface RekapAbsensi {
  agenda: {
    id: string
    judul: string
    lokasi: string | null
    waktuMulai: string
    waktuSelesai: string | null
  }
  rekap: {
    hadir: number
    izin: number
    alfa: number
    totalTercatat: number
  }
  items: {
    id: string
    user: { id: string; name: string; role: string; kelas: string | null }
    status: AbsensiStatus
    waktuCheckIn: string
    createdAt: string
  }[]
}

export const getRekapAgenda = async (agendaId: string) => {
  const response = await api.get<{ success: boolean; data: RekapAbsensi }>(
    `/api/absensi/agenda/${agendaId}`
  )
  return response.data
}