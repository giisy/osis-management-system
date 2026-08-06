import { Response } from 'express'
import { prisma } from '../lib/prisma'
import { AuthRequest } from '../middlewares/authMiddleware'

export const getDashboardStats = async (req: AuthRequest, res: Response) => {
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  const [totalAnggota, rawAnggotaPerRole, anggotaBaruBulanIni, anggotaTerbaru, users] =
    await Promise.all([
      prisma.user.count(),
      prisma.user.groupBy({
        by: ['role'],
        _count: { _all: true },
      }),
      prisma.user.count({
        where: { createdAt: { gte: startOfMonth } },
      }),
      prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true,
          name: true,
          role: true,
          createdAt: true,
        },
      }),
      prisma.user.findMany({
        select: { createdAt: true },
        orderBy: { createdAt: 'asc' },
      }),
    ])

  const anggotaPerRole = rawAnggotaPerRole.map((item) => ({
    role: item.role,
    jumlah: item._count._all,
  }))

  const pertumbuhanAnggota = []
  for (let i = 5; i >= 0; i--) {
    const start = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 1)
    const jumlah = users.filter((u) => u.createdAt >= start && u.createdAt < end).length
    pertumbuhanAnggota.push({
      bulan: start.toLocaleDateString('id-ID', { month: 'long' }),
      tahun: start.getFullYear(),
      jumlah,
    })
  }

  res.status(200).json({
    success: true,
    data: {
      totalAnggota,
      anggotaPerRole,
      anggotaBaruBulanIni,
      anggotaTerbaru,
      pertumbuhanAnggota,
    },
  })
}