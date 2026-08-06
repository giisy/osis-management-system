import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { prisma } from '../lib/prisma'
import {
  createAnggotaSchema,
  updateAnggotaSchema,
  paginationSchema,
} from '../lib/validation/anggotaSchema'
import { AuthRequest } from '../middlewares/authMiddleware'

export const listAnggota = async (req: AuthRequest, res: Response) => {
  const parsed = paginationSchema.safeParse(req.query)

  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: 'Validasi gagal',
      errors: parsed.error.issues,
    })
  }

  const { page, limit } = parsed.data

  const [items, total] = await Promise.all([
    prisma.user.findMany({
      where: { role: 'ANGGOTA' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        nis: true,
        kelas: true,
        jenisKelamin: true,
        noTelepon: true,
        alamat: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.user.count({ where: { role: 'ANGGOTA' } }),
  ])

  res.status(200).json({
    success: true,
    data: {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    },
  })
}

export const getAnggota = async (req: AuthRequest, res: Response) => {
  const { id } = req.params as { id: string }

  const user = await prisma.user.findFirst({
    where: { id, role: 'ANGGOTA' },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      nis: true,
      kelas: true,
      jenisKelamin: true,
      noTelepon: true,
      alamat: true,
      createdAt: true,
      updatedAt: true,
    },
  })

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'Anggota tidak ditemukan',
    })
  }

  res.status(200).json({
    success: true,
    data: user,
  })
}

export const createAnggota = async (req: AuthRequest, res: Response) => {
  const parsed = createAnggotaSchema.safeParse(req.body)

  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: 'Validasi gagal',
      errors: parsed.error.issues,
    })
  }

  const { name, email, password, role, nis, kelas, jenisKelamin, noTelepon, alamat } =
    parsed.data

  const existingUser = await prisma.user.findUnique({ where: { email } })

  if (existingUser) {
    return res.status(409).json({
      success: false,
      message: 'Email sudah terdaftar',
    })
  }

  if (nis) {
    const existingNis = await prisma.user.findUnique({ where: { nis } })
    if (existingNis) {
      return res.status(409).json({
        success: false,
        message: 'NIS sudah terdaftar',
      })
    }
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  try {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        nis,
        kelas,
        jenisKelamin,
        noTelepon,
        alamat,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        nis: true,
        kelas: true,
        jenisKelamin: true,
        noTelepon: true,
        alamat: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    res.status(201).json({
      success: true,
      message: 'Anggota berhasil ditambahkan',
      data: user,
    })
  } catch (error) {
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      return res.status(409).json({
        success: false,
        message: 'Email atau NIS sudah terdaftar',
      })
    }
    throw error
  }
}

export const updateAnggota = async (req: AuthRequest, res: Response) => {
  const { id } = req.params as { id: string }

  const parsed = updateAnggotaSchema.safeParse(req.body)

  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: 'Validasi gagal',
      errors: parsed.error.issues,
    })
  }

  const existingUser = await prisma.user.findFirst({
    where: { id, role: 'ANGGOTA' },
  })

  if (!existingUser) {
    return res.status(404).json({
      success: false,
      message: 'Anggota tidak ditemukan',
    })
  }

  if (parsed.data.email) {
    const emailOwner = await prisma.user.findUnique({
      where: { email: parsed.data.email },
    })
    if (emailOwner && emailOwner.id !== id) {
      return res.status(409).json({
        success: false,
        message: 'Email sudah digunakan oleh anggota lain',
      })
    }
  }

  if (parsed.data.nis) {
    const nisOwner = await prisma.user.findUnique({
      where: { nis: parsed.data.nis },
    })
    if (nisOwner && nisOwner.id !== id) {
      return res.status(409).json({
        success: false,
        message: 'NIS sudah digunakan oleh anggota lain',
      })
    }
  }

  try {
    const user = await prisma.user.update({
      where: { id },
      data: parsed.data,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        nis: true,
        kelas: true,
        jenisKelamin: true,
        noTelepon: true,
        alamat: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    res.status(200).json({
      success: true,
      message: 'Data anggota berhasil diperbarui',
      data: user,
    })
  } catch (error) {
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      return res.status(409).json({
        success: false,
        message: 'Email atau NIS sudah digunakan',
      })
    }
    throw error
  }
}

export const deleteAnggota = async (req: AuthRequest, res: Response) => {
  const { id } = req.params as { id: string }

  const existingUser = await prisma.user.findFirst({
    where: { id, role: 'ANGGOTA' },
  })

  if (!existingUser) {
    return res.status(404).json({
      success: false,
      message: 'Anggota tidak ditemukan',
    })
  }

  await prisma.user.delete({ where: { id } })

  res.status(200).json({
    success: true,
    message: 'Anggota berhasil dihapus',
  })
}
