import { Router } from 'express'
import {
  listPengumuman,
  getPengumuman,
  createPengumuman,
  updatePengumuman,
  deletePengumuman,
} from '../controllers/pengumumanController'
import { authenticate, authorize } from '../middlewares/authMiddleware'

const router = Router()

router.get('/', authenticate, listPengumuman)
router.get('/:id', authenticate, getPengumuman)
router.post('/', authenticate, authorize('SUPER_ADMIN', 'ADMIN', 'SEKRETARIS'), createPengumuman)
router.put('/:id', authenticate, authorize('SUPER_ADMIN', 'ADMIN', 'SEKRETARIS'), updatePengumuman)
router.delete('/:id', authenticate, authorize('SUPER_ADMIN', 'ADMIN'), deletePengumuman)

export default router
