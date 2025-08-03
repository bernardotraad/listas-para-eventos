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

// Verificar configuração do ambiente (para debug)
// GET /api/auth/env-check
router.get('/env-check', AuthController.checkEnvironment);

export default router; 