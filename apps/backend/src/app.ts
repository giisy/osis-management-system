import express, { ErrorRequestHandler } from 'express'
import cors from 'cors'
import authRoutes from './routes/authRoutes'
import dashboardRoutes from './routes/dashboardRoutes'
import anggotaRoutes from './routes/anggotaRoutes'
import divisiRoutes from './routes/divisiRoutes'
import agendaRoutes from './routes/agendaRoutes'
import pengumumanRoutes from './routes/pengumumanRoutes'
import absensiRoutes from './routes/absensiRoutes'
import kasRoutes from './routes/kasRoutes'
import inventarisRoutes from './routes/inventarisRoutes'
import peminjamanRoutes from './routes/peminjamanRoutes'
import votingRoutes from './routes/votingRoutes'

const app = express()

app.set('trust proxy', 1)

const allowedOrigins = [
  'http://localhost:5173',
  process.env.FRONTEND_URL,
].filter(Boolean) as string[]

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}))
app.use(express.json())

app.get('/', (req, res) => {
  res.json({ message: 'OSIS Management System API is running' })
})

app.use('/api/auth', authRoutes)
app.use('/api/dashboard', dashboardRoutes)
app.use('/api/anggota', anggotaRoutes)
app.use('/api/divisi', divisiRoutes)
app.use('/api/agenda', agendaRoutes)
app.use('/api/pengumuman', pengumumanRoutes)
app.use('/api/absensi', absensiRoutes)
app.use('/api/kas', kasRoutes)
app.use('/api/inventaris', inventarisRoutes)
app.use('/api/peminjaman', peminjamanRoutes)
app.use('/api/voting', votingRoutes)

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.error(err)

  if (res.headersSent) {
    return next(err)
  }

  const isProduction = process.env.NODE_ENV === 'production'
  const status =
    typeof err.status === 'number' && err.status >= 400 && err.status < 500
      ? err.status
      : 500

  res.status(status).json({
    success: false,
    message: isProduction
      ? status === 500
        ? 'Terjadi kesalahan server'
        : 'Permintaan tidak valid'
      : err.message || 'Terjadi kesalahan server',
  })
}

app.use(errorHandler)

export default app