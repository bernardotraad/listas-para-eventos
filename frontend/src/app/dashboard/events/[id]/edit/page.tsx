'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { apiService } from '@/services/api';
import { Event, CreateEventDto } from '@/types';
import { Card, Button, Input } from '@/components';
import { ArrowLeft, Save } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function EventEditPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<CreateEventDto>({
    name: '',
    description: '',
    event_date: '',
    event_time: '',
    location: '',
    status: 'ativo'
  });

  useEffect(() => {
    if (id) {
      loadEvent();
    }
  }, [id]);

  const loadEvent = async () => {
    try {
      setIsLoading(true);
      const response = await apiService.getEventById(Number(id));
      if (response.success && response.data) {
        const eventData = response.data;
        setEvent(eventData);
        setFormData({
          name: eventData.name,
          description: eventData.description || '',
          event_date: eventData.event_date,
          event_time: eventData.event_time || '',
          location: eventData.location || '',
          status: eventData.status
        });
      } else {
        toast.error('Evento não encontrado');
        router.push('/dashboard/events');
      }
    } catch (error) {
      console.error('Erro ao carregar evento:', error);
      toast.error('Erro ao carregar evento');
      router.push('/dashboard/events');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.event_date) {
      toast.error('Nome e data são obrigatórios');
      return;
    }

    try {
      setIsSaving(true);
      const response = await apiService.updateEvent(Number(id), formData);
      if (response.success) {
        toast.success('Evento atualizado com sucesso!');
        router.push(`/dashboard/events/${id}`);
      } else {
        toast.error(response.error || 'Erro ao atualizar evento');
      }
    } catch (error) {
      console.error('Erro ao atualizar evento:', error);
      toast.error('Erro ao atualizar evento');
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field: keyof CreateEventDto, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  if (!event) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-gray-600">Evento não encontrado</p>
          <Link href="/dashboard/events">
            <Button className="mt-4">Voltar para Eventos</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Link href={`/dashboard/events/${id}`}>
            <Button variant="secondary" icon={<ArrowLeft size={16} />}>
              Voltar
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Editar Evento</h1>
            <p className="text-gray-600">Atualize as informações do evento</p>
          </div>
        </div>

        {/* Form */}
        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Nome do Evento *
                </label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Digite o nome do evento"
                  required
                />
              </div>

              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="ativo">Ativo</option>
                  <option value="cancelado">Cancelado</option>
                  <option value="finalizado">Finalizado</option>
                </select>
              </div>

              <div>
                <label htmlFor="event_date" className="block text-sm font-medium text-gray-700 mb-2">
                  Data do Evento *
                </label>
                <Input
                  id="event_date"
                  type="date"
                  value={formData.event_date}
                  onChange={(e) => handleInputChange('event_date', e.target.value)}
                  required
                />
              </div>

              <div>
                <label htmlFor="event_time" className="block text-sm font-medium text-gray-700 mb-2">
                  Horário
                </label>
                <Input
                  id="event_time"
                  type="time"
                  value={formData.event_time}
                  onChange={(e) => handleInputChange('event_time', e.target.value)}
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                  Local
                </label>
                <Input
                  id="location"
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="Digite o local do evento"
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Descrição
                </label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Digite a descrição do evento"
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <Link href={`/dashboard/events/${id}`}>
                <Button variant="secondary" type="button">
                  Cancelar
                </Button>
              </Link>
              <Button type="submit" icon={<Save size={16} />} disabled={isSaving}>
                {isSaving ? 'Salvando...' : 'Salvar Alterações'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </Layout>
  );
} 