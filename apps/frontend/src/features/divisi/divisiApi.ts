import { api } from '../../lib/axios'

export interface Divisi {
  id: string
  nama: string
  deskripsi: string | null
  _count?: {
    anggota: number
  }
}

interface DivisiListResponse {
  success: boolean
  data: Divisi[]
}

export const getDivisiList = async () => {
  const response = await api.get<DivisiListResponse>('/api/divisi')
  return response.data
}

export interface DivisiFormData {
  nama: string
  deskripsi?: string
}

export const createDivisi = async (payload: DivisiFormData) => {
  const response = await api.post('/api/divisi', payload)
  return response.data
}

export const updateDivisi = async (id: string, payload: Partial<DivisiFormData>) => {
  const response = await api.put(`/api/divisi/${id}`, payload)
  return response.data
}

export const deleteDivisi = async (id: string) => {
  const response = await api.delete(`/api/divisi/${id}`)
  return response.data
}