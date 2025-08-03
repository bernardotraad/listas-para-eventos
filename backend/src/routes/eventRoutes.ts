import { Router } from 'express';
import { EventController } from '../controllers/eventController';
import { authenticateToken, requirePortariaOrAdmin, requireAdmin } from '../middleware/auth';

const router = Router();

// ROTAS PÚBLICAS

// Listar eventos ativos (para página inicial)
// GET /api/events/active
router.get('/active', EventController.getActiveEvents);

// Buscar evento por ID (público)
// GET /api/events/:id
router.get('/:id', EventController.getEventById);

// ROTAS PROTEGIDAS

// Listar todos os eventos (admin/portaria)
// GET /api/events
router.get('/', authenticateToken, requirePortariaOrAdmin, EventController.getAllEvents);

// Criar novo evento (admin/portaria)
// POST /api/events
router.post('/', authenticateToken, requirePortariaOrAdmin, EventController.createEvent);

// Atualizar evento (admin/portaria)
// PUT /api/events/:id
router.put('/:id', authenticateToken, requirePortariaOrAdmin, EventController.updateEvent);

// Deletar evento (apenas admin)
// DELETE /api/events/:id
router.delete('/:id', authenticateToken, requireAdmin, EventController.deleteEvent);

// Obter estatísticas do evento (admin/portaria)
// GET /api/events/:id/stats
router.get('/:id/stats', authenticateToken, requirePortariaOrAdmin, EventController.getEventStats);

export default router; 