import { Router } from 'express';
import authRoutes from './authRoutes';
import eventRoutes from './eventRoutes';
import nameListRoutes from './nameListRoutes';
import userRoutes from './userRoutes';

const router = Router();

// Rotas de autenticação (públicas)
router.use('/auth', authRoutes);

// Rotas de eventos (públicas e protegidas)
router.use('/events', eventRoutes);

// Rotas de listas de nomes (públicas e protegidas)
router.use('/name-lists', nameListRoutes);

// Rotas de usuários (apenas admin)
router.use('/users', userRoutes);

// Rota de health check
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API funcionando corretamente',
    timestamp: new Date().toISOString()
  });
});

export default router; 