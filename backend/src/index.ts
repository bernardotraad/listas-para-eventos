import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import routes from './routes';

// Carregar variáveis de ambiente
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Configurações de segurança
app.use(helmet());

// Configuração do CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting para prevenir spam
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Máximo 100 requisições por IP por janela
  message: {
    success: false,
    error: 'Muitas requisições. Tente novamente em alguns minutos.'
  }
});
app.use(limiter);

// Rate limiting específico para envio de nomes (mais restritivo)
const nameSubmissionLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 5, // Máximo 5 envios por IP por minuto
  message: {
    success: false,
    error: 'Muitos envios. Aguarde um minuto antes de tentar novamente.'
  }
});

// Middleware para parsing de JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging de requisições
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Rotas da API
app.use('/api', routes);

// Rota de teste
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API de Listas para Eventos funcionando!',
    version: '1.0.0',
    endpoints: {
      public: {
        'GET /api/events/active': 'Listar eventos ativos',
        'GET /api/events/:id': 'Buscar evento por ID',
        'POST /api/name-lists/submit': 'Enviar múltiplos nomes para evento',
        'POST /api/auth/login': 'Login de usuário',
        'GET /api/auth/verify': 'Verificar token'
      },
      protected: {
        'GET /api/events': 'Listar todos os eventos (admin/portaria)',
        'POST /api/events': 'Criar evento (admin/portaria)',
        'PUT /api/events/:id': 'Atualizar evento (admin/portaria)',
        'DELETE /api/events/:id': 'Deletar evento (admin)',
        'GET /api/name-lists/event/:id': 'Listar nomes do evento (admin/portaria)',
        'PUT /api/name-lists/:id/checkin': 'Fazer check-in (admin/portaria)',
        'POST /api/name-lists/event/:id/add': 'Adicionar nome (admin/portaria)',
        'GET /api/users': 'Listar usuários (admin)',
        'POST /api/auth/register': 'Registrar usuário (admin)'
      }
    }
  });
});

// Middleware de tratamento de erros
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Erro não tratado:', err);
  res.status(500).json({
    success: false,
    error: 'Erro interno do servidor'
  });
});

// Middleware para rotas não encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Rota não encontrada'
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📚 Documentação: http://localhost:${PORT}/`);
});

export default app; 