import { api } from '../../lib/axios'

export interface Anggota {
  id: string
  name: string
  email: string
  role: string
  nis: string | null
  kelas: string | null
  jenisKelamin: string | null
  noTelepon: string | null
  alamat: string | null
  divisi: { id: string; nama: string } | null
  createdAt: string
}

interface AnggotaListResponse {
  success: boolean
  data: {
    items: Anggota[]
    total: number
    page: number
    totalPages: number
  }
}

export const getAnggotaList = async (page: number = 1, limit: number = 10) => {
  const response = await api.get<AnggotaListResponse>('/api/anggota', {
    params: { page, limit },
  })
  return response.data
}