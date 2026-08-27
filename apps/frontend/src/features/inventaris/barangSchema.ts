import { z } from 'zod'

export const barangSchema = z.object({
  nama: z.string().min(3, 'Nama minimal 3 karakter'),
  deskripsi: z.string().optional(),
  jumlah: z.coerce.number().int().min(1, 'Jumlah minimal 1'),
  kondisi: z.enum(['BAIK', 'RUSAK_RINGAN', 'RUSAK_BERAT']),
})

export type BarangFormInput = z.input<typeof barangSchema>
export type BarangFormValues = z.infer<typeof barangSchema>