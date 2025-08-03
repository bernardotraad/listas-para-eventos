import { Request, Response } from 'express';
import { from } from '../config/database';
import { CreateNameListDto, CheckinDto, NameList, ApiResponse, AuthenticatedRequest } from '../types';

// Controlador de listas de nomes
export class NameListController {
  // Endpoint principal: Enviar múltiplos nomes para um evento (público)
  static async submitNames(req: Request, res: Response) {
    try {
      const { event_id, names, emails, phones }: CreateNameListDto = req.body;

      // Validação básica
      if (!event_id || !names || names.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'ID do evento e lista de nomes são obrigatórios'
        });
      }

      // Verificar se o evento existe e está ativo
      const { data: event, error: eventError } = await from('events')
        .select('id, name, status, capacity')
        .eq('id', event_id)
        .eq('status', 'ativo')
        .single();

      if (eventError || !event) {
        return res.status(404).json({
          success: false,
          error: 'Evento não encontrado ou não está ativo'
        });
      }

      // Verificar capacidade do evento (se definida)
      if (event.capacity) {
        const { count } = await from('name_lists')
          .select('*', { count: 'exact', head: true })
          .eq('event_id', event_id);
        
        if ((count || 0) + names.length > event.capacity) {
          return res.status(400).json({
            success: false,
            error: `Capacidade do evento excedida. Máximo: ${event.capacity} participantes`
          });
        }
      }

      // Inserir múltiplos nomes
      const insertedNames: any[] = [];
      const errors: string[] = [];

      for (let i = 0; i < names.length; i++) {
        const name = names[i].trim();
        const email = emails && emails[i] ? emails[i].trim() : null;
        const phone = phones && phones[i] ? phones[i].trim() : null;

        // Pular nomes vazios
        if (!name) {
          errors.push(`Nome ${i + 1}: Nome vazio`);
          continue;
        }

        try {
          // Verificar se o nome já existe para este evento
          const { data: existingNames } = await from('name_lists')
            .select('id')
            .eq('event_id', event_id)
            .ilike('name', name);

          if (existingNames && existingNames.length > 0) {
            errors.push(`Nome ${i + 1} (${name}): Já registrado`);
            continue;
          }

          // Inserir o nome
          const { data: newName, error: insertError } = await from('name_lists')
            .insert({
              event_id,
              name,
              email,
              phone
            })
            .select('id, name, email, phone, created_at')
            .single();

          if (insertError) {
            throw insertError;
          }

          insertedNames.push(newName);
        } catch (error) {
          console.error(`Erro ao inserir nome ${name}:`, error);
          errors.push(`Nome ${i + 1} (${name}): Erro interno`);
        }
      }

      // Preparar resposta
      const response: ApiResponse<{
        inserted: typeof insertedNames;
        errors: string[];
        event: typeof event;
      }> = {
        success: true,
        data: {
          inserted: insertedNames,
          errors,
          event
        },
        message: `Processamento concluído. ${insertedNames.length} nomes inseridos com sucesso.`
      };

      if (errors.length > 0) {
        response.message += ` ${errors.length} erros encontrados.`;
      }

