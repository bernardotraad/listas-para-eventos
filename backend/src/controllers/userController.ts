import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { from } from '../config/database';
import { User, ApiResponse } from '../types';

// Controlador de usuários (apenas para administradores)
export class UserController {
  // Listar todos os usuários
  static async getAllUsers(req: Request, res: Response) {
    try {
      const { data: users, error } = await from('users')
        .select('id, username, email, role, full_name, is_active, created_at, updated_at')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar usuários:', error);
        return res.status(500).json({
          success: false,
          error: 'Erro interno do servidor'
        });
      }

      const response: ApiResponse<User[]> = {
        success: true,
        data: users || [],
        message: 'Usuários listados com sucesso'
      };

      res.json(response);
    } catch (error) {
      console.error('Erro ao listar usuários:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  }

  // Buscar usuário por ID
  static async getUserById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const { data: user, error } = await from('users')
        .select('id, username, email, role, full_name, is_active, created_at, updated_at')
        .eq('id', id)
        .single();

      if (error || !user) {
        return res.status(404).json({
          success: false,
          error: 'Usuário não encontrado'
        });
      }

      const response: ApiResponse<User> = {
        success: true,
        data: user,
        message: 'Usuário encontrado com sucesso'
      };

      res.json(response);
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  }

  // Atualizar usuário
  static async updateUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { username, email, role, full_name, is_active, password } = req.body;

      // Verificar se o usuário existe
      const { data: existingUser, error: fetchError } = await from('users')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError || !existingUser) {
        return res.status(404).json({
          success: false,
          error: 'Usuário não encontrado'
        });
      }

      // Verificar se username/email já existe (exceto para o usuário atual)
      if (username || email) {
        const { data: duplicateUsers } = await from('users')
          .select('id')
          .or(`username.eq.${username || existingUser.username},email.eq.${email || existingUser.email}`)
          .neq('id', id);

        if (duplicateUsers && duplicateUsers.length > 0) {
          return res.status(400).json({
            success: false,
            error: 'Username ou email já existe'
          });
        }
      }

      // Preparar campos para atualização
      const updateData: any = {};

      if (username !== undefined) updateData.username = username;
      if (email !== undefined) updateData.email = email;
      if (role !== undefined) updateData.role = role;
      if (full_name !== undefined) updateData.full_name = full_name;
      if (is_active !== undefined) updateData.is_active = is_active;

      if (password) {
        const saltRounds = 12;
        const passwordHash = await bcrypt.hash(password, saltRounds);
        updateData.password_hash = passwordHash;
      }

      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Nenhum campo para atualizar'
        });
      }

      const { data: updatedUser, error } = await from('users')
        .update(updateData)
        .eq('id', id)
        .select('id, username, email, role, full_name, is_active, created_at, updated_at')
        .single();

      if (error) {
        console.error('Erro ao atualizar usuário:', error);
        return res.status(500).json({
          success: false,
          error: 'Erro interno do servidor'
        });
      }

      const response: ApiResponse<User> = {
        success: true,
        data: updatedUser,
        message: 'Usuário atualizado com sucesso'
      };

      res.json(response);
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  }

  // Deletar usuário
  static async deleteUser(req: Request, res: Response) {
    try {
      const { id } = req.params;

      // Verificar se o usuário existe
      const { data: existingUser, error: fetchError } = await from('users')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError || !existingUser) {
        return res.status(404).json({
          success: false,
          error: 'Usuário não encontrado'
        });
      }

      // Não permitir deletar o próprio usuário
      if (parseInt(id) === (req as any).user?.id) {
        return res.status(400).json({
          success: false,
          error: 'Não é possível deletar o próprio usuário'
        });
      }

      // Verificar se é o último admin
      if (existingUser.role === 'admin') {
        const { count } = await from('users')
          .select('*', { count: 'exact', head: true })
          .eq('role', 'admin')
          .eq('is_active', true);

        if ((count || 0) <= 1) {
          return res.status(400).json({
            success: false,
            error: 'Não é possível deletar o último administrador'
          });
        }
      }

      const { error } = await from('users')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erro ao deletar usuário:', error);
        return res.status(500).json({
          success: false,
          error: 'Erro interno do servidor'
        });
      }

      const response: ApiResponse<null> = {
        success: true,
        message: 'Usuário deletado com sucesso'
      };

      res.json(response);
    } catch (error) {
      console.error('Erro ao deletar usuário:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  }
} 