import { z } from 'zod'

const pilihanItemSchema = z
  .string()
  .min(1, 'Teks pilihan tidak boleh kosong')
  .max(100, 'Teks pilihan maksimal 100 karakter')

export const createVotingSchema = z
  .object({
    judul: z.string().min(3, 'Judul minimal 3 karakter').max(200, 'Judul maksimal 200 karakter'),
    deskripsi: z.string().min(1, 'Deskripsi tidak boleh kosong').optional(),
    pilihan: z
      .array(pilihanItemSchema)
      .min(2, 'Minimal 2 pilihan')
      .max(10, 'Maksimal 10 pilihan'),
  })
  .refine(
    (data) => new Set(data.pilihan.map((p) => p.toLowerCase())).size === data.pilihan.length,
    { message: 'Teks pilihan tidak boleh duplikat', path: ['pilihan'] },
  )

export const updateVotingSchema = z
  .object({
    judul: z.string().min(3, 'Judul minimal 3 karakter').max(200, 'Judul maksimal 200 karakter').optional(),
    deskripsi: z.string().min(1, 'Deskripsi tidak boleh kosong').nullable().optional(),
    pilihan: z
      .array(pilihanItemSchema)
      .min(2, 'Minimal 2 pilihan')
      .max(10, 'Maksimal 10 pilihan')
      .optional(),
  })
  .refine(
    (data) =>
      !data.pilihan ||
      new Set(data.pilihan.map((p) => p.toLowerCase())).size === data.pilihan.length,
    { message: 'Teks pilihan tidak boleh duplikat', path: ['pilihan'] },
  )

export const voteSchema = z.object({
  pilihanId: z.string().min(1, 'ID pilihan wajib diisi'),
})
