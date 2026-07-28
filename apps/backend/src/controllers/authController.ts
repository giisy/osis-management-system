import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import { prisma } from '../lib/prisma'
import { registerSchema, loginSchema } from '../lib/validation/authSchema'
import { generateToken } from '../lib/jwt'
import { AuthRequest } from '../middlewares/authMiddleware'

export const register = async (req: Request, res: Response) => {
  const parsed = registerSchema.safeParse(req.body)

  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: 'Validasi gagal',
      errors: parsed.error.issues,
    })
  }

  const { name, email, password } = parsed.data

  const existingUser = await prisma.user.findUnique({ where: { email } })

  if (existingUser) {
    return res.status(409).json({
      success: false,
      message: 'Email sudah terdaftar',
    })
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  })

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

export const login = async (req: Request, res: Response) => {
  const parsed = loginSchema.safeParse(req.body)

  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: 'Validasi gagal',
      errors: parsed.error.issues,
    })
  }

  const { email, password } = parsed.data

  const user = await prisma.user.findUnique({ where: { email } })

  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Email atau password salah',
    })
  }

  const isPasswordValid = await bcrypt.compare(password, user.password)

  if (!isPasswordValid) {
    return res.status(401).json({
      success: false,
      message: 'Email atau password salah',
    })
  }

  const token = generateToken({ userId: user.id, role: user.role })

  res.status(200).json({
    success: true,
    message: 'Login berhasil',
    data: {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    },
  })
}

export const me = async (req: AuthRequest, res: Response) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.userId },
  })

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User tidak ditemukan',
    })
  }

  res.status(200).json({
    success: true,
    data: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  })
}