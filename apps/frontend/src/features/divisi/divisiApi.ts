import { api } from '../../lib/axios'

export interface Divisi {
  id: string
  nama: string
  deskripsi: string | null
}

interface DivisiListResponse {
  success: boolean
  data: Divisi[]
}

export const getDivisiList = async () => {
  const response = await api.get<DivisiListResponse>('/api/divisi')
  return response.data
}