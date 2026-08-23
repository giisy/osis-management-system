import { api } from '../../lib/axios'

export interface Pengumuman {
  id: string
  judul: string
  isi: string
  creator: { id: string; name: string }
  createdAt: string
  updatedAt: string
}

interface PengumumanListResponse {
  success: boolean
  data: Pengumuman[]
}

export const getPengumumanList = async () => {
  const response = await api.get<PengumumanListResponse>('/api/pengumuman')
  return response.data
}

export interface PengumumanFormData {
  judul: string
  isi: string
}

export const createPengumuman = async (payload: PengumumanFormData) => {
  const response = await api.post('/api/pengumuman', payload)
  return response.data
}

export const updatePengumuman = async (id: string, payload: Partial<PengumumanFormData>) => {
  const response = await api.put(`/api/pengumuman/${id}`, payload)
  return response.data
}

export const deletePengumuman = async (id: string) => {
  const response = await api.delete(`/api/pengumuman/${id}`)
  return response.data
}