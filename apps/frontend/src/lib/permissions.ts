export type Role =
  | 'SUPER_ADMIN'
  | 'ADMIN'
  | 'SEKRETARIS'
  | 'BENDAHARA'
  | 'KOORDINATOR_DIVISI'
  | 'ANGGOTA'
  | 'PEMBINA'

export const getCurrentRole = (): Role | null => {
  const userJson = localStorage.getItem('user')
  if (!userJson) return null
  try {
    return JSON.parse(userJson).role as Role
  } catch {
    return null
  }
}

// Anggota — ANGGOTA sama sekali tidak bisa lihat data anggota lain
export const canViewAnggota = (role: Role | null) =>
  role !== null && role !== 'ANGGOTA'
export const canManageAnggota = (role: Role | null) =>
  role === 'SUPER_ADMIN' || role === 'ADMIN'

// Divisi — semua role login boleh lihat, manage terbatas
export const canManageDivisi = (role: Role | null) =>
  role === 'SUPER_ADMIN' || role === 'ADMIN'

// Agenda
export const canManageAgenda = (role: Role | null) =>
  ['SUPER_ADMIN', 'ADMIN', 'SEKRETARIS', 'KOORDINATOR_DIVISI'].includes(role ?? '')
export const canDeleteAgenda = (role: Role | null) =>
  role === 'SUPER_ADMIN' || role === 'ADMIN'

// Pengumuman
export const canManagePengumuman = (role: Role | null) =>
  ['SUPER_ADMIN', 'ADMIN', 'SEKRETARIS'].includes(role ?? '')
export const canDeletePengumuman = (role: Role | null) =>
  role === 'SUPER_ADMIN' || role === 'ADMIN'

// Absensi rekap (bukan check-in — check-in tetap semua role boleh)
export const canViewRekapAbsensi = (role: Role | null) =>
  ['SUPER_ADMIN', 'ADMIN', 'SEKRETARIS', 'KOORDINATOR_DIVISI', 'PEMBINA'].includes(role ?? '')

// Kas
export const canManageKas = (role: Role | null) => role === 'BENDAHARA'
export const canDeleteKas = (role: Role | null) => role === 'SUPER_ADMIN'

// Inventaris (Barang)
export const canManageInventaris = (role: Role | null) =>
  role === 'SUPER_ADMIN' || role === 'ADMIN'

// Voting
export const canManageVoting = (role: Role | null) =>
  ['SUPER_ADMIN', 'ADMIN', 'SEKRETARIS'].includes(role ?? '')
export const canDeleteVoting = (role: Role | null) =>
  role === 'SUPER_ADMIN' || role === 'ADMIN'