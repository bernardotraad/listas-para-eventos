'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { apiService } from '@/services/api';
import { Event, NameList } from '@/types';
import { Card, Input, Button, Table } from '@/components';
import { Search, CheckSquare, X, User, Calendar, Clock } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import toast from 'react-hot-toast';

export default function CheckinPage() {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<number | ''>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [participants, setParticipants] = useState<NameList[]>([]);
  const [filteredParticipants, setFilteredParticipants] = useState<NameList[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);

  useEffect(() => {
    loadEvents();
  }, []);

  useEffect(() => {
    if (selectedEvent) {
      loadParticipants(selectedEvent as number);
    } else {
      setParticipants([]);
      setFilteredParticipants([]);
    }
  }, [selectedEvent]);

  useEffect(() => {
    if (searchTerm.trim()) {
      const filtered = participants.filter(participant =>
        participant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        participant.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredParticipants(filtered);
    } else {
      setFilteredParticipants(participants);
    }
  }, [searchTerm, participants]);

  const loadEvents = async () => {
    try {
      setIsLoadingEvents(true);
      const response = await apiService.getActiveEvents();
      if (response.success && response.data) {
        setEvents(response.data);
      }
    } catch (error) {
      console.error('Erro ao carregar eventos:', error);
      toast.error('Erro ao carregar eventos');
    } finally {
      setIsLoadingEvents(false);
    }
  };

  const loadParticipants = async (eventId: number) => {
    try {
      setIsLoading(true);
      const response = await apiService.getEventNames(eventId);
      if (response.success && response.data) {
        setParticipants(response.data);
        setFilteredParticipants(response.data);
      }
    } catch (error) {
      console.error('Erro ao carregar participantes:', error);
      toast.error('Erro ao carregar participantes');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckin = async (participant: NameList, status: 'presente' | 'ausente') => {
    try {
      const response = await apiService.checkinParticipant(participant.id, {
        name_list_id: participant.id,
        status,
        notes: ''
      });

      if (response.success && response.data) {
        // Atualizar lista local
        const updatedParticipants = participants.map(p => 
          p.id === participant.id ? response.data : p
        ).filter((p): p is NameList => p !== undefined);
        setParticipants(updatedParticipants);
        
        const statusText = status === 'presente' ? 'check-in realizado' : 'ausência registrada';
        toast.success(`${participant.name}: ${statusText} com sucesso!`);
      }
    } catch (error) {
      console.error('Erro ao realizar check-in:', error);
      toast.error('Erro ao realizar check-in');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatTime = (timeString: string) => {
    return timeString?.substring(0, 5) || '';
  };

  const getCheckinStatusColor = (status: string) => {
    switch (status) {
      case 'presente': return 'bg-green-100 text-green-800';
      case 'ausente': return 'bg-red-100 text-red-800';
      case 'pendente': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const participantColumns = [
    { key: 'name', header: 'Nome' },
    { key: 'email', header: 'Email' },
    { key: 'phone', header: 'Telefone' },
    { 
      key: 'checkin_status', 
      header: 'Status', 
      render: (participant: NameList) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCheckinStatusColor(participant.checkin_status)}`}>
          {participant.checkin_status}
        </span>
      )
    },
    {
      key: 'checkin_time',
      header: 'Horário Check-in',
      render: (participant: NameList) => participant.checkin_time ? 
        new Date(participant.checkin_time).toLocaleTimeString('pt-BR', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }) : '-'
    },
    {
      key: 'actions',
      header: 'Ações',
      render: (participant: NameList) => (
        <div className="flex items-center space-x-2">
          {participant.checkin_status === 'pendente' && (
            <>
              <Button
                size="sm"
                variant="primary"
                onClick={() => handleCheckin(participant, 'presente')}
                icon={<CheckSquare size={14} />}
              >
                Presente
              </Button>
              <Button
                size="sm"
                variant="danger"
                onClick={() => handleCheckin(participant, 'ausente')}
                icon={<X size={14} />}
              >
                Ausente
              </Button>
            </>
          )}
          {participant.checkin_status !== 'pendente' && (
            <span className="text-sm text-gray-500">
              {participant.checkin_status === 'presente' ? '✓ Presente' : '✗ Ausente'}
            </span>
          )}
        </div>
      )
    }
  ];

  const selectedEventData = events.find(e => e.id === selectedEvent);

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Check-in de Participantes</h1>
          <p className="text-gray-600">Realize check-in dos participantes dos eventos</p>
        </div>

        {/* Event Selection */}
        <Card>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Selecione o Evento
              </label>
              <select
                value={selectedEvent}
                onChange={(e) => setSelectedEvent(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={isLoadingEvents}
              >
                <option value="">Escolha um evento...</option>
                {events.map((event) => (
                  <option key={event.id} value={event.id}>
                    {event.name} - {formatDate(event.event_date)}
                    {event.event_time && ` às ${formatTime(event.event_time)}`}
                  </option>
                ))}
              </select>
            </div>

            {selectedEventData && (
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Informações do Evento</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-blue-800">
                  <div className="flex items-center space-x-2">
                    <Calendar size={16} />
                    <span>{formatDate(selectedEventData.event_date)}</span>
                  </div>
                  {selectedEventData.event_time && (
                    <div className="flex items-center space-x-2">
                      <Clock size={16} />
                      <span>{formatTime(selectedEventData.event_time)}</span>
                    </div>
                  )}
                  {selectedEventData.location && (
                    <div className="flex items-center space-x-2">
                      <span>📍 {selectedEventData.location}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Search and Participants */}
        {selectedEvent && (
          <>
            {/* Search */}
            <Card>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  placeholder="Buscar por nome ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </Card>

            {/* Participants Table */}
            <Card
              header={
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">
                    Participantes ({filteredParticipants.length})
                  </h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                      <span>Pendente</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                      <span>Presente</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                      <span>Ausente</span>
                    </div>
                  </div>
                </div>
              }
            >
              <Table
                data={filteredParticipants}
                columns={participantColumns}
                loading={isLoading}
                emptyMessage="Nenhum participante encontrado"
              />
            </Card>
          </>
        )}
      </div>
    </Layout>
  );
} 