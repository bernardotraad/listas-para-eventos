import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { from } from '../config/database';
import { LoginDto, CreateUserDto, AuthResponse, ApiResponse } from '../types';

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

      // Buscar usuário no banco usando Supabase
      const { data: users, error } = await from('users')
        .select('id, username, email, password_hash, role, full_name, is_active, created_at, updated_at')
        .eq('username', username)
        .single();

      if (error || !users) {
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
      const isValidPassword = await bcrypt.compare(password, users.password_hash);
      if (!isValidPassword) {
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
      const { data: existingUsers } = await from('users')
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
      const { data: newUser, error } = await from('users')
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

      if (!token) {
        return res.status(401).json({
          success: false,
          error: 'Token não fornecido'
        });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number };
      
      const { data: user, error } = await from('users')
        .select('id, username, email, role, full_name, is_active, created_at, updated_at')
        .eq('id', decoded.userId)
        .eq('is_active', true)
        .single();

      if (error || !user) {
        return res.status(401).json({
          success: false,
          error: 'Token inválido'
        });
      }

      const response: ApiResponse<typeof user> = {
        success: true,
        data: user,
        message: 'Token válido'
      };

      res.json(response);
    } catch (error) {
      console.error('Erro na verificação do token:', error);
      res.status(401).json({
        success: false,
        error: 'Token inválido'
      });
    }
  }
} 