import { Response } from 'express'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { prisma } from '../lib/prisma'
import {
  peminjamanQuerySchema,
  createPeminjamanSchema,
} from '../lib/validation/inventarisSchema'
import { AuthRequest } from '../middlewares/authMiddleware'

const peminjamanSelect = {
  id: true,
  barang: { select: { id: true, nama: true, kondisi: true } },
  user: { select: { id: true, name: true, kelas: true } },
  jumlah: true,
  keperluan: true,
  tanggalPinjam: true,
  tanggalKembali: true,
  status: true,
  createdAt: true,
  updatedAt: true,
}

export const listPeminjaman = async (req: AuthRequest, res: Response) => {
  const parsed = peminjamanQuerySchema.safeParse(req.query)

  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: 'Validasi gagal',
      errors: parsed.error.issues,
    })
  }

  const where = parsed.data.status ? { status: parsed.data.status } : {}

  const items = await prisma.peminjaman.findMany({
    where,
    select: peminjamanSelect,
    orderBy: { tanggalPinjam: 'desc' },
  })

  res.status(200).json({
    success: true,
    data: items,
  })
}

export const getPeminjaman = async (req: AuthRequest, res: Response) => {
  const { id } = req.params as { id: string }

  const peminjaman = await prisma.peminjaman.findUnique({
    where: { id },
    select: peminjamanSelect,
  })

  if (!peminjaman) {
    return res.status(404).json({
      success: false,
      message: 'Peminjaman tidak ditemukan',
    })
  }

  res.status(200).json({
    success: true,
    data: peminjaman,
  })
}

export const createPeminjaman = async (req: AuthRequest, res: Response) => {
  const parsed = createPeminjamanSchema.safeParse(req.body)

  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: 'Validasi gagal',
      errors: parsed.error.issues,
    })
  }

  const { barangId, jumlah, keperluan, tanggalPinjam, userId } = parsed.data
  const isAdmin = ['SUPER_ADMIN', 'ADMIN', 'KETUA'].includes(req.user!.role)
  const peminjamId = userId && isAdmin ? userId : req.user!.userId

  try {
    const peminjaman = await prisma.$transaction(async (tx) => {
      const barang = await tx.barang.findUnique({ where: { id: barangId } })

      if (!barang) {
        throw new Error('BARANG_NOT_FOUND')
      }

      if (barang.kondisi === 'RUSAK_BERAT') {
        throw new Error('BARANG_RUSAK_BERAT')
      }

      const dipinjam = await tx.peminjaman.aggregate({
        where: { barangId, status: 'DIPINJAM' },
        _sum: { jumlah: true },
      })

      const stokTersedia = barang.jumlah - (dipinjam._sum.jumlah ?? 0)

      if (jumlah > stokTersedia) {
        throw new Error(`STOK_TIDAK_CUKUP:${stokTersedia}`)
      }

      return tx.peminjaman.create({
        data: {
          barangId,
          userId: peminjamId,
          jumlah,
          keperluan,
          tanggalPinjam,
        },
        select: peminjamanSelect,
      })
    })

    res.status(201).json({
      success: true,
      message: 'Peminjaman berhasil dicatat',
      data: peminjaman,
    })
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'BARANG_NOT_FOUND') {
        return res.status(404).json({
          success: false,
          message: 'Barang tidak ditemukan',
        })
      }
      if (error.message === 'BARANG_RUSAK_BERAT') {
        return res.status(400).json({
          success: false,
          message: 'Barang dengan kondisi rusak berat tidak bisa dipinjam',
        })
      }
      if (error.message.startsWith('STOK_TIDAK_CUKUP:')) {
        const tersedia = error.message.split(':')[1]
        return res.status(409).json({
          success: false,
          message: `Stok tidak cukup: tersedia ${tersedia}, diminta ${jumlah}`,
        })
      }
    }
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === 'P2003'
    ) {
      return res.status(404).json({
        success: false,
        message: 'Barang atau user tidak ditemukan',
      })
    }
    throw error
  }
}

export const kembalikanPeminjaman = async (req: AuthRequest, res: Response) => {
  const { id } = req.params as { id: string }

  const existingPeminjaman = await prisma.peminjaman.findUnique({
    where: { id },
  })

  if (!existingPeminjaman) {
    return res.status(404).json({
      success: false,
      message: 'Peminjaman tidak ditemukan',
    })
  }

  if (existingPeminjaman.status === 'DIKEMBALIKAN') {
    return res.status(409).json({
      success: false,
      message: 'Peminjaman ini sudah dikembalikan',
    })
  }

  const isAdmin = ['SUPER_ADMIN', 'ADMIN', 'KETUA'].includes(req.user!.role)
  if (!isAdmin && existingPeminjaman.userId !== req.user!.userId) {
    return res.status(403).json({
      success: false,
      message: 'Kamu tidak punya akses untuk aksi ini',
    })
  }

  if (existingPeminjaman.tanggalPinjam > new Date()) {
    return res.status(400).json({
      success: false,
      message: 'Barang belum dipinjam — tanggal pinjam masih di masa depan',
    })
  }

  const peminjaman = await prisma.peminjaman.update({
    where: { id },
    data: {
      status: 'DIKEMBALIKAN',
      tanggalKembali: new Date(),
    },
    select: peminjamanSelect,
  })

  res.status(200).json({
    success: true,
    message: 'Peminjaman berhasil dikembalikan',
    data: peminjaman,
  })
}
