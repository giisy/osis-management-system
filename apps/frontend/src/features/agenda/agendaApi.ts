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

export interface AgendaPayload {
  judul: string
  deskripsi?: string
  lokasi?: string
  waktuMulai: string
  waktuSelesai?: string | null
}

export const createAgenda = async (payload: AgendaPayload) => {
  const response = await api.post('/api/agenda', payload)
  return response.data
}

export const updateAgenda = async (id: string, payload: Partial<AgendaPayload>) => {
  const response = await api.put(`/api/agenda/${id}`, payload)
  return response.data
}

export const deleteAgenda = async (id: string) => {
  const response = await api.delete(`/api/agenda/${id}`)
  return response.data
}