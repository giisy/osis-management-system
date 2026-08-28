import { Router } from 'express'
import {
  listVoting,
  getVoting,
  createVoting,
  updateVoting,
  deleteVoting,
  tutupVoting,
  bukaVoting,
  submitVote,
  getHasilVoting,
} from '../controllers/votingController'
import { authenticate, authorize } from '../middlewares/authMiddleware'

const router = Router()

router.get('/', authenticate, listVoting)
router.get('/:id/hasil', authenticate, getHasilVoting)
router.get('/:id', authenticate, getVoting)
router.post('/', authenticate, authorize('SUPER_ADMIN', 'ADMIN', 'KETUA'), createVoting)
router.post('/:id/vote', authenticate, submitVote)
router.post('/:id/tutup', authenticate, authorize('SUPER_ADMIN', 'ADMIN', 'KETUA'), tutupVoting)
router.post('/:id/buka', authenticate, authorize('SUPER_ADMIN', 'ADMIN', 'KETUA'), bukaVoting)
router.put('/:id', authenticate, authorize('SUPER_ADMIN', 'ADMIN', 'KETUA'), updateVoting)
router.delete('/:id', authenticate, authorize('SUPER_ADMIN', 'ADMIN'), deleteVoting)

export default router
