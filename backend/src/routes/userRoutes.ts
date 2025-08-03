import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = Router();

// Todas as rotas de usuários requerem autenticação e permissão de admin
router.use(authenticateToken, requireAdmin);

// Listar todos os usuários
// GET /api/users
router.get('/', UserController.getAllUsers);

// Criar novo usuário
// POST /api/users
router.post('/', UserController.createUser);

// Buscar usuário por ID
// GET /api/users/:id
router.get('/:id', UserController.getUserById);

// Atualizar usuário
// PUT /api/users/:id
router.put('/:id', UserController.updateUser);

// Deletar usuário
// DELETE /api/users/:id
router.delete('/:id', UserController.deleteUser);

export default router; 