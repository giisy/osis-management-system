import { z } from 'zod'

export const createDivisiSchema = z.object({
  nama: z.string().min(3, 'Nama divisi minimal 3 karakter'),
  deskripsi: z.string().min(1, 'Deskripsi tidak boleh kosong').optional(),
})

export const updateDivisiSchema = z.object({
  nama: z.string().min(3, 'Nama divisi minimal 3 karakter').optional(),
  deskripsi: z.string().min(1, 'Deskripsi tidak boleh kosong').nullable().optional(),
})
