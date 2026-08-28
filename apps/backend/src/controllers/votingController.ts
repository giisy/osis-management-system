import { Response } from 'express'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { prisma } from '../lib/prisma'
import {
  createVotingSchema,
  updateVotingSchema,
  voteSchema,
} from '../lib/validation/votingSchema'
import { AuthRequest } from '../middlewares/authMiddleware'

const sessionSelect = {
  id: true,
  judul: true,
  deskripsi: true,
  status: true,
  ditutupPada: true,
  creator: { select: { id: true, name: true } },
  createdAt: true,
  updatedAt: true,
}

export const listVoting = async (req: AuthRequest, res: Response) => {
  const items = await prisma.votingSession.findMany({
    select: {
      ...sessionSelect,
      _count: { select: { pilihan: true, suara: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  res.status(200).json({
    success: true,
    data: items.map(({ _count, ...session }) => ({
      ...session,
      jumlahPilihan: _count.pilihan,
      totalSuara: _count.suara,
    })),
  })
}

export const getVoting = async (req: AuthRequest, res: Response) => {
  const { id } = req.params as { id: string }

  const session = await prisma.votingSession.findUnique({
    where: { id },
    select: {
      ...sessionSelect,
      pilihan: {
        select: {
          id: true,
          teks: true,
          urutan: true,
          _count: { select: { suara: true } },
        },
        orderBy: { urutan: 'asc' },
      },
      suara: { where: { userId: req.user!.userId }, select: { id: true } },
    },
  })

  if (!session) {
    return res.status(404).json({
      success: false,
      message: 'Sesi voting tidak ditemukan',
    })
  }

  const sudahVoting = session.suara.length > 0
  const { suara, pilihan, ...metadata } = session

  res.status(200).json({
    success: true,
    data: {
      ...metadata,
      sudahVoting,
      totalSuara: pilihan.reduce((sum, p) => sum + p._count.suara, 0),
      pilihan:
        session.status === 'DITUTUP'
          ? pilihan.map(({ _count, ...p }) => ({ ...p, jumlah: _count.suara }))
          : pilihan.map(({ _count, ...p }) => p),
    },
  })
}

export const createVoting = async (req: AuthRequest, res: Response) => {
  const parsed = createVotingSchema.safeParse(req.body)

  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: 'Validasi gagal',
      errors: parsed.error.issues,
    })
  }

  const { judul, deskripsi, pilihan } = parsed.data

  try {
    const session = await prisma.votingSession.create({
      data: {
        judul,
        deskripsi,
        createdBy: req.user!.userId,
        pilihan: {
          create: pilihan.map((teks, index) => ({ teks, urutan: index })),
        },
      },
      select: {
        ...sessionSelect,
        pilihan: {
          select: { id: true, teks: true, urutan: true },
          orderBy: { urutan: 'asc' },
        },
      },
    })

    res.status(201).json({
      success: true,
      message: 'Sesi voting berhasil dibuat',
      data: session,
    })
  } catch (error) {
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === 'P2003'
    ) {
      return res.status(404).json({
        success: false,
        message: 'User pembuat voting tidak ditemukan',
      })
    }
    throw error
  }
}

export const updateVoting = async (req: AuthRequest, res: Response) => {
  const { id } = req.params as { id: string }

  const parsed = updateVotingSchema.safeParse(req.body)

  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: 'Validasi gagal',
      errors: parsed.error.issues,
    })
  }

  const existingSession = await prisma.votingSession.findUnique({
    where: { id },
    select: { id: true, _count: { select: { suara: true } } },
  })

  if (!existingSession) {
    return res.status(404).json({
      success: false,
      message: 'Sesi voting tidak ditemukan',
    })
  }

  if (parsed.data.pilihan && existingSession._count.suara > 0) {
    return res.status(409).json({
      success: false,
      message: 'Pilihan tidak bisa diubah karena sudah ada suara masuk',
    })
  }

  const { pilihan, ...data } = parsed.data

  try {
    const session = await prisma.$transaction(async (tx) => {
      if (pilihan) {
        await tx.pilihan.deleteMany({ where: { sessionId: id } })
      }
      return tx.votingSession.update({
        where: { id },
        data: {
          ...data,
          ...(pilihan
            ? {
                pilihan: {
                  create: pilihan.map((teks, index) => ({ teks, urutan: index })),
                },
              }
            : {}),
        },
        select: {
          ...sessionSelect,
          pilihan: {
            select: { id: true, teks: true, urutan: true },
            orderBy: { urutan: 'asc' },
          },
        },
      })
    })

    res.status(200).json({
      success: true,
      message: 'Data voting berhasil diperbarui',
      data: session,
    })
  } catch (error) {
    throw error
  }
}

