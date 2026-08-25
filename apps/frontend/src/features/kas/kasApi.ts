import { api } from '../../lib/axios'

export type JenisTransaksi = 'PEMASUKAN' | 'PENGELUARAN'

export interface Transaksi {
  id: string
  jenis: JenisTransaksi
  jumlah: number
  keterangan: string
  tanggal: string
  creator: { id: string; name: string }
  createdAt: string
  updatedAt: string
}

interface TransaksiListResponse {
  success: boolean
  data: {
    items: Transaksi[]
    total: number
    page: number
    totalPages: number
  }
}

export const getKasList = async (page: number = 1, limit: number = 10, jenis?: JenisTransaksi) => {
  const response = await api.get<TransaksiListResponse>('/api/kas', {
    params: { page, limit, jenis },
  })
  return response.data
}

export interface LaporanKas {
  totalPemasukan: number
  totalPengeluaran: number
  saldo: number
  perBulan: { bulan: string; tahun: number; pemasukan: number; pengeluaran: number }[]
}

export const getLaporanKas = async () => {
  const response = await api.get<{ success: boolean; data: LaporanKas }>('/api/kas/laporan')
  return response.data
}

export interface KasFormData {
  jenis: JenisTransaksi
  jumlah: number
  keterangan: string
  tanggal: string
}

export const createKas = async (payload: KasFormData) => {
  const response = await api.post('/api/kas', payload)
  return response.data
}

export const updateKas = async (id: string, payload: Partial<KasFormData>) => {
  const response = await api.put(`/api/kas/${id}`, payload)
  return response.data
}

export const deleteKas = async (id: string) => {
  const response = await api.delete(`/api/kas/${id}`)
  return response.data
}