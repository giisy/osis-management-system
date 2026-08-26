import { Response } from 'express'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { prisma } from '../lib/prisma'
import {
  createBarangSchema,
  updateBarangSchema,
} from '../lib/validation/inventarisSchema'
import { AuthRequest } from '../middlewares/authMiddleware'

const barangSelect = {
  id: true,
  nama: true,
  deskripsi: true,
  jumlah: true,
  kondisi: true,
  createdAt: true,
  updatedAt: true,
}

export const listBarang = async (req: AuthRequest, res: Response) => {
  const items = await prisma.barang.findMany({
    select: {
      ...barangSelect,
      peminjaman: {
        where: { status: 'DIPINJAM' },
        select: { jumlah: true },
      },
    },
    orderBy: { nama: 'asc' },
  })

  res.status(200).json({
    success: true,
    data: items.map(({ peminjaman, ...barang }) => ({
      ...barang,
      jumlahDipinjam: peminjaman.reduce((sum, p) => sum + p.jumlah, 0),
      stokTersedia: barang.jumlah - peminjaman.reduce((sum, p) => sum + p.jumlah, 0),
    })),
  })
}

export const getBarang = async (req: AuthRequest, res: Response) => {
  const { id } = req.params as { id: string }

  const barang = await prisma.barang.findUnique({
    where: { id },
    select: {
      ...barangSelect,
      peminjaman: {
        where: { status: 'DIPINJAM' },
        select: {
          id: true,
          jumlah: true,
          keperluan: true,
          tanggalPinjam: true,
          user: { select: { id: true, name: true, kelas: true } },
        },
        orderBy: { tanggalPinjam: 'desc' },
      },
    },
  })

  if (!barang) {
    return res.status(404).json({
      success: false,
      message: 'Barang tidak ditemukan',
    })
  }

  const jumlahDipinjam = barang.peminjaman.reduce((sum, p) => sum + p.jumlah, 0)

  res.status(200).json({
    success: true,
    data: {
      ...barang,
      jumlahDipinjam,
      stokTersedia: barang.jumlah - jumlahDipinjam,
    },
  })
}

export const createBarang = async (req: AuthRequest, res: Response) => {
  const parsed = createBarangSchema.safeParse(req.body)

  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: 'Validasi gagal',
      errors: parsed.error.issues,
    })
  }

  const { nama, deskripsi, jumlah, kondisi } = parsed.data

  const existingBarang = await prisma.barang.findUnique({ where: { nama } })

  if (existingBarang) {
    return res.status(409).json({
      success: false,
      message: 'Nama barang sudah digunakan',
    })
  }

  try {
    const barang = await prisma.barang.create({
      data: { nama, deskripsi, jumlah, kondisi },
      select: barangSelect,
    })

    res.status(201).json({
      success: true,
      message: 'Barang berhasil ditambahkan',
      data: barang,
    })
  } catch (error) {
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      return res.status(409).json({
        success: false,
        message: 'Nama barang sudah digunakan',
      })
    }
    throw error
  }
}

export const updateBarang = async (req: AuthRequest, res: Response) => {
  const { id } = req.params as { id: string }

  const parsed = updateBarangSchema.safeParse(req.body)

  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: 'Validasi gagal',
      errors: parsed.error.issues,
    })
  }

  const existingBarang = await prisma.barang.findUnique({ where: { id } })

  if (!existingBarang) {
    return res.status(404).json({
      success: false,
      message: 'Barang tidak ditemukan',
    })
  }

  if (parsed.data.nama) {
    const namaOwner = await prisma.barang.findUnique({
      where: { nama: parsed.data.nama },
    })
    if (namaOwner && namaOwner.id !== id) {
      return res.status(409).json({
        success: false,
        message: 'Nama barang sudah digunakan oleh barang lain',
      })
    }
  }

  try {
    const barang = await prisma.barang.update({
      where: { id },
      data: parsed.data,
      select: barangSelect,
    })

    res.status(200).json({
      success: true,
      message: 'Data barang berhasil diperbarui',
      data: barang,
    })
  } catch (error) {
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      return res.status(409).json({
        success: false,
        message: 'Nama barang sudah digunakan',
      })
    }
    throw error
  }
}

export const deleteBarang = async (req: AuthRequest, res: Response) => {
  const { id } = req.params as { id: string }

  const existingBarang = await prisma.barang.findUnique({
    where: { id },
    include: {
      _count: { select: { peminjaman: { where: { status: 'DIPINJAM' } } } },
    },
  })

  if (!existingBarang) {
    return res.status(404).json({
      success: false,
      message: 'Barang tidak ditemukan',
    })
  }

  if (existingBarang._count.peminjaman > 0) {
    return res.status(409).json({
      success: false,
      message: `Barang masih dipinjam dalam ${existingBarang._count.peminjaman} peminjaman aktif. Tunggu dikembalikan terlebih dahulu.`,
    })
  }

  try {
    await prisma.barang.delete({ where: { id } })
  } catch (error) {
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === 'P2003'
    ) {
      return res.status(409).json({
        success: false,
        message: 'Barang masih dipinjam. Tunggu dikembalikan terlebih dahulu.',
      })
    }
    throw error
  }

  res.status(200).json({
    success: true,
    message: 'Barang berhasil dihapus',
  })
}
