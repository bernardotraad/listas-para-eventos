'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { apiService } from '@/services/api';
import { Event } from '@/types';
import { Card, Button } from '@/components';
import { ArrowLeft, Edit, Calendar, MapPin, Clock, Users, CheckSquare } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function EventViewPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
        setEvent(response.data);
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatTime = (timeString: string) => {
    return timeString?.substring(0, 5) || '';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativo': return 'bg-green-100 text-green-800';
      case 'cancelado': return 'bg-red-100 text-red-800';
      case 'finalizado': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard/events">
              <Button variant="secondary" icon={<ArrowLeft size={16} />}>
                Voltar
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{event.name}</h1>
              <p className="text-gray-600">Detalhes do evento</p>
            </div>
          </div>
          {user?.role === 'admin' && (
            <Link href={`/dashboard/events/${event.id}/edit`}>
              <Button icon={<Edit size={16} />}>
                Editar Evento
              </Button>
            </Link>
          )}
        </div>

        {/* Event Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Informações do Evento</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Calendar className="text-gray-400" size={20} />
                <div>
                  <p className="text-sm font-medium text-gray-600">Data</p>
                  <p className="text-gray-900">{formatDate(event.event_date)}</p>
                </div>
              </div>
              
              {event.event_time && (
                <div className="flex items-center space-x-3">
                  <Clock className="text-gray-400" size={20} />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Horário</p>
                    <p className="text-gray-900">{formatTime(event.event_time)}</p>
                  </div>
                </div>
              )}
              
              {event.location && (
                <div className="flex items-center space-x-3">
                  <MapPin className="text-gray-400" size={20} />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Local</p>
                    <p className="text-gray-900">{event.location}</p>
                  </div>
                </div>
              )}
              
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 bg-gray-400 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Status</p>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                    {event.status}
                  </span>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Descrição</h3>
            <p className="text-gray-700 whitespace-pre-wrap">
              {event.description || 'Nenhuma descrição disponível.'}
            </p>
          </Card>
        </div>

        {/* Quick Actions */}
        {user?.role === 'portaria' && (
          <Card>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Ações Rápidas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link href={`/dashboard/checkin?event=${event.id}`}>
                <Button className="w-full" icon={<CheckSquare size={16} />}>
                  Fazer Check-in
                </Button>
              </Link>
              <Link href={`/dashboard/names?event=${event.id}`}>
                <Button className="w-full" variant="secondary" icon={<Users size={16} />}>
                  Cadastrar Nomes
                </Button>
              </Link>
            </div>
          </Card>
        )}
      </div>
    </Layout>
  );
} 