import { Router } from 'express'
import {
  listDivisi,
  getDivisi,
  createDivisi,
  updateDivisi,
  deleteDivisi,
} from '../controllers/divisiController'
import { authenticate, authorize } from '../middlewares/authMiddleware'

const router = Router()

router.get('/', authenticate, listDivisi)
router.get('/:id', authenticate, getDivisi)
router.post('/', authenticate, authorize('SUPER_ADMIN', 'ADMIN'), createDivisi)
router.put('/:id', authenticate, authorize('SUPER_ADMIN', 'ADMIN'), updateDivisi)
router.delete('/:id', authenticate, authorize('SUPER_ADMIN', 'ADMIN'), deleteDivisi)

export default router
