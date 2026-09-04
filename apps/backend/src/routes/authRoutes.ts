import { Router } from 'express'
import { register, login, me } from '../controllers/authController'
import { authenticate } from '../middlewares/authMiddleware'
import { loginLimiter, registerLimiter } from '../middlewares/rateLimit'

const router = Router()

router.post('/register', registerLimiter, register)
router.post('/login', loginLimiter, login)
router.get('/me', authenticate, me)

export default router