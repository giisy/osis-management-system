import { z } from 'zod'

export const createPengumumanSchema = z.object({
  judul: z.string().min(3, 'Judul minimal 3 karakter').max(200, 'Judul maksimal 200 karakter'),
  isi: z.string().min(10, 'Isi pengumuman minimal 10 karakter').max(5000, 'Isi pengumuman maksimal 5000 karakter'),
})

export const updatePengumumanSchema = z.object({
  judul: z.string().min(3, 'Judul minimal 3 karakter').max(200, 'Judul maksimal 200 karakter').optional(),
  isi: z
    .string()
    .min(10, 'Isi pengumuman minimal 10 karakter')
    .max(5000, 'Isi pengumuman maksimal 5000 karakter')
    .optional(),
})
