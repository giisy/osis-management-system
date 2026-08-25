import { Response } from 'express'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { prisma } from '../lib/prisma'
import {
  kasQuerySchema,
  createTransaksiSchema,
  updateTransaksiSchema,
} from '../lib/validation/kasSchema'
import { AuthRequest } from '../middlewares/authMiddleware'

const transaksiSelect = {
  id: true,
  jenis: true,
  jumlah: true,
  keterangan: true,
  tanggal: true,
  creator: { select: { id: true, name: true } },
  createdAt: true,
  updatedAt: true,
}

const NAMA_BULAN = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
]

export const listTransaksi = async (req: AuthRequest, res: Response) => {
  const parsed = kasQuerySchema.safeParse(req.query)

  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: 'Validasi gagal',
      errors: parsed.error.issues,
    })
  }

  const { page, limit, jenis } = parsed.data
  const where = jenis ? { jenis } : {}

  const [items, total] = await Promise.all([
    prisma.transaksi.findMany({
      where,
      select: transaksiSelect,
      orderBy: [{ tanggal: 'desc' }, { createdAt: 'desc' }],
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.transaksi.count({ where }),
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

export const getLaporanKas = async (req: AuthRequest, res: Response) => {
  const [pemasukan, pengeluaran, rows] = await Promise.all([
    prisma.transaksi.aggregate({
      where: { jenis: 'PEMASUKAN' },
      _sum: { jumlah: true },
    }),
    prisma.transaksi.aggregate({
      where: { jenis: 'PENGELUARAN' },
      _sum: { jumlah: true },
    }),
    prisma.transaksi.findMany({
      select: { jenis: true, jumlah: true, tanggal: true },
      where: {
        tanggal: { gte: new Date(new Date().setMonth(new Date().getMonth() - 11)) },
      },
      orderBy: { tanggal: 'asc' },
    }),
  ])

  const totalPemasukan = pemasukan._sum.jumlah ?? 0
  const totalPengeluaran = pengeluaran._sum.jumlah ?? 0

  type BulanEntry = {
    bulan: string
    tahun: number
    pemasukan: number
    pengeluaran: number
  }

  const perBulanMap = new Map<string, BulanEntry>()

  for (const row of rows) {
    const d = row.tanggal
    const key = `${d.getFullYear()}-${d.getMonth()}`
    let entry = perBulanMap.get(key)
    if (!entry) {
      entry = {
        bulan: NAMA_BULAN[d.getMonth()],
        tahun: d.getFullYear(),
        pemasukan: 0,
        pengeluaran: 0,
      }
      perBulanMap.set(key, entry)
    }
    if (row.jenis === 'PEMASUKAN') {
      entry.pemasukan += row.jumlah
    } else {
      entry.pengeluaran += row.jumlah
    }
  }

  res.status(200).json({
    success: true,
    data: {
      totalPemasukan,
      totalPengeluaran,
      saldo: totalPemasukan - totalPengeluaran,
      perBulan: Array.from(perBulanMap.values()),
    },
  })
}

export const getTransaksi = async (req: AuthRequest, res: Response) => {
  const { id } = req.params as { id: string }

  const transaksi = await prisma.transaksi.findUnique({
    where: { id },
    select: transaksiSelect,
  })

  if (!transaksi) {
    return res.status(404).json({
      success: false,
      message: 'Transaksi tidak ditemukan',
    })
  }

  res.status(200).json({
    success: true,
    data: transaksi,
  })
}

export const createTransaksi = async (req: AuthRequest, res: Response) => {
  const parsed = createTransaksiSchema.safeParse(req.body)

  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: 'Validasi gagal',
      errors: parsed.error.issues,
    })
  }

  const { jenis, jumlah, keterangan, tanggal } = parsed.data

  try {
    const transaksi = await prisma.transaksi.create({
      data: {
        jenis,
        jumlah,
        keterangan,
        tanggal,
        createdBy: req.user!.userId,
      },
      select: transaksiSelect,
    })

    res.status(201).json({
      success: true,
      message: 'Transaksi berhasil dicatat',
      data: transaksi,
    })
  } catch (error) {
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === 'P2003'
    ) {
      return res.status(404).json({
        success: false,
        message: 'User pencatat transaksi tidak ditemukan',
      })
    }
    throw error
  }
}

export const updateTransaksi = async (req: AuthRequest, res: Response) => {
  const { id } = req.params as { id: string }

  const parsed = updateTransaksiSchema.safeParse(req.body)

  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: 'Validasi gagal',
      errors: parsed.error.issues,
    })
  }

  const existingTransaksi = await prisma.transaksi.findUnique({ where: { id } })

  if (!existingTransaksi) {
    return res.status(404).json({
      success: false,
      message: 'Transaksi tidak ditemukan',
    })
  }

  try {
    const transaksi = await prisma.transaksi.update({
      where: { id },
      data: parsed.data,
      select: transaksiSelect,
    })

    res.status(200).json({
      success: true,
      message: 'Data transaksi berhasil diperbarui',
      data: transaksi,
    })
  } catch (error) {
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === 'P2003'
    ) {
      return res.status(404).json({
        success: false,
        message: 'User pencatat transaksi tidak ditemukan',
      })
    }
    throw error
  }
}

export const deleteTransaksi = async (req: AuthRequest, res: Response) => {
  const { id } = req.params as { id: string }

  const existingTransaksi = await prisma.transaksi.findUnique({ where: { id } })

  if (!existingTransaksi) {
    return res.status(404).json({
      success: false,
      message: 'Transaksi tidak ditemukan',
    })
  }

  await prisma.transaksi.delete({ where: { id } })

  res.status(200).json({
    success: true,
    message: 'Transaksi berhasil dihapus',
  })
}
