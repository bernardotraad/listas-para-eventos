import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { createClient } from '@supabase/supabase-js';
import { AuthenticatedRequest } from '../types';

// Função para obter cliente Supabase com service role key para autenticação
function getAuthSupabase() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const supabaseUrl = process.env.SUPABASE_URL;
  
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY são obrigatórios');
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

// Middleware para verificar token JWT
export const authenticateToken = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    console.log('🔐 Middleware de autenticação - URL:', req.url);
    console.log('🔐 Auth header:', authHeader);
    console.log('🔐 Token:', token ? `${token.substring(0, 20)}...` : 'null');

    if (!token) {
      console.log('❌ Token não fornecido no middleware');
      return res.status(401).json({
        success: false,
        error: 'Token de acesso não fornecido'
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number };
      console.log('✅ Token decodificado no middleware:', decoded);
      
      // Buscar usuário no banco usando service role key
      const supabase = getAuthSupabase();
      const { data: user, error } = await supabase
        .from('users')
        .select('id, username, email, role, full_name, is_active, created_at, updated_at')
        .eq('id', decoded.userId)
        .eq('is_active', true)
        .single();

      console.log('👤 Usuário encontrado no middleware:', user);
      console.log('❌ Erro na busca do middleware:', error);

      if (error || !user) {
        console.log('❌ Usuário não encontrado ou erro no middleware');
        return res.status(401).json({
          success: false,
          error: 'Token inválido ou usuário não encontrado'
        });
      }

      console.log('✅ Usuário autenticado no middleware:', user.username);
      req.user = user;
      next();
    } catch (jwtError) {
      console.error('❌ Erro ao verificar JWT no middleware:', jwtError);
      return res.status(401).json({
        success: false,
        error: 'Token inválido'
      });
    }
  } catch (error) {
    console.error('❌ Erro na autenticação:', error);
    return res.status(401).json({
      success: false,
      error: 'Token inválido'
    });
  }
};

// Middleware para verificar se o usuário é admin
export const requireAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: 'Usuário não autenticado'
    });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      error: 'Acesso negado. Apenas administradores podem realizar esta ação.'
    });
  }

  next();
};

// Middleware para verificar se o usuário é portaria ou admin
export const requirePortariaOrAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: 'Usuário não autenticado'
    });
  }

  if (req.user.role !== 'portaria' && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      error: 'Acesso negado. Apenas portaria ou administradores podem realizar esta ação.'
    });
  }

  next();
}; 