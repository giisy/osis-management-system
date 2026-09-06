import { Router } from 'express'
import {
  listTransaksi,
  getLaporanKas,
  getTransaksi,
  createTransaksi,
  updateTransaksi,
  deleteTransaksi,
} from '../controllers/kasController'
import { authenticate, authorize } from '../middlewares/authMiddleware'

const router = Router()

router.get('/', authenticate, listTransaksi)
router.get('/laporan', authenticate, getLaporanKas)
router.get('/:id', authenticate, getTransaksi)
router.post('/', authenticate, authorize('BENDAHARA'), createTransaksi)
router.put('/:id', authenticate, authorize('BENDAHARA'), updateTransaksi)
router.delete('/:id', authenticate, authorize('SUPER_ADMIN'), deleteTransaksi)

export default router
