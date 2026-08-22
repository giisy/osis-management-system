import { Router } from 'express'
import {
  listAgenda,
  getUpcomingAgenda,
  getAgenda,
  createAgenda,
  updateAgenda,
  deleteAgenda,
} from '../controllers/agendaController'
import { authenticate, authorize } from '../middlewares/authMiddleware'

const router = Router()

router.get('/', authenticate, listAgenda)
router.get('/upcoming', authenticate, getUpcomingAgenda)
router.get('/:id', authenticate, getAgenda)
router.post('/', authenticate, authorize('SUPER_ADMIN', 'ADMIN', 'KETUA'), createAgenda)
router.put('/:id', authenticate, authorize('SUPER_ADMIN', 'ADMIN', 'KETUA'), updateAgenda)
router.delete('/:id', authenticate, authorize('SUPER_ADMIN', 'ADMIN'), deleteAgenda)

export default router
