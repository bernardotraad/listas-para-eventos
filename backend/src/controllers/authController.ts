import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createClient } from '@supabase/supabase-js';
import { LoginDto, CreateUserDto, AuthResponse, ApiResponse } from '../types';

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

// Controlador de autenticação
export class AuthController {
  // Login de usuário
  static async login(req: Request, res: Response) {
    try {
      const { username, password }: LoginDto = req.body;

      // Validação básica
      if (!username || !password) {
        return res.status(400).json({
          success: false,
          error: 'Username e senha são obrigatórios'
        });
      }

      // Buscar usuário no banco usando Supabase com service role key
      console.log('🔍 Buscando usuário:', username);
      
      const supabase = getAuthSupabase();
      
      // Primeiro, vamos verificar se a tabela users existe e tem dados
      console.log('📋 Verificando tabela users...');
      const { data: allUsers, error: allUsersError } = await supabase
        .from('users')
        .select('username, email, role');
      console.log('👥 Todos os usuários:', allUsers);
      console.log('❌ Erro ao buscar todos:', allUsersError);
      
      // Agora buscar o usuário específico
      const { data: users, error } = await supabase
        .from('users')
        .select('id, username, email, password_hash, role, full_name, is_active, created_at, updated_at')
        .eq('username', username)
        .single();

      console.log('📊 Resultado da busca específica:', { users, error });

      if (error || !users) {
        console.log('❌ Usuário não encontrado ou erro:', error);
        return res.status(401).json({
          success: false,
          error: 'Credenciais inválidas'
        });
      }

      // Verificar se o usuário está ativo
      if (!users.is_active) {
        return res.status(401).json({
          success: false,
          error: 'Usuário inativo'
        });
      }

      // Verificar senha
      console.log('🔐 Verificando senha...');
      const isValidPassword = await bcrypt.compare(password, users.password_hash);
      console.log('✅ Senha válida?', isValidPassword);
      
      if (!isValidPassword) {
        console.log('❌ Senha inválida');
        return res.status(401).json({
          success: false,
          error: 'Credenciais inválidas'
        });
      }

      // Gerar token JWT
      const token = jwt.sign(
        { userId: users.id },
        process.env.JWT_SECRET!,
        { expiresIn: '24h' }
      );

      console.log('🔐 Token gerado:', token.substring(0, 20) + '...');
      console.log('🔐 JWT_SECRET configurado:', !!process.env.JWT_SECRET);

      // Remover password_hash da resposta
      const { password_hash, ...userWithoutPassword } = users;

      const response: ApiResponse<AuthResponse> = {
        success: true,
        data: {
          token,
          user: userWithoutPassword
        },
        message: 'Login realizado com sucesso'
      };

      console.log('📤 Enviando resposta de login...');
      res.json(response);
    } catch (error) {
      console.error('Erro no login:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  }

  // Registro de novo usuário (apenas admin pode criar)
  static async register(req: Request, res: Response) {
    try {
      const { username, email, password, role, full_name }: CreateUserDto = req.body;

      // Validação básica
      if (!username || !email || !password || !role || !full_name) {
        return res.status(400).json({
          success: false,
          error: 'Todos os campos são obrigatórios'
        });
      }

      // Verificar se username já existe
      const supabase = getAuthSupabase();
      const { data: existingUsers } = await supabase
        .from('users')
        .select('id')
        .or(`username.eq.${username},email.eq.${email}`);

      if (existingUsers && existingUsers.length > 0) {
        return res.status(400).json({
          success: false,
          error: 'Username ou email já existe'
        });
      }

      // Hash da senha
      const saltRounds = 12;
      const passwordHash = await bcrypt.hash(password, saltRounds);

      // Inserir novo usuário
      const { data: newUser, error } = await supabase
        .from('users')
        .insert({
          username,
          email,
          password_hash: passwordHash,
          role,
          full_name
        })
        .select('id, username, email, role, full_name, is_active, created_at, updated_at')
        .single();

      if (error) {
        console.error('Erro ao inserir usuário:', error);
        return res.status(500).json({
          success: false,
          error: 'Erro ao criar usuário'
        });
      }

      const response: ApiResponse<typeof newUser> = {
        success: true,
        data: newUser,
        message: 'Usuário criado com sucesso'
      };

      res.status(201).json(response);
    } catch (error) {
      console.error('Erro no registro:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  }

  // Verificar token atual
  static async verifyToken(req: Request, res: Response) {
    try {
      const authHeader = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1];

      console.log('🔍 Verificando token...');
      console.log('📋 Auth header:', authHeader);
      console.log('🎫 Token:', token ? `${token.substring(0, 20)}...` : 'null');
      console.log('🎫 Token completo:', token);

      if (!token) {
        console.log('❌ Token não fornecido');
        return res.status(401).json({
          success: false,
          error: 'Token não fornecido'
        });
      }

      // Verificar se o token tem o formato correto (3 partes separadas por pontos)
      const tokenParts = token.split('.');
      console.log('🔍 Partes do token:', tokenParts.length);
      if (tokenParts.length !== 3) {
        console.log('❌ Token malformado - não tem 3 partes');
        return res.status(401).json({
          success: false,
          error: 'Token malformado'
        });
      }

      console.log('🔐 JWT_SECRET configurado:', !!process.env.JWT_SECRET);
      console.log('🔐 JWT_SECRET length:', process.env.JWT_SECRET?.length);
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number };
      console.log('✅ Token decodificado:', decoded);
      
      const supabase = getAuthSupabase();
      const { data: user, error } = await supabase
        .from('users')
        .select('id, username, email, role, full_name, is_active, created_at, updated_at')
        .eq('id', decoded.userId)
        .eq('is_active', true)
        .single();

      console.log('👤 Usuário encontrado:', user);
      console.log('❌ Erro na busca:', error);

      if (error || !user) {
        console.log('❌ Usuário não encontrado ou erro');
        return res.status(401).json({
          success: false,
          error: 'Token inválido'
        });
      }

      console.log('✅ Token válido para usuário:', user.username);

      const response: ApiResponse<typeof user> = {
        success: true,
        data: user,
        message: 'Token válido'
      };

      res.json(response);
    } catch (error) {
      console.error('❌ Erro na verificação do token:', error);
      res.status(401).json({
        success: false,
        error: 'Token inválido'
      });
    }
  }
} 