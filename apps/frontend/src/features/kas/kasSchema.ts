import { z } from 'zod'

export const kasSchema = z.object({
  jenis: z.enum(['PEMASUKAN', 'PENGELUARAN']),
  jumlah: z.coerce.number().int().min(1, 'Jumlah harus lebih dari 0'),
  keterangan: z.string().min(3, 'Keterangan minimal 3 karakter').max(200),
  tanggal: z.string().min(1, 'Tanggal wajib diisi'),
})

export type KasFormInput = z.input<typeof kasSchema>
export type KasFormValues = z.infer<typeof kasSchema>