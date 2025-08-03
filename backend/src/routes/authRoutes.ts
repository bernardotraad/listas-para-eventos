import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = Router();

// Login (público)
// POST /api/auth/login
router.post('/login', AuthController.login);

// Verificar token (público)
// GET /api/auth/verify
router.get('/verify', AuthController.verifyToken);

// Registro de usuário (apenas admin)
// POST /api/auth/register
router.post('/register', authenticateToken, requireAdmin, AuthController.register);

export default router; 