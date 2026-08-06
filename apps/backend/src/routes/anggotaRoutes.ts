import { Router } from 'express'
import {
  listAnggota,
  getAnggota,
  createAnggota,
  updateAnggota,
  deleteAnggota,
} from '../controllers/anggotaController'
import { authenticate, authorize } from '../middlewares/authMiddleware'

const router = Router()

router.get('/', authenticate, authorize('ADMIN', 'KETUA'), listAnggota)
router.get('/:id', authenticate, authorize('ADMIN', 'KETUA'), getAnggota)
router.post('/', authenticate, authorize('SUPER_ADMIN', 'ADMIN'), createAnggota)
router.put('/:id', authenticate, authorize('SUPER_ADMIN', 'ADMIN'), updateAnggota)
router.delete('/:id', authenticate, authorize('SUPER_ADMIN', 'ADMIN'), deleteAnggota)

export default router