export const deleteVoting = async (req: AuthRequest, res: Response) => {
  const { id } = req.params as { id: string }

  const existingSession = await prisma.votingSession.findUnique({
    where: { id },
  })

  if (!existingSession) {
    return res.status(404).json({
      success: false,
      message: 'Sesi voting tidak ditemukan',
    })
  }

  await prisma.votingSession.delete({ where: { id } })

  res.status(200).json({
    success: true,
    message: 'Sesi voting berhasil dihapus',
  })
}

export const tutupVoting = async (req: AuthRequest, res: Response) => {
  const { id } = req.params as { id: string }

  const existingSession = await prisma.votingSession.findUnique({
    where: { id },
  })

  if (!existingSession) {
    return res.status(404).json({
      success: false,
      message: 'Sesi voting tidak ditemukan',
    })
  }

  if (existingSession.status === 'DITUTUP') {
    return res.status(409).json({
      success: false,
      message: 'Voting ini sudah ditutup',
    })
  }

  const session = await prisma.votingSession.update({
    where: { id },
    data: { status: 'DITUTUP', ditutupPada: new Date() },
    select: sessionSelect,
  })

  res.status(200).json({
    success: true,
    message: 'Voting berhasil ditutup',
    data: session,
  })
}

export const bukaVoting = async (req: AuthRequest, res: Response) => {
  const { id } = req.params as { id: string }

  const existingSession = await prisma.votingSession.findUnique({
    where: { id },
  })

  if (!existingSession) {
    return res.status(404).json({
      success: false,
      message: 'Sesi voting tidak ditemukan',
    })
  }

  if (existingSession.status === 'TERBUKA') {
    return res.status(409).json({
      success: false,
      message: 'Voting ini masih terbuka',
    })
  }

  const session = await prisma.votingSession.update({
    where: { id },
    data: { status: 'TERBUKA' },
    select: sessionSelect,
  })

  res.status(200).json({
    success: true,
    message: 'Voting berhasil dibuka kembali',
    data: session,
  })
}

export const submitVote = async (req: AuthRequest, res: Response) => {
  const { id } = req.params as { id: string }

  const parsed = voteSchema.safeParse(req.body)

  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: 'Validasi gagal',
      errors: parsed.error.issues,
    })
  }

  const { pilihanId } = parsed.data

  const session = await prisma.votingSession.findUnique({ where: { id } })

  if (!session) {
    return res.status(404).json({
      success: false,
      message: 'Sesi voting tidak ditemukan',
    })
  }

  if (session.status === 'DITUTUP') {
    return res.status(400).json({
      success: false,
      message: 'Voting sudah ditutup',
    })
  }

  const pilihan = await prisma.pilihan.findFirst({
    where: { id: pilihanId, sessionId: id },
  })

  if (!pilihan) {
    return res.status(400).json({
      success: false,
      message: 'Pilihan tidak valid untuk sesi voting ini',
    })
  }

  const existingVote = await prisma.suara.findUnique({
    where: { sessionId_userId: { sessionId: id, userId: req.user!.userId } },
  })

  if (existingVote) {
    return res.status(409).json({
      success: false,
      message: 'Kamu sudah memberikan suara untuk voting ini',
    })
  }

  try {
    await prisma.suara.create({
      data: {
        sessionId: id,
        userId: req.user!.userId,
        pilihanId,
      },
    })

    res.status(201).json({
      success: true,
      message: 'Suara berhasil diberikan',
      data: { pilihanId, teks: pilihan.teks },
    })
  } catch (error) {
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      return res.status(409).json({
        success: false,
        message: 'Kamu sudah memberikan suara untuk voting ini',
      })
    }
    throw error
  }
}

export const getHasilVoting = async (req: AuthRequest, res: Response) => {
  const { id } = req.params as { id: string }

  const session = await prisma.votingSession.findUnique({
    where: { id },
    select: {
      id: true,
      judul: true,
      status: true,
      ditutupPada: true,
      pilihan: {
        select: {
          id: true,
          teks: true,
          urutan: true,
          _count: { select: { suara: true } },
        },
      },
    },
  })

  if (!session) {
    return res.status(404).json({
      success: false,
      message: 'Sesi voting tidak ditemukan',
    })
  }

  if (session.status !== 'DITUTUP') {
    return res.status(400).json({
      success: false,
      message: 'Hasil belum bisa dilihat — voting masih terbuka',
    })
  }

  const hasil = session.pilihan
    .map(({ _count, ...p }) => ({ ...p, jumlah: _count.suara }))
    .sort((a, b) => b.jumlah - a.jumlah)
  const totalSuara = hasil.reduce((sum, h) => sum + h.jumlah, 0)

  res.status(200).json({
    success: true,
    data: {
      id: session.id,
      judul: session.judul,
      status: session.status,
      ditutupPada: session.ditutupPada,
      totalSuara,
      hasil,
    },
  })
}
