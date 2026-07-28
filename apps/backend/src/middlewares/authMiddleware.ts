import { Request, Response, NextFunction } from 'express'
import { verifyToken, JwtPayload } from '../lib/jwt'

export interface AuthRequest extends Request {
  user?: JwtPayload
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Token tidak ditemukan',
    })
  }

  const token = authHeader.split(' ')[1]

  try {
    const payload = verifyToken(token)
    req.user = payload
    next()
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token tidak valid atau sudah kadaluarsa',
    })
  }
}

export const authorize = (...allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Kamu tidak punya akses untuk aksi ini',
      })
    }
    next()
  }
}