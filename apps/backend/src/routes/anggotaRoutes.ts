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

router.get('/', authenticate, authorize('SUPER_ADMIN', 'ADMIN', 'SEKRETARIS', 'BENDAHARA', 'KOORDINATOR_DIVISI', 'PEMBINA'), listAnggota)
router.get('/:id', authenticate, authorize('SUPER_ADMIN', 'ADMIN', 'SEKRETARIS', 'BENDAHARA', 'KOORDINATOR_DIVISI', 'PEMBINA'), getAnggota)
router.post('/', authenticate, authorize('SUPER_ADMIN', 'ADMIN'), createAnggota)
router.put('/:id', authenticate, authorize('SUPER_ADMIN', 'ADMIN'), updateAnggota)
router.delete('/:id', authenticate, authorize('SUPER_ADMIN', 'ADMIN'), deleteAnggota)

export default router
