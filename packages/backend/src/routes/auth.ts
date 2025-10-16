import { Router, Response } from 'express';
import { AuthService } from '../services/authService';
import { asyncHandler } from '../middleware/errorHandler';
import { validateBody } from '../middleware/validation';
import { registerSchema, loginSchema } from '@finance-platform/shared';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

// POST /api/auth/register
router.post(
  '/register',
  validateBody(registerSchema),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const result = await AuthService.register(req.body);
    res.status(201).json(result);
  })
);

// POST /api/auth/login
router.post(
  '/login',
  validateBody(loginSchema),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const result = await AuthService.login(req.body);
    res.json(result);
  })
);

// GET /api/auth/me
router.get(
  '/me',
  authenticate,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const user = await AuthService.getUserById(req.user!.userId);
    res.json({ user });
  })
);

// POST /api/auth/logout
router.post('/logout', authenticate, (req: AuthRequest, res: Response) => {
  // In a stateless JWT setup, logout is handled client-side
  // Future: implement token blacklisting if needed
  res.json({ success: true });
});

export default router;
