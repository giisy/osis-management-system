import { Response } from 'express'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { prisma } from '../lib/prisma'
import { tandaiAbsensiSchema } from '../lib/validation/absensiSchema'
import { AuthRequest } from '../middlewares/authMiddleware'

const absensiSayaSelect = {
  id: true,
  status: true,
  waktuCheckIn: true,
  agenda: {
    select: { id: true, judul: true, lokasi: true, waktuMulai: true, waktuSelesai: true },
  },
  createdAt: true,
}

const absensiAgendaSelect = {
  id: true,
  user: { select: { id: true, name: true, role: true, kelas: true } },
  status: true,
  waktuCheckIn: true,
  createdAt: true,
}

export const checkinAbsensi = async (req: AuthRequest, res: Response) => {
  const { agendaId } = req.params as { agendaId: string }

  const agenda = await prisma.agenda.findUnique({ where: { id: agendaId } })

  if (!agenda) {
    return res.status(404).json({
      success: false,
      message: 'Agenda tidak ditemukan',
    })
  }

  if (agenda.waktuMulai > new Date()) {
    return res.status(400).json({
      success: false,
      message: 'Check-in belum dibuka — agenda belum dimulai',
    })
  }

  const existing = await prisma.absensi.findUnique({
    where: { agendaId_userId: { agendaId, userId: req.user!.userId } },
  })

  if (existing) {
    return res.status(409).json({
      success: false,
      message: 'Kamu sudah check-in untuk agenda ini',
    })
  }

  try {
    const absensi = await prisma.absensi.create({
      data: {
        agendaId,
        userId: req.user!.userId,
        status: 'HADIR',
      },
      select: absensiSayaSelect,
    })

    res.status(201).json({
      success: true,
      message: 'Check-in berhasil',
      data: absensi,
    })
  } catch (error) {
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      return res.status(409).json({
        success: false,
        message: 'Kamu sudah check-in untuk agenda ini',
      })
    }
    throw error
  }
}

export const getAbsensiSaya = async (req: AuthRequest, res: Response) => {
  const items = await prisma.absensi.findMany({
    where: { userId: req.user!.userId },
    select: absensiSayaSelect,
    orderBy: { agenda: { waktuMulai: 'desc' } },
  })

  res.status(200).json({
    success: true,
    data: items,
  })
}

export const getAbsensiAgenda = async (req: AuthRequest, res: Response) => {
  const { agendaId } = req.params as { agendaId: string }

  const agenda = await prisma.agenda.findUnique({
    where: { id: agendaId },
    select: { id: true, judul: true, lokasi: true, waktuMulai: true, waktuSelesai: true },
  })

  if (!agenda) {
    return res.status(404).json({
      success: false,
      message: 'Agenda tidak ditemukan',
    })
  }

  const [items, rekap] = await Promise.all([
    prisma.absensi.findMany({
      where: { agendaId },
      select: absensiAgendaSelect,
      orderBy: { waktuCheckIn: 'asc' },
    }),
    prisma.absensi.groupBy({
      by: ['status'],
      where: { agendaId },
      _count: { _all: true },
    }),
  ])

  res.status(200).json({
    success: true,
    data: {
      agenda,
      rekap: {
        hadir: rekap.find((r) => r.status === 'HADIR')?._count._all ?? 0,
        izin: rekap.find((r) => r.status === 'IZIN')?._count._all ?? 0,
        alfa: rekap.find((r) => r.status === 'ALFA')?._count._all ?? 0,
        totalTercatat: items.length,
      },
      items,
    },
  })
}

export const tandaiAbsensi = async (req: AuthRequest, res: Response) => {
  const { agendaId } = req.params as { agendaId: string }

  const parsed = tandaiAbsensiSchema.safeParse(req.body)

  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: 'Validasi gagal',
      errors: parsed.error.issues,
    })
  }

  const { userId, status } = parsed.data

  const agenda = await prisma.agenda.findUnique({ where: { id: agendaId } })

  if (!agenda) {
    return res.status(404).json({
      success: false,
      message: 'Agenda tidak ditemukan',
    })
  }

  try {
    const absensi = await prisma.absensi.upsert({
      where: { agendaId_userId: { agendaId, userId } },
      create: { agendaId, userId, status },
      update: { status },
      select: absensiAgendaSelect,
    })

    res.status(200).json({
      success: true,
      message: 'Kehadiran berhasil ditandai',
      data: absensi,
    })
  } catch (error) {
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === 'P2003'
    ) {
      return res.status(404).json({
        success: false,
        message: 'User tidak ditemukan',
      })
    }
    throw error
  }
}
