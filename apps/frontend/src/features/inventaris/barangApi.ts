import { api } from '../../lib/axios'

export type KondisiBarang = 'BAIK' | 'RUSAK_RINGAN' | 'RUSAK_BERAT'

export interface Barang {
  id: string
  nama: string
  deskripsi: string | null
  jumlah: number
  kondisi: KondisiBarang
  jumlahDipinjam: number
  stokTersedia: number
  createdAt: string
  updatedAt: string
}

interface BarangListResponse {
  success: boolean
  data: Barang[]
}

export const getBarangList = async () => {
  const response = await api.get<BarangListResponse>('/api/inventaris')
  return response.data
}

export interface BarangFormData {
  nama: string
  deskripsi?: string
  jumlah: number
  kondisi: KondisiBarang
}

export const createBarang = async (payload: BarangFormData) => {
  const response = await api.post('/api/inventaris', payload)
  return response.data
}

export const updateBarang = async (id: string, payload: Partial<BarangFormData>) => {
  const response = await api.put(`/api/inventaris/${id}`, payload)
  return response.data
}

export const deleteBarang = async (id: string) => {
  const response = await api.delete(`/api/inventaris/${id}`)
  return response.data
}