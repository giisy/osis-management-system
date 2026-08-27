import { api } from '../../lib/axios'

export type StatusPeminjaman = 'DIPINJAM' | 'DIKEMBALIKAN'

export interface Peminjaman {
  id: string
  barang: { id: string; nama: string; kondisi: string }
  user: { id: string; name: string; kelas: string | null }
  jumlah: number
  keperluan: string | null
  tanggalPinjam: string
  tanggalKembali: string | null
  status: StatusPeminjaman
  createdAt: string
}

interface PeminjamanListResponse {
  success: boolean
  data: Peminjaman[]
}

export const getPeminjamanList = async (status?: StatusPeminjaman) => {
  const response = await api.get<PeminjamanListResponse>('/api/peminjaman', {
    params: { status },
  })
  return response.data
}

export interface PeminjamanFormData {
  barangId: string
  jumlah: number
  keperluan?: string
  tanggalPinjam: string
}

export const createPeminjaman = async (payload: PeminjamanFormData) => {
  const response = await api.post('/api/peminjaman', payload)
  return response.data
}

export const kembalikanPeminjaman = async (id: string) => {
  const response = await api.post(`/api/peminjaman/${id}/kembalikan`)
  return response.data
}