import { z } from 'zod'

export const divisiSchema = z.object({
  nama: z.string().min(3, 'Nama minimal 3 karakter'),
  deskripsi: z.string().optional(),
})

export type DivisiFormValues = z.infer<typeof divisiSchema>