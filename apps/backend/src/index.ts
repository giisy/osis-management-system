import express from 'express'
import cors from 'cors'
import authRoutes from './routes/authRoutes'
import dashboardRoutes from './routes/dashboardRoutes'
import anggotaRoutes from './routes/anggotaRoutes'
import divisiRoutes from './routes/divisiRoutes'

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

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})