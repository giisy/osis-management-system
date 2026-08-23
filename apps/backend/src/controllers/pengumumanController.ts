import { Response } from 'express'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { prisma } from '../lib/prisma'
import {
  createPengumumanSchema,
  updatePengumumanSchema,
} from '../lib/validation/pengumumanSchema'
import { AuthRequest } from '../middlewares/authMiddleware'

const pengumumanSelect = {
  id: true,
  judul: true,
  isi: true,
  creator: { select: { id: true, name: true } },
  createdAt: true,
  updatedAt: true,
}

export const listPengumuman = async (req: AuthRequest, res: Response) => {
  const items = await prisma.pengumuman.findMany({
    select: pengumumanSelect,
    orderBy: { createdAt: 'desc' },
  })

  res.status(200).json({
    success: true,
    data: items,
  })
}

export const getPengumuman = async (req: AuthRequest, res: Response) => {
  const { id } = req.params as { id: string }

  const pengumuman = await prisma.pengumuman.findUnique({
    where: { id },
    select: pengumumanSelect,
  })

  if (!pengumuman) {
    return res.status(404).json({
      success: false,
      message: 'Pengumuman tidak ditemukan',
    })
  }

  res.status(200).json({
    success: true,
    data: pengumuman,
  })
}

export const createPengumuman = async (req: AuthRequest, res: Response) => {
  const parsed = createPengumumanSchema.safeParse(req.body)

  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: 'Validasi gagal',
      errors: parsed.error.issues,
    })
  }

  const { judul, isi } = parsed.data

  try {
    const pengumuman = await prisma.pengumuman.create({
      data: {
        judul,
        isi,
        createdBy: req.user!.userId,
      },
      select: pengumumanSelect,
    })

    res.status(201).json({
      success: true,
      message: 'Pengumuman berhasil ditambahkan',
      data: pengumuman,
    })
  } catch (error) {
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === 'P2003'
    ) {
      return res.status(404).json({
        success: false,
        message: 'User pembuat pengumuman tidak ditemukan',
      })
    }
    throw error
  }
}

export const updatePengumuman = async (req: AuthRequest, res: Response) => {
  const { id } = req.params as { id: string }

  const parsed = updatePengumumanSchema.safeParse(req.body)

  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: 'Validasi gagal',
      errors: parsed.error.issues,
    })
  }

  const existingPengumuman = await prisma.pengumuman.findUnique({ where: { id } })

  if (!existingPengumuman) {
    return res.status(404).json({
      success: false,
      message: 'Pengumuman tidak ditemukan',
    })
  }

  try {
    const pengumuman = await prisma.pengumuman.update({
      where: { id },
      data: parsed.data,
      select: pengumumanSelect,
    })

    res.status(200).json({
      success: true,
      message: 'Data pengumuman berhasil diperbarui',
      data: pengumuman,
    })
  } catch (error) {
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === 'P2003'
    ) {
      return res.status(404).json({
        success: false,
        message: 'User pembuat pengumuman tidak ditemukan',
      })
    }
    throw error
  }
}

export const deletePengumuman = async (req: AuthRequest, res: Response) => {
  const { id } = req.params as { id: string }

  const existingPengumuman = await prisma.pengumuman.findUnique({ where: { id } })

  if (!existingPengumuman) {
    return res.status(404).json({
      success: false,
      message: 'Pengumuman tidak ditemukan',
    })
  }

  await prisma.pengumuman.delete({ where: { id } })

  res.status(200).json({
    success: true,
    message: 'Pengumuman berhasil dihapus',
  })
}
