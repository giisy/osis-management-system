import { z } from 'zod'

export const anggotaSchema = z.object({
  name: z.string().min(3, 'Nama minimal 3 karakter'),
  email: z.string().email('Email tidak valid'),
  password: z.string().min(8, 'Password minimal 8 karakter').optional().or(z.literal('')),
  nis: z.string().regex(/^\d{6,}$/, 'NIS harus berupa angka minimal 6 digit').optional().or(z.literal('')),
  kelas: z.string().optional(),
  jenisKelamin: z.enum(['L', 'P']).optional(),
  noTelepon: z.string().optional(),
  alamat: z.string().optional(),
  divisiId: z
    .string()
    .uuid()
    .nullable()
    .optional()
    .or(z.literal(''))
    .transform((val) => (val === '' ? null : val)),
})

export type AnggotaFormInput = z.input<typeof anggotaSchema>
export type AnggotaFormData = z.infer<typeof anggotaSchema>