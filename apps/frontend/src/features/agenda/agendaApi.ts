import { api } from '../../lib/axios'

export interface Agenda {
  id: string
  judul: string
  deskripsi: string | null
  lokasi: string | null
  waktuMulai: string
  waktuSelesai: string | null
  createdBy: string
}

interface AgendaListResponse {
  success: boolean
  data: Agenda[]
}

export const getAgendaList = async () => {
  const response = await api.get<AgendaListResponse>('/api/agenda')
  return response.data
}