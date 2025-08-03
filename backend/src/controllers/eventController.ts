import { Request, Response } from 'express';
import { from } from '../config/database';
import { CreateEventDto, Event, ApiResponse, AuthenticatedRequest } from '../types';

// Controlador de eventos
export class EventController {
  // Listar todos os eventos
  static async getAllEvents(req: Request, res: Response) {
    try {
      const { data: events, error } = await from('events')
        .select(`
          *,
          users!events_created_by_fkey(full_name)
        `)
        .order('event_date', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar eventos:', error);
        return res.status(500).json({
          success: false,
          error: 'Erro interno do servidor'
        });
      }

      // Transformar dados para manter compatibilidade
      const transformedEvents = events?.map((event: any) => ({
        ...event,
        created_by_name: event.users?.full_name
      })) || [];

      const response: ApiResponse<Event[]> = {
        success: true,
        data: transformedEvents,
        message: 'Eventos listados com sucesso'
      };

      res.json(response);
    } catch (error) {
      console.error('Erro ao listar eventos:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  }

  // Listar eventos ativos (para página pública)
  static async getActiveEvents(req: Request, res: Response) {
    try {
      const { data: events, error } = await from('events')
        .select('id, name, description, location, event_date, event_time, capacity, status, created_by, created_at, updated_at')
        .eq('status', 'ativo')
        .gte('event_date', new Date().toISOString().split('T')[0])
        .order('event_date', { ascending: true });

      if (error) {
        console.error('Erro ao buscar eventos ativos:', error);
        return res.status(500).json({
          success: false,
          error: 'Erro interno do servidor'
        });
      }

      const response: ApiResponse<Event[]> = {
        success: true,
        data: events || [],
        message: 'Eventos ativos listados com sucesso'
      };

      res.json(response);
    } catch (error) {
      console.error('Erro ao listar eventos ativos:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  }

  // Buscar evento por ID
  static async getEventById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const { data: event, error } = await from('events')
        .select(`
          *,
          users!events_created_by_fkey(full_name)
        `)
        .eq('id', id)
        .single();

      if (error || !event) {
        return res.status(404).json({
          success: false,
          error: 'Evento não encontrado'
        });
      }

      // Transformar dados para manter compatibilidade
      const transformedEvent = {
        ...event,
        created_by_name: event.users?.full_name
      };

      const response: ApiResponse<Event> = {
        success: true,
        data: transformedEvent,
        message: 'Evento encontrado com sucesso'
      };

      res.json(response);
    } catch (error) {
      console.error('Erro ao buscar evento:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  }

  // Criar novo evento
  static async createEvent(req: AuthenticatedRequest, res: Response) {
    try {
      const { name, description, location, event_date, event_time, capacity }: CreateEventDto = req.body;

      // Validação básica
      if (!name || !event_date) {
        return res.status(400).json({
          success: false,
          error: 'Nome e data do evento são obrigatórios'
        });
      }

      // Verificar se o usuário está autenticado
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Usuário não autenticado'
        });
      }

      const { data: newEvent, error } = await from('events')
        .insert({
          name,
          description,
          location,
          event_date,
          event_time,
          capacity,
          created_by: req.user.id
        })
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar evento:', error);
        return res.status(500).json({
          success: false,
          error: 'Erro interno do servidor'
        });
      }

      const response: ApiResponse<Event> = {
        success: true,
        data: newEvent,
        message: 'Evento criado com sucesso'
      };

      res.status(201).json(response);
    } catch (error) {
      console.error('Erro ao criar evento:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  }

  // Atualizar evento
  static async updateEvent(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const { name, description, location, event_date, event_time, capacity, status } = req.body;

      // Verificar se o evento existe
      const { data: existingEvent, error: fetchError } = await from('events')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError || !existingEvent) {
        return res.status(404).json({
          success: false,
          error: 'Evento não encontrado'
        });
      }

      // Verificar permissões (apenas quem criou ou admin pode editar)
      if (req.user!.role !== 'admin' && existingEvent.created_by !== req.user!.id) {
        return res.status(403).json({
          success: false,
          error: 'Sem permissão para editar este evento'
        });
      }

      const updateData: any = {};
      if (name !== undefined) updateData.name = name;
      if (description !== undefined) updateData.description = description;
      if (location !== undefined) updateData.location = location;
      if (event_date !== undefined) updateData.event_date = event_date;
      if (event_time !== undefined) updateData.event_time = event_time;
      if (capacity !== undefined) updateData.capacity = capacity;
      if (status !== undefined) updateData.status = status;

      const { data: updatedEvent, error } = await from('events')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Erro ao atualizar evento:', error);
        return res.status(500).json({
          success: false,
          error: 'Erro interno do servidor'
        });
      }

      const response: ApiResponse<Event> = {
        success: true,
        data: updatedEvent,
        message: 'Evento atualizado com sucesso'
      };

      res.json(response);
    } catch (error) {
      console.error('Erro ao atualizar evento:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  }

  // Deletar evento
  static async deleteEvent(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;

      // Verificar se o evento existe
      const { data: existingEvent, error: fetchError } = await from('events')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError || !existingEvent) {
        return res.status(404).json({
          success: false,
          error: 'Evento não encontrado'
        });
      }

      // Apenas admin pode deletar eventos
      if (req.user!.role !== 'admin') {
        return res.status(403).json({
          success: false,
          error: 'Apenas administradores podem deletar eventos'
        });
      }

      const { error } = await from('events')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erro ao deletar evento:', error);
        return res.status(500).json({
          success: false,
          error: 'Erro interno do servidor'
        });
      }

      const response: ApiResponse<null> = {
        success: true,
        message: 'Evento deletado com sucesso'
      };

      res.json(response);
    } catch (error) {
      console.error('Erro ao deletar evento:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  }

  // Obter estatísticas do evento
  static async getEventStats(req: Request, res: Response) {
    try {
      const { id } = req.params;

      // Buscar evento
      const { data: event, error: eventError } = await from('events')
        .select('name, capacity')
        .eq('id', id)
        .single();

      if (eventError || !event) {
        return res.status(404).json({
          success: false,
          error: 'Evento não encontrado'
        });
      }

      // Buscar estatísticas dos participantes
      const { data: participants, error: participantsError } = await from('name_lists')
        .select('checkin_status')
        .eq('event_id', id);

      if (participantsError) {
        console.error('Erro ao buscar participantes:', participantsError);
        return res.status(500).json({
          success: false,
          error: 'Erro interno do servidor'
        });
      }

      const totalRegistrations = participants?.length || 0;
      const presentCount = participants?.filter((p: any) => p.checkin_status === 'presente').length || 0;
      const absentCount = participants?.filter((p: any) => p.checkin_status === 'ausente').length || 0;
      const pendingCount = participants?.filter((p: any) => p.checkin_status === 'pendente').length || 0;

      const stats = {
        name: event.name,
        capacity: event.capacity,
        total_registrations: totalRegistrations,
        present_count: presentCount,
        absent_count: absentCount,
        pending_count: pendingCount
      };

      const response: ApiResponse<typeof stats> = {
        success: true,
        data: stats,
        message: 'Estatísticas do evento obtidas com sucesso'
      };

      res.json(response);
    } catch (error) {
      console.error('Erro ao obter estatísticas do evento:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  }
} 