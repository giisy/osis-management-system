import { Response } from 'express'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { prisma } from '../lib/prisma'
import {
  createAgendaSchema,
  updateAgendaSchema,
  upcomingQuerySchema,
} from '../lib/validation/agendaSchema'
import { AuthRequest } from '../middlewares/authMiddleware'

const agendaSelect = {
  id: true,
  judul: true,
  deskripsi: true,
  lokasi: true,
  waktuMulai: true,
  waktuSelesai: true,
  creator: { select: { id: true, name: true } },
  createdAt: true,
  updatedAt: true,
}

export const listAgenda = async (req: AuthRequest, res: Response) => {
  const items = await prisma.agenda.findMany({
    select: agendaSelect,
    orderBy: { waktuMulai: 'asc' },
  })

  res.status(200).json({
    success: true,
    data: items,
  })
}

export const getUpcomingAgenda = async (req: AuthRequest, res: Response) => {
  const parsed = upcomingQuerySchema.safeParse(req.query)

  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: 'Validasi gagal',
      errors: parsed.error.issues,
    })
  }

  const now = new Date()

  const items = await prisma.agenda.findMany({
    where: {
      OR: [{ waktuMulai: { gte: now } }, { waktuSelesai: { gte: now } }],
    },
    select: agendaSelect,
    orderBy: { waktuMulai: 'asc' },
    take: parsed.data.limit,
  })

  res.status(200).json({
    success: true,
    data: items,
  })
}

export const getAgenda = async (req: AuthRequest, res: Response) => {
  const { id } = req.params as { id: string }

  const agenda = await prisma.agenda.findUnique({
    where: { id },
    select: agendaSelect,
  })

  if (!agenda) {
    return res.status(404).json({
      success: false,
      message: 'Agenda tidak ditemukan',
    })
  }

  res.status(200).json({
    success: true,
    data: agenda,
  })
}

export const createAgenda = async (req: AuthRequest, res: Response) => {
  const parsed = createAgendaSchema.safeParse(req.body)

  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: 'Validasi gagal',
      errors: parsed.error.issues,
    })
  }

  const { judul, deskripsi, lokasi, waktuMulai, waktuSelesai } = parsed.data

  try {
    const agenda = await prisma.agenda.create({
      data: {
        judul,
        deskripsi,
        lokasi,
        waktuMulai,
        waktuSelesai,
        createdBy: req.user!.userId,
      },
      select: agendaSelect,
    })

    res.status(201).json({
      success: true,
      message: 'Agenda berhasil ditambahkan',
      data: agenda,
    })
  } catch (error) {
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === 'P2003'
    ) {
      return res.status(404).json({
        success: false,
        message: 'User pembuat agenda tidak ditemukan',
      })
    }
    throw error
  }
}

export const updateAgenda = async (req: AuthRequest, res: Response) => {
  const { id } = req.params as { id: string }

  const parsed = updateAgendaSchema.safeParse(req.body)

  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: 'Validasi gagal',
      errors: parsed.error.issues,
    })
  }

  const existingAgenda = await prisma.agenda.findUnique({ where: { id } })

  if (!existingAgenda) {
    return res.status(404).json({
      success: false,
      message: 'Agenda tidak ditemukan',
    })
  }

  const waktuMulai =
    parsed.data.waktuMulai !== undefined
      ? parsed.data.waktuMulai
      : existingAgenda.waktuMulai
  const waktuSelesai =
    parsed.data.waktuSelesai === undefined
      ? existingAgenda.waktuSelesai
      : parsed.data.waktuSelesai

  if (waktuSelesai && waktuSelesai <= waktuMulai) {
    return res.status(400).json({
      success: false,
      message: 'Validasi gagal',
      errors: [
        {
          path: ['waktuSelesai'],
          message: 'Waktu selesai harus setelah waktu mulai',
        },
      ],
    })
  }

  try {
    const agenda = await prisma.agenda.update({
      where: { id },
      data: parsed.data,
      select: agendaSelect,
    })

    res.status(200).json({
      success: true,
      message: 'Data agenda berhasil diperbarui',
      data: agenda,
    })
  } catch (error) {
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === 'P2003'
    ) {
      return res.status(404).json({
        success: false,
        message: 'User pembuat agenda tidak ditemukan',
      })
    }
    throw error
  }
}

export const deleteAgenda = async (req: AuthRequest, res: Response) => {
  const { id } = req.params as { id: string }

  const existingAgenda = await prisma.agenda.findUnique({ where: { id } })

  if (!existingAgenda) {
    return res.status(404).json({
      success: false,
      message: 'Agenda tidak ditemukan',
    })
  }

  await prisma.agenda.delete({ where: { id } })

  res.status(200).json({
    success: true,
    message: 'Agenda berhasil dihapus',
  })
}
