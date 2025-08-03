'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { apiService } from '@/services/api';
import { Event, NameEntry } from '@/types';
import { Card, Input, Button } from '@/components';
import { Plus, Trash2, Send, Calendar, Clock, MapPin } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import toast from 'react-hot-toast';

export default function NamesPage() {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<number | ''>('');
  const [nameEntries, setNameEntries] = useState<NameEntry[]>([{ name: '' }]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);

  useEffect(() => {
    loadEvents();
  }, []);

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

  const addNameEntry = () => {
    setNameEntries([...nameEntries, { name: '' }]);
  };

  const removeNameEntry = (index: number) => {
    if (nameEntries.length > 1) {
      const newEntries = nameEntries.filter((_, i) => i !== index);
      setNameEntries(newEntries);
    }
  };

  const updateNameEntry = (index: number, field: keyof NameEntry, value: string) => {
    const newEntries = [...nameEntries];
    newEntries[index] = { ...newEntries[index], [field]: value };
    setNameEntries(newEntries);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedEvent) {
      toast.error('Selecione um evento');
      return;
    }

    const validNames = nameEntries
      .map(entry => entry.name.trim())
      .filter(name => name.length > 0);

    if (validNames.length === 0) {
      toast.error('Adicione pelo menos um nome');
      return;
    }

    try {
      setIsLoading(true);
      
      const nameData = {
        event_id: parseInt(selectedEvent.toString()),
        names: validNames,
        emails: nameEntries
          .map(entry => entry.email?.trim())
          .filter((email): email is string => email !== undefined && email.length > 0),
        phones: nameEntries
          .map(entry => entry.phone?.trim())
          .filter((phone): phone is string => phone !== undefined && phone.length > 0),
      };

      const response = await apiService.submitNames(nameData);
      
      if (response.success && response.data) {
        const { inserted, errors, event } = response.data;
        
        // Mostrar resultado
        if (inserted.length > 0) {
          toast.success(`${inserted.length} nomes registrados com sucesso para "${event.name}"!`);
        }
        
        if (errors.length > 0) {
          errors.forEach(error => toast.error(error));
        }

        // Limpar formulário
        setSelectedEvent('');
        setNameEntries([{ name: '' }]);
      }
    } catch (error: any) {
      console.error('Erro ao enviar nomes:', error);
      const errorMessage = error.response?.data?.error || 'Erro ao enviar nomes';
      toast.error(errorMessage);
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

  const selectedEventData = events.find(e => e.id === selectedEvent);

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cadastro Manual de Nomes</h1>
          <p className="text-gray-600">Adicione participantes manualmente aos eventos</p>
        </div>

        {/* Form Card */}
        <Card>
          <div className="card-header">
            <h3 className="card-title">Cadastro de Participantes</h3>
            <p className="card-subtitle">
              Preencha os dados abaixo para adicionar participantes
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Event Selection */}
            <div>
              <label htmlFor="event" className="block text-sm font-medium text-gray-700 mb-2">
                Selecione o Evento *
              </label>
              <select
                id="event"
                value={selectedEvent}
                onChange={(e) => setSelectedEvent(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                disabled={isLoadingEvents}
              >
                <option value="">Escolha um evento...</option>
                {events.map((event) => (
                  <option key={event.id} value={event.id}>
                    {event.name} - {formatDate(event.event_date)}
                    {event.event_time && ` às ${formatTime(event.event_time)}`}
                    {event.location && ` - ${event.location}`}
                  </option>
                ))}
              </select>
              {isLoadingEvents && (
                <p className="text-sm text-gray-500 mt-1">Carregando eventos...</p>
              )}
            </div>

            {/* Event Info (when selected) */}
            {selectedEventData && (
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Informações do Evento</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-blue-800">
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
                      <MapPin size={16} />
                      <span>{selectedEventData.location}</span>
                    </div>
                  )}
                  {selectedEventData.capacity && (
                    <div className="flex items-center space-x-2">
                      <span>Capacidade: {selectedEventData.capacity} pessoas</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Names Section */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Nomes dos Participantes *
                </label>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={addNameEntry}
                  icon={<Plus size={16} />}
                >
                  Adicionar Nome
                </Button>
              </div>

              <div className="space-y-3">
                {nameEntries.map((entry, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <Input
                        type="text"
                        placeholder="Nome completo *"
                        value={entry.name}
                        onChange={(e) => updateNameEntry(index, 'name', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Input
                        type="email"
                        placeholder="Email (opcional)"
                        value={entry.email || ''}
                        onChange={(e) => updateNameEntry(index, 'email', e.target.value)}
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Input
                        type="tel"
                        placeholder="Telefone (opcional)"
                        value={entry.phone || ''}
                        onChange={(e) => updateNameEntry(index, 'phone', e.target.value)}
                      />
                      {nameEntries.length > 1 && (
                        <Button
                          type="button"
                          variant="danger"
                          size="sm"
                          onClick={() => removeNameEntry(index)}
                          icon={<Trash2 size={16} />}
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={isLoading || !selectedEvent}
                loading={isLoading}
                icon={<Send size={16} />}
              >
                Cadastrar Participantes
              </Button>
            </div>
          </form>
        </Card>

        {/* Instructions */}
        <Card>
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Como usar</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-600 font-bold">1</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Selecione o Evento</h4>
                <p className="text-gray-600 text-sm">
                  Escolha o evento para o qual deseja adicionar participantes
                </p>
              </div>
              <div className="text-center">
                <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                  <span className="text-green-600 font-bold">2</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Adicione os Nomes</h4>
                <p className="text-gray-600 text-sm">
                  Preencha os nomes dos participantes e informações adicionais
                </p>
              </div>
              <div className="text-center">
                <div className="bg-purple-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                  <span className="text-purple-600 font-bold">3</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Envie os Dados</h4>
                <p className="text-gray-600 text-sm">
                  Clique em cadastrar para registrar os participantes no sistema
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
} 