      res.status(201).json(response);
    } catch (error) {
      console.error('Erro ao submeter nomes:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  }

  // Listar nomes de um evento (para portaria/admin)
  static async getEventNames(req: Request, res: Response) {
    try {
      const { event_id } = req.params;
      const { status, search } = req.query;

      let query = from('name_lists')
        .select(`
          *,
          users!name_lists_checked_by_fkey(full_name)
        `)
        .eq('event_id', event_id);

      // Filtros opcionais
      if (status) {
        query = query.eq('checkin_status', status as string);
      }

      if (search) {
        query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`);
      }

      const { data: nameLists, error } = await query.order('name', { ascending: true });

      if (error) {
        console.error('Erro ao buscar nomes:', error);
        return res.status(500).json({
          success: false,
          error: 'Erro interno do servidor'
        });
      }

      // Transformar dados para manter compatibilidade
      const transformedNameLists = nameLists?.map((nameList: any) => ({
        ...nameList,
        checked_by_name: nameList.users?.full_name
      })) || [];

      const response: ApiResponse<NameList[]> = {
        success: true,
        data: transformedNameLists,
        message: 'Lista de nomes obtida com sucesso'
      };

      res.json(response);
    } catch (error) {
      console.error('Erro ao listar nomes do evento:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  }

  // Fazer check-in de um participante
  static async checkinParticipant(req: AuthenticatedRequest, res: Response) {
    try {
      const { name_list_id } = req.params;
      const { status, notes }: CheckinDto = req.body;

      // Verificar se o usuário está autenticado
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Usuário não autenticado'
        });
      }

      // Verificar se o registro existe
      const { data: existingRecord, error: fetchError } = await from('name_lists')
        .select('*')
        .eq('id', name_list_id)
        .single();

      if (fetchError || !existingRecord) {
        return res.status(404).json({
          success: false,
          error: 'Registro não encontrado'
        });
      }

      // Preparar dados de atualização
      const updateData: any = {
        checkin_status: status,
        updated_at: new Date().toISOString()
      };

      if (status !== 'pendente') {
        updateData.checkin_time = new Date().toISOString();
        updateData.checked_by = req.user.id;
      }

      if (notes !== undefined) {
        updateData.notes = notes;
      }

      // Atualizar status do check-in
      const { data: updatedRecord, error } = await from('name_lists')
        .update(updateData)
        .eq('id', name_list_id)
        .select()
        .single();

      if (error) {
        console.error('Erro ao atualizar check-in:', error);
        return res.status(500).json({
          success: false,
          error: 'Erro interno do servidor'
        });
      }

      const response: ApiResponse<NameList> = {
        success: true,
        data: updatedRecord,
        message: `Check-in ${status} realizado com sucesso`
      };

      res.json(response);
    } catch (error) {
      console.error('Erro ao fazer check-in:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  }

  // Adicionar nome individual (para portaria)
  static async addSingleName(req: AuthenticatedRequest, res: Response) {
    try {
      const { event_id } = req.params;
      const { name, email, phone } = req.body;

      // Verificar se o usuário está autenticado
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Usuário não autenticado'
        });
      }

      // Validação básica
      if (!name || !name.trim()) {
        return res.status(400).json({
          success: false,
          error: 'Nome é obrigatório'
        });
      }

      // Verificar se o evento existe
      const { data: event, error: eventError } = await from('events')
        .select('id, name, status, capacity')
        .eq('id', event_id)
        .single();

      if (eventError || !event) {
        return res.status(404).json({
          success: false,
          error: 'Evento não encontrado'
        });
      }

      // Verificar se o nome já existe
      const { data: existingNames } = await from('name_lists')
        .select('id')
        .eq('event_id', event_id)
        .ilike('name', name.trim());

      if (existingNames && existingNames.length > 0) {
        return res.status(400).json({
          success: false,
          error: 'Nome já registrado para este evento'
        });
      }

      // Verificar capacidade
      if (event.capacity) {
        const { count } = await from('name_lists')
          .select('*', { count: 'exact', head: true })
          .eq('event_id', event_id);
        
        if ((count || 0) >= event.capacity) {
          return res.status(400).json({
            success: false,
            error: 'Capacidade do evento atingida'
          });
        }
      }

      // Inserir o nome
      const { data: newName, error } = await from('name_lists')
        .insert({
          event_id,
          name: name.trim(),
          email: email?.trim(),
          phone: phone?.trim()
        })
        .select()
        .single();

      if (error) {
        console.error('Erro ao inserir nome:', error);
        return res.status(500).json({
          success: false,
          error: 'Erro interno do servidor'
        });
      }

      const response: ApiResponse<NameList> = {
        success: true,
        data: newName,
        message: 'Nome adicionado com sucesso'
      };

      res.status(201).json(response);
    } catch (error) {
      console.error('Erro ao adicionar nome:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  }

  // Buscar participante por nome (para check-in rápido)
  static async searchParticipant(req: Request, res: Response) {
    try {
      const { event_id } = req.params;
      const { name } = req.query;

      if (!name || typeof name !== 'string') {
        return res.status(400).json({
          success: false,
          error: 'Nome para busca é obrigatório'
        });
      }

      const { data: nameLists, error } = await from('name_lists')
        .select(`
          *,
          users!name_lists_checked_by_fkey(full_name)
        `)
        .eq('event_id', event_id)
        .ilike('name', `%${name}%`)
        .order('name', { ascending: true })
        .limit(10);

      if (error) {
        console.error('Erro ao buscar participantes:', error);
        return res.status(500).json({
          success: false,
          error: 'Erro interno do servidor'
        });
      }

      // Transformar dados para manter compatibilidade
      const transformedNameLists = nameLists?.map((nameList: any) => ({
        ...nameList,
        checked_by_name: nameList.users?.full_name
      })) || [];

      const response: ApiResponse<NameList[]> = {
        success: true,
        data: transformedNameLists,
        message: 'Busca realizada com sucesso'
      };

      res.json(response);
    } catch (error) {
      console.error('Erro ao buscar participante:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  }
} 