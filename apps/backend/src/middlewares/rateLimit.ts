import { Request, Response } from 'express'
import { rateLimit } from 'express-rate-limit'

const jsonHandler = (message: string) => (req: Request, res: Response) => {
  res.status(429).json({
    success: false,
    message,
  })
}

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  handler: jsonHandler('Terlalu banyak percobaan login. Coba lagi dalam 15 menit.'),
})

export const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  handler: jsonHandler('Terlalu banyak permintaan registrasi. Coba lagi dalam 1 jam.'),
})
