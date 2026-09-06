import { Router } from 'express'
import {
  checkinAbsensi,
  getAbsensiSaya,
  getAbsensiAgenda,
  tandaiAbsensi,
} from '../controllers/absensiController'
import { authenticate, authorize } from '../middlewares/authMiddleware'

const router = Router()

router.get('/saya', authenticate, getAbsensiSaya)
router.get(
  '/agenda/:agendaId',
  authenticate,
  authorize('SUPER_ADMIN', 'ADMIN', 'SEKRETARIS', 'KOORDINATOR_DIVISI', 'PEMBINA'),
  getAbsensiAgenda,
)
router.post('/:agendaId/checkin', authenticate, checkinAbsensi)
router.post(
  '/:agendaId/tandai',
  authenticate,
  authorize('SUPER_ADMIN', 'ADMIN', 'SEKRETARIS', 'KOORDINATOR_DIVISI'),
  tandaiAbsensi,
)

export default router
