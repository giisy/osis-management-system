import { Router } from 'express'
import {
  listBarang,
  getBarang,
  createBarang,
  updateBarang,
  deleteBarang,
} from '../controllers/barangController'
import { authenticate, authorize } from '../middlewares/authMiddleware'

const router = Router()

router.get('/', authenticate, listBarang)
router.get('/:id', authenticate, getBarang)
router.post('/', authenticate, authorize('SUPER_ADMIN', 'ADMIN'), createBarang)
router.put('/:id', authenticate, authorize('SUPER_ADMIN', 'ADMIN'), updateBarang)
router.delete('/:id', authenticate, authorize('SUPER_ADMIN', 'ADMIN'), deleteBarang)

export default router
