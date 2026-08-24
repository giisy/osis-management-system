import { z } from 'zod'

export const tandaiAbsensiSchema = z.object({
  userId: z.string().uuid('ID user tidak valid'),
  status: z.enum(['HADIR', 'IZIN', 'ALFA']),
})
