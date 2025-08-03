'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { apiService } from '@/services/api';
import { Event } from '@/types';
import { Card, Table, Button } from '@/components';
import { Plus, Edit, Trash2, Eye, Calendar, MapPin, Clock } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function EventsPage() {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setIsLoading(true);
      const response = await apiService.getAllEvents();
      if (response.success && response.data) {
        setEvents(response.data);
      }
    } catch (error) {
      console.error('Erro ao carregar eventos:', error);
      toast.error('Erro ao carregar eventos');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteEvent = async () => {
    if (!selectedEvent) return;

    try {
      const response = await apiService.deleteEvent(selectedEvent.id);
      if (response.success) {
        toast.success('Evento excluído com sucesso!');
        setEvents(events.filter(e => e.id !== selectedEvent.id));
        setShowDeleteModal(false);
        setSelectedEvent(null);
      }
    } catch (error) {
      console.error('Erro ao excluir evento:', error);
      toast.error('Erro ao excluir evento');
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

  const eventColumns = [
    { key: 'name', header: 'Evento' },
    { 
      key: 'event_date', 
      header: 'Data', 
      render: (event: Event) => (
        <div className="flex items-center space-x-1">
          <Calendar size={16} className="text-gray-400" />
          <span>{formatDate(event.event_date)}</span>
        </div>
      )
    },
    { 
      key: 'event_time', 
      header: 'Horário', 
      render: (event: Event) => event.event_time ? (
        <div className="flex items-center space-x-1">
          <Clock size={16} className="text-gray-400" />
          <span>{formatTime(event.event_time)}</span>
        </div>
      ) : '-'
    },
    { 
      key: 'location', 
      header: 'Local', 
      render: (event: Event) => event.location ? (
        <div className="flex items-center space-x-1">
          <MapPin size={16} className="text-gray-400" />
          <span>{event.location}</span>
        </div>
      ) : '-'
    },
    { 
      key: 'status', 
      header: 'Status', 
      render: (event: Event) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
          {event.status}
        </span>
      )
    },
    {
      key: 'actions',
      header: 'Ações',
      render: (event: Event) => (
        <div className="flex items-center space-x-2">
          <Link
            href={`/dashboard/events/${event.id}`}
            className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
            title="Visualizar"
          >
            <Eye size={16} />
          </Link>
          <Link
            href={`/dashboard/events/${event.id}/edit`}
            className="p-1 text-green-600 hover:text-green-800 transition-colors"
            title="Editar"
          >
            <Edit size={16} />
          </Link>
          <button
            onClick={() => {
              setSelectedEvent(event);
              setShowDeleteModal(true);
            }}
            className="p-1 text-red-600 hover:text-red-800 transition-colors"
            title="Excluir"
          >
            <Trash2 size={16} />
          </button>
        </div>
      )
    }
  ];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gerenciar Eventos</h1>
            <p className="text-gray-600">Crie e gerencie eventos do sistema</p>
          </div>
          <Link href="/dashboard/events/new">
            <Button icon={<Plus size={16} />}>
              Novo Evento
            </Button>
          </Link>
        </div>

        {/* Events Table */}
        <Card>
          <Table
            data={events}
            columns={eventColumns}
            loading={isLoading}
            emptyMessage="Nenhum evento encontrado"
          />
        </Card>

        {/* Delete Modal */}
        {showDeleteModal && selectedEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Confirmar Exclusão
              </h3>
              <p className="text-gray-600 mb-6">
                Tem certeza que deseja excluir o evento "{selectedEvent.name}"? 
                Esta ação não pode ser desfeita.
              </p>
              <div className="flex justify-end space-x-3">
                <Button
                  variant="secondary"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedEvent(null);
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  variant="danger"
                  onClick={handleDeleteEvent}
                >
                  Excluir
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
} 