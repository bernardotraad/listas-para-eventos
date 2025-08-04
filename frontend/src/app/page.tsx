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
        console.log('📅 Carregando eventos ativos...');
        
        const response = await apiService.getActiveEvents();
        console.log('📡 Resposta dos eventos:', response);
        
        if (response.success && response.data) {
          console.log('✅ Eventos carregados:', response.data);
          setEvents(response.data);
        } else {
          console.log('⚠️ Nenhum evento encontrado ou erro na resposta');
        }
      } catch (error: any) {
        console.error('❌ Erro ao carregar eventos:', error);
        console.error('❌ Response data:', error.response?.data);
        console.error('❌ Response status:', error.response?.status);
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
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 space-y-3 sm:space-y-0">
            <div className="w-full sm:w-auto">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 leading-8">Listas para Eventos</h1>
              <p className="text-sm sm:text-base text-gray-600 leading-6">Sistema de gerenciamento de inscrições</p>
            </div>
            <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
              {user ? (
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                  <span className="text-sm text-gray-600 leading-5">Olá, {user.full_name}</span>
                  <a 
                    href="/dashboard" 
                    className="btn-primary text-sm w-full sm:w-auto text-center"
                  >
                    Painel
                  </a>
                </div>
              ) : (
                <a 
                  href="/login" 
                  className="btn-primary text-sm flex items-center justify-center space-x-2 w-full sm:w-auto"
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
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Welcome Section */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 leading-10">
            Bem-vindo ao Sistema de Inscrições
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-7 px-2">
            Inscreva-se facilmente em nossos eventos. Selecione um evento abaixo e adicione os nomes 
            dos participantes. Você pode enviar múltiplos nomes de uma vez!
          </p>
        </div>

        {/* Form Card */}
        <div className="card mb-8 sm:mb-12">
          <div className="card-header">
            <h3 className="card-title">Inscrição em Evento</h3>
            <p className="card-subtitle">
              Preencha os dados abaixo para inscrever participantes
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
            {/* Event Selection */}
            <div>
              <label htmlFor="event" className="block text-sm font-medium text-gray-700 mb-2 leading-5">
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
                <p className="text-sm text-gray-500 mt-2 leading-5">Carregando eventos...</p>
              )}
            </div>

            {/* Event Info (when selected) */}
            {selectedEvent && events.find(e => e.id === parseInt(selectedEvent.toString())) && (
              <div className="bg-blue-50 rounded-lg p-4 sm:p-6 border border-blue-200">
                <h4 className="font-medium text-blue-900 mb-3 sm:mb-4 leading-6">Informações do Evento</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 text-sm text-blue-800 leading-5">
                  {(() => {
                    const event = events.find(e => e.id === parseInt(selectedEvent.toString()))!;
                    return (
                      <>
                        <div className="flex items-center space-x-2 sm:space-x-3">
                          <Calendar size={16} className="text-blue-600 flex-shrink-0" />
                          <span className="truncate">{formatDate(event.event_date)}</span>
                        </div>
                        {event.event_time && (
                          <div className="flex items-center space-x-2 sm:space-x-3">
                            <Clock size={16} className="text-blue-600 flex-shrink-0" />
                            <span>{formatTime(event.event_time)}</span>
                          </div>
                        )}
                        {event.location && (
                          <div className="flex items-center space-x-2 sm:space-x-3 col-span-1 sm:col-span-2">
                            <MapPin size={16} className="text-blue-600 flex-shrink-0" />
                            <span className="truncate">{event.location}</span>
                          </div>
                        )}
                        {event.capacity && (
                          <div className="flex items-center space-x-2 sm:space-x-3">
                            <Users size={16} className="text-blue-600 flex-shrink-0" />
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
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 space-y-3 sm:space-y-0">
                <label className="block text-sm font-medium text-gray-700 leading-5">
                  Nomes dos Participantes *
                </label>
                <button
                  type="button"
                  onClick={addNameEntry}
                  className="btn-secondary text-sm flex items-center justify-center space-x-2 w-full sm:w-auto"
                >
                  <Plus size={16} />
                  <span>Adicionar Nome</span>
                </button>
              </div>

              <div className="space-y-4">
                {nameEntries.map((entry, index) => (
                  <div key={index} className="grid grid-cols-1 gap-4">
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <input
                          type="email"
                          placeholder="Email (opcional)"
                          value={entry.email || ''}
                          onChange={(e) => updateNameEntry(index, 'email', e.target.value)}
                          className="input-field"
                        />
                      </div>
                      <div className="flex space-x-3">
                        <input
                          type="tel"
                          placeholder="Telefone (opcional)"
                          value={entry.phone || ''}
                          onChange={(e) => updateNameEntry(index, 'phone', e.target.value)}
                          className="input-field flex-1"
                        />
                        {nameEntries.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeNameEntry(index)}
                            className="btn-error px-3 flex items-center justify-center min-w-[44px]"
                            aria-label="Remover nome"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
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
                className="btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          <div className="text-center">
            <div className="bg-blue-100 rounded-full w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <Users className="text-blue-600" size={24} />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2 sm:mb-3 leading-6">Múltiplos Nomes</h3>
            <p className="text-gray-600 text-sm leading-5">
              Envie vários nomes de uma vez para agilizar o processo de inscrição
            </p>
          </div>
          <div className="text-center">
            <div className="bg-green-100 rounded-full w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <Calendar className="text-green-600" size={24} />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2 sm:mb-3 leading-6">Eventos Ativos</h3>
            <p className="text-gray-600 text-sm leading-5">
              Visualize apenas eventos ativos e disponíveis para inscrição
            </p>
          </div>
          <div className="text-center sm:col-span-2 lg:col-span-1">
            <div className="bg-purple-100 rounded-full w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <Send className="text-purple-600" size={24} />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2 sm:mb-3 leading-6">Envio Rápido</h3>
            <p className="text-gray-600 text-sm leading-5">
              Processo simples e rápido para registrar participantes
            </p>
          </div>
        </div>
      </main>
    </div>
  );
} 