'use client';

import { useState, useEffect } from 'react';
import { Event, NameEntry } from '@/types';
import { apiService } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { Calendar, MapPin, Clock, Users, Plus, Trash2, Send, LogIn } from 'lucide-react';
import toast from 'react-hot-toast';

export default function HomePage() {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<number | ''>('');
  const [nameEntries, setNameEntries] = useState<NameEntry[]>([{ name: '' }]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);

  // Carregar eventos ativos
  useEffect(() => {
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

    loadEvents();
  }, []);

  // Adicionar novo campo de nome
  const addNameEntry = () => {
    setNameEntries([...nameEntries, { name: '' }]);
  };

  // Remover campo de nome
  const removeNameEntry = (index: number) => {
    if (nameEntries.length > 1) {
      const newEntries = nameEntries.filter((_, i) => i !== index);
      setNameEntries(newEntries);
    }
  };

  // Atualizar campo de nome
  const updateNameEntry = (index: number, field: keyof NameEntry, value: string) => {
    const newEntries = [...nameEntries];
    newEntries[index] = { ...newEntries[index], [field]: value };
    setNameEntries(newEntries);
  };

  // Enviar nomes
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

  // Formatar data
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  // Formatar hora
  const formatTime = (timeString: string) => {
    return timeString.substring(0, 5);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Listas para Eventos</h1>
              <p className="text-gray-600">Sistema de gerenciamento de inscrições</p>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Olá, {user.full_name}</span>
                  <a 
                    href="/dashboard" 
                    className="btn-primary text-sm"
                  >
                    Painel
                  </a>
                </div>
              ) : (
                <a 
                  href="/login" 
                  className="btn-primary text-sm flex items-center space-x-2"
                >
                  <LogIn size={16} />
                  <span>Login</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Bem-vindo ao Sistema de Inscrições
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Inscreva-se facilmente em nossos eventos. Selecione um evento abaixo e adicione os nomes 
            dos participantes. Você pode enviar múltiplos nomes de uma vez!
          </p>
        </div>

        {/* Form Card */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Inscrição em Evento</h3>
            <p className="card-subtitle">
              Preencha os dados abaixo para inscrever participantes
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
                className="input-field"
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
            {selectedEvent && events.find(e => e.id === parseInt(selectedEvent.toString())) && (
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Informações do Evento</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-blue-800">
                  {(() => {
                    const event = events.find(e => e.id === parseInt(selectedEvent.toString()))!;
                    return (
                      <>
                        <div className="flex items-center space-x-2">
                          <Calendar size={16} />
                          <span>{formatDate(event.event_date)}</span>
                        </div>
                        {event.event_time && (
                          <div className="flex items-center space-x-2">
                            <Clock size={16} />
                            <span>{formatTime(event.event_time)}</span>
                          </div>
                        )}
                        {event.location && (
                          <div className="flex items-center space-x-2">
                            <MapPin size={16} />
                            <span>{event.location}</span>
                          </div>
                        )}
                        {event.capacity && (
                          <div className="flex items-center space-x-2">
                            <Users size={16} />
                            <span>Capacidade: {event.capacity} pessoas</span>
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>
              </div>
            )}

            {/* Names Section */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Nomes dos Participantes *
                </label>
                <button
                  type="button"
                  onClick={addNameEntry}
                  className="btn-secondary text-sm flex items-center space-x-1"
                >
                  <Plus size={16} />
                  <span>Adicionar Nome</span>
                </button>
              </div>

              <div className="space-y-3">
                {nameEntries.map((entry, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <input
                        type="text"
                        placeholder="Nome completo *"
                        value={entry.name}
                        onChange={(e) => updateNameEntry(index, 'name', e.target.value)}
                        className="input-field"
                        required
                      />
                    </div>
                    <div>
                      <input
                        type="email"
                        placeholder="Email (opcional)"
                        value={entry.email || ''}
                        onChange={(e) => updateNameEntry(index, 'email', e.target.value)}
                        className="input-field"
                      />
                    </div>
                    <div className="flex space-x-2">
                      <input
                        type="tel"
                        placeholder="Telefone (opcional)"
                        value={entry.phone || ''}
                        onChange={(e) => updateNameEntry(index, 'phone', e.target.value)}
                        className="input-field"
                      />
                      {nameEntries.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeNameEntry(index)}
                          className="btn-error px-3"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isLoading || !selectedEvent}
                className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Enviando...</span>
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    <span>Enviar Inscrições</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Features Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
              <Users className="text-blue-600" size={24} />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Múltiplos Nomes</h3>
            <p className="text-gray-600 text-sm">
              Envie vários nomes de uma vez para agilizar o processo de inscrição
            </p>
          </div>
          <div className="text-center">
            <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
              <Calendar className="text-green-600" size={24} />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Eventos Ativos</h3>
            <p className="text-gray-600 text-sm">
              Visualize apenas eventos ativos e disponíveis para inscrição
            </p>
          </div>
          <div className="text-center">
            <div className="bg-purple-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
              <Send className="text-purple-600" size={24} />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Envio Rápido</h3>
            <p className="text-gray-600 text-sm">
              Processo simples e rápido para registrar participantes
            </p>
          </div>
        </div>
      </main>
    </div>
  );
} 