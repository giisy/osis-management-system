import { Router } from 'express'
import {
  listPeminjaman,
  getPeminjaman,
  createPeminjaman,
  kembalikanPeminjaman,
} from '../controllers/peminjamanController'
import { authenticate, authorize } from '../middlewares/authMiddleware'

const router = Router()

router.get('/', authenticate, listPeminjaman)
router.get('/:id', authenticate, getPeminjaman)
router.post('/', authenticate, createPeminjaman)
router.post('/:id/kembalikan', authenticate, kembalikanPeminjaman)

export default router
