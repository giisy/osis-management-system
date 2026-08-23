import { z } from 'zod'

export const agendaSchema = z
  .object({
    judul: z.string().min(3, 'Judul minimal 3 karakter'),
    deskripsi: z.string().optional(),
    lokasi: z.string().optional(),
    tanggalMulai: z.string().min(1, 'Tanggal mulai wajib diisi'),
    jamMulai: z.string().min(1, 'Jam mulai wajib diisi'),
    tanggalSelesai: z.string().optional(),
    jamSelesai: z.string().optional(),
  })
  .refine(
    (data) => {
      if (!data.tanggalSelesai || !data.jamSelesai) return true
      const mulai = new Date(`${data.tanggalMulai}T${data.jamMulai}`)
      const selesai = new Date(`${data.tanggalSelesai}T${data.jamSelesai}`)
      return selesai > mulai
    },
    {
      message: 'Waktu selesai harus setelah waktu mulai',
      path: ['tanggalSelesai'],
    }
  )

export type AgendaFormValues = z.infer<typeof agendaSchema>