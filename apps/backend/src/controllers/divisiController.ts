import { Request, Response } from 'express'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { prisma } from '../lib/prisma'
import {
  createDivisiSchema,
  updateDivisiSchema,
} from '../lib/validation/divisiSchema'
import { AuthRequest } from '../middlewares/authMiddleware'

const divisiSelect = {
  id: true,
  nama: true,
  deskripsi: true,
  createdAt: true,
  updatedAt: true,
}

export const listDivisi = async (req: AuthRequest, res: Response) => {
  const items = await prisma.divisi.findMany({
    select: {
      ...divisiSelect,
      _count: { select: { anggota: true } },
    },
    orderBy: { nama: 'asc' },
  })

  res.status(200).json({
    success: true,
    data: items.map(({ _count, ...divisi }) => ({
      ...divisi,
      jumlahAnggota: _count.anggota,
    })),
  })
}

const divisiAnggotaSelect = {
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
}

export const getDivisi = async (req: AuthRequest, res: Response) => {
  const { id } = req.params as { id: string }

  const canSeePii = ['SUPER_ADMIN', 'ADMIN', 'KETUA'].includes(req.user!.role)

  const divisi = await prisma.divisi.findUnique({
    where: { id },
    select: {
      ...divisiSelect,
      anggota: {
        select: divisiAnggotaSelect,
        orderBy: { name: 'asc' },
      },
    },
  })

  if (!divisi) {
    return res.status(404).json({
      success: false,
      message: 'Divisi tidak ditemukan',
    })
  }

  const anggota = canSeePii
    ? divisi.anggota
    : divisi.anggota.map((a) => {
        const { email, nis, jenisKelamin, noTelepon, alamat, ...safe } = a
        return safe
      })

  res.status(200).json({
    success: true,
    data: {
      ...divisi,
      anggota,
    },
  })
}

export const createDivisi = async (req: AuthRequest, res: Response) => {
  const parsed = createDivisiSchema.safeParse(req.body)

  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: 'Validasi gagal',
      errors: parsed.error.issues,
    })
  }

  const { nama, deskripsi } = parsed.data

  const existingDivisi = await prisma.divisi.findUnique({ where: { nama } })

  if (existingDivisi) {
    return res.status(409).json({
      success: false,
      message: 'Nama divisi sudah digunakan',
    })
  }

  try {
    const divisi = await prisma.divisi.create({
      data: { nama, deskripsi },
      select: divisiSelect,
    })

    res.status(201).json({
      success: true,
      message: 'Divisi berhasil ditambahkan',
      data: divisi,
    })
  } catch (error) {
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      return res.status(409).json({
        success: false,
        message: 'Nama divisi sudah digunakan',
      })
    }
    throw error
  }
}

export const updateDivisi = async (req: AuthRequest, res: Response) => {
  const { id } = req.params as { id: string }

  const parsed = updateDivisiSchema.safeParse(req.body)

  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: 'Validasi gagal',
      errors: parsed.error.issues,
    })
  }

  const existingDivisi = await prisma.divisi.findUnique({ where: { id } })

  if (!existingDivisi) {
    return res.status(404).json({
      success: false,
      message: 'Divisi tidak ditemukan',
    })
  }

  if (parsed.data.nama) {
    const namaOwner = await prisma.divisi.findUnique({
      where: { nama: parsed.data.nama },
    })
    if (namaOwner && namaOwner.id !== id) {
      return res.status(409).json({
        success: false,
        message: 'Nama divisi sudah digunakan oleh divisi lain',
      })
    }
  }

  try {
    const divisi = await prisma.divisi.update({
      where: { id },
      data: parsed.data,
      select: divisiSelect,
    })

    res.status(200).json({
      success: true,
      message: 'Data divisi berhasil diperbarui',
      data: divisi,
    })
  } catch (error) {
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      return res.status(409).json({
        success: false,
        message: 'Nama divisi sudah digunakan',
      })
    }
    throw error
  }
}

export const deleteDivisi = async (req: AuthRequest, res: Response) => {
  const { id } = req.params as { id: string }

  const existingDivisi = await prisma.divisi.findUnique({
    where: { id },
    include: { _count: { select: { anggota: true } } },
  })

  if (!existingDivisi) {
    return res.status(404).json({
      success: false,
      message: 'Divisi tidak ditemukan',
    })
  }

  if (existingDivisi._count.anggota > 0) {
    return res.status(409).json({
      success: false,
      message: `Divisi masih memiliki ${existingDivisi._count.anggota} anggota. Pindahkan anggota terlebih dahulu.`,
    })
  }

  try {
    await prisma.divisi.delete({ where: { id } })
  } catch (error) {
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === 'P2003'
    ) {
      return res.status(409).json({
        success: false,
        message: 'Divisi masih memiliki anggota. Pindahkan anggota terlebih dahulu.',
      })
    }
    throw error
  }

  res.status(200).json({
    success: true,
    message: 'Divisi berhasil dihapus',
  })
}
