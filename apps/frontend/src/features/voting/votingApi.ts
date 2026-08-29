import { api } from '../../lib/axios'

export type StatusVoting = 'TERBUKA' | 'DITUTUP'

export interface Pilihan {
  id: string
  teks: string
  urutan: number
}

export interface VotingSession {
  id: string
  judul: string
  deskripsi: string | null
  status: StatusVoting
  ditutupPada: string | null
  creator: { id: string; name: string }
  jumlahPilihan?: number
  totalSuara?: number
  pilihan?: Pilihan[]
  sudahVoting?: boolean
  createdAt: string
}

interface VotingListResponse {
  success: boolean
  data: VotingSession[]
}

export const getVotingList = async () => {
  const response = await api.get<VotingListResponse>('/api/voting')
  return response.data
}

export const getVotingDetail = async (id: string) => {
  const response = await api.get<{ success: boolean; data: VotingSession }>(`/api/voting/${id}`)
  return response.data
}

export interface VotingFormData {
  judul: string
  deskripsi?: string
  pilihan: string[]
}

export const createVoting = async (payload: VotingFormData) => {
  const response = await api.post('/api/voting', payload)
  return response.data
}

export const voteVoting = async (id: string, pilihanId: string) => {
  const response = await api.post(`/api/voting/${id}/vote`, { pilihanId })
  return response.data
}

export const tutupVoting = async (id: string) => {
  const response = await api.post(`/api/voting/${id}/tutup`)
  return response.data
}

export const bukaVoting = async (id: string) => {
  const response = await api.post(`/api/voting/${id}/buka`)
  return response.data
}

export const deleteVoting = async (id: string) => {
  const response = await api.delete(`/api/voting/${id}`)
  return response.data
}

export interface HasilVoting {
  id: string
  judul: string
  status: StatusVoting
  ditutupPada: string | null
  totalSuara: number
  hasil: { id: string; teks: string; urutan: number; jumlah: number }[]
}

export const getHasilVoting = async (id: string) => {
  const response = await api.get<{ success: boolean; data: HasilVoting }>(
    `/api/voting/${id}/hasil`
  )
  return response.data
}