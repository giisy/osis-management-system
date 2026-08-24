import { z } from 'zod'

export const pengumumanSchema = z.object({
  judul: z.string().min(3, 'Judul minimal 3 karakter').max(200, 'Judul maksimal 200 karakter'),
  isi: z.string().min(10, 'Isi minimal 10 karakter').max(5000, 'Isi maksimal 5000 karakter'),
})

export type PengumumanFormValues = z.infer<typeof pengumumanSchema>