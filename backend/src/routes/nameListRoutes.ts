import { Router } from 'express';
import { NameListController } from '../controllers/nameListController';
import { authenticateToken, requirePortariaOrAdmin } from '../middleware/auth';

const router = Router();

// ROTA PÚBLICA - Enviar múltiplos nomes para um evento (página inicial)
// POST /api/name-lists/submit
router.post('/submit', NameListController.submitNames);

// ROTAS PROTEGIDAS - Requerem autenticação

// Listar nomes de um evento
// GET /api/name-lists/event/:event_id
router.get('/event/:event_id', authenticateToken, requirePortariaOrAdmin, NameListController.getEventNames);

// Fazer check-in de um participante
// PUT /api/name-lists/:name_list_id/checkin
router.put('/:name_list_id/checkin', authenticateToken, requirePortariaOrAdmin, NameListController.checkinParticipant);

// Adicionar nome individual (para portaria)
// POST /api/name-lists/event/:event_id/add
router.post('/event/:event_id/add', authenticateToken, requirePortariaOrAdmin, NameListController.addSingleName);

// Buscar participante por nome (para check-in rápido)
// GET /api/name-lists/event/:event_id/search
router.get('/event/:event_id/search', authenticateToken, requirePortariaOrAdmin, NameListController.searchParticipant);

export default router; 