import express from 'express'
import authRoutes from './routes/authRoutes'

const app = express()
const PORT = 4000

app.use(express.json())

app.get('/', (req, res) => {
  res.json({ message: 'OSIS Management System API is running' })
})

app.use('/api/auth', authRoutes)

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})