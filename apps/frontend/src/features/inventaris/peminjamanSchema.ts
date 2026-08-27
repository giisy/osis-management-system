import { z } from 'zod'

export const peminjamanSchema = z.object({
  barangId: z.string().min(1, 'Pilih barang terlebih dahulu'),
  jumlah: z.coerce.number().int().min(1, 'Jumlah minimal 1'),
  keperluan: z.string().optional(),
  tanggalPinjam: z.string().min(1, 'Tanggal pinjam wajib diisi'),
})

export type PeminjamanFormInput = z.input<typeof peminjamanSchema>
export type PeminjamanFormValues = z.infer<typeof peminjamanSchema>