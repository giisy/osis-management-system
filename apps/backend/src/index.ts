import express from 'express'
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
const PORT = 4000

app.use(cors({
  origin: 'http://localhost:5173',
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

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})