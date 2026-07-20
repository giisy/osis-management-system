import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import { prisma } from '../lib/prisma'
import { registerSchema } from '../lib/validation/authSchema'

export const register = async (req: Request, res: Response) => {
  // 1. Validasi input pakai Zod
  const parsed = registerSchema.safeParse(req.body)

  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: 'Validasi gagal',
      errors: parsed.error.issues,
    })
  }

  const { name, email, password } = parsed.data

  // 2. Cek apakah email sudah terdaftar
  const existingUser = await prisma.user.findUnique({ where: { email } })

  if (existingUser) {
    return res.status(409).json({
      success: false,
      message: 'Email sudah terdaftar',
    })
  }

  // 3. Hash password (never simpan password asli!)
  const hashedPassword = await bcrypt.hash(password, 10)

  // 4. Simpan ke database
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  })

  // 5. Balikin response TANPA password
  res.status(201).json({
    success: true,
    message: 'Registrasi berhasil',
    data: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  })
}