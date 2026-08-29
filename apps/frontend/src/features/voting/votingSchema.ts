import { z } from 'zod'

export const votingSchema = z.object({
  judul: z.string().min(3, 'Judul minimal 3 karakter').max(200),
  deskripsi: z.string().optional(),
  pilihan: z
    .array(
      z.object({
        value: z.string().min(1, 'Teks pilihan tidak boleh kosong').max(100),
      })
    )
    .min(2, 'Minimal 2 pilihan')
    .max(10, 'Maksimal 10 pilihan'),
})

export type VotingFormValues = z.infer<typeof votingSchema>