'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { apiService } from '@/services/api';
import { Event, NameList } from '@/types';
import { Card, Table } from '@/components';
import { 
  Calendar, 
  Users, 
  CheckSquare, 
  Clock, 
  TrendingUp,
  MapPin
} from 'lucide-react';
import Layout from '@/components/layout/Layout';

interface DashboardStats {
  totalEvents: number;
  activeEvents: number;
  totalParticipants: number;
  checkedInToday: number;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalEvents: 0,
    activeEvents: 0,
    totalParticipants: 0,
    checkedInToday: 0
  });
  const [recentEvents, setRecentEvents] = useState<Event[]>([]);
  const [recentCheckins, setRecentCheckins] = useState<NameList[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setIsLoading(true);
        
        // Carregar eventos
        const eventsResponse = await apiService.getAllEvents();
        if (eventsResponse.success && eventsResponse.data) {
          const events = eventsResponse.data;
          const activeEvents = events.filter(e => e.status === 'ativo');
          
          setRecentEvents(events.slice(0, 5));
          setStats(prev => ({
            ...prev,
            totalEvents: events.length,
            activeEvents: activeEvents.length
          }));
        }

        // Carregar dados de participantes (se for portaria)
        if (user?.role === 'portaria') {
          // Aqui você pode implementar a lógica para carregar dados específicos da portaria
          setStats(prev => ({
            ...prev,
            totalParticipants: 0, // Implementar
            checkedInToday: 0 // Implementar
          }));
        }
      } catch (error) {
        console.error('Erro ao carregar dados do dashboard:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, [user]);

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
    { key: 'event_date', header: 'Data', render: (event: Event) => formatDate(event.event_date) },
    { key: 'location', header: 'Local' },
    { 
      key: 'status', 
      header: 'Status', 
      render: (event: Event) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
          {event.status}
        </span>
      )
    }
  ];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Bem-vindo, {user?.full_name}!</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="text-blue-600" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total de Eventos</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalEvents}</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="text-green-600" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Eventos Ativos</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeEvents}</p>
              </div>
            </div>
          </Card>

          {user?.role === 'portaria' && (
            <>
              <Card>
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Users className="text-purple-600" size={24} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Participantes</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalParticipants}</p>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="flex items-center">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <CheckSquare className="text-orange-600" size={24} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Check-ins Hoje</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.checkedInToday}</p>
                  </div>
                </div>
              </Card>
            </>
          )}
        </div>

        {/* Recent Events */}
        <Card
          header={
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Eventos Recentes</h3>
              <a href="/dashboard/events" className="text-sm text-blue-600 hover:text-blue-500">
                Ver todos
              </a>
            </div>
          }
        >
          <Table
            data={recentEvents}
            columns={eventColumns}
            loading={isLoading}
            emptyMessage="Nenhum evento encontrado"
          />
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {user?.role === 'admin' && (
            <>
              <Card>
                <div className="text-center">
                  <div className="p-3 bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                    <Calendar className="text-blue-600" size={24} />
                  </div>
                  <h3 className="font-medium text-gray-900 mb-2">Criar Evento</h3>
                  <p className="text-sm text-gray-600 mb-4">Adicione um novo evento ao sistema</p>
                  <a 
                    href="/dashboard/events/new" 
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
                  >
                    Criar Evento
                  </a>
                </div>
              </Card>

              <Card>
                <div className="text-center">
                  <div className="p-3 bg-green-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                    <Users className="text-green-600" size={24} />
                  </div>
                  <h3 className="font-medium text-gray-900 mb-2">Gerenciar Usuários</h3>
                  <p className="text-sm text-gray-600 mb-4">Adicione ou edite usuários do sistema</p>
                  <a 
                    href="/dashboard/users" 
                    className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700"
                  >
                    Gerenciar Usuários
                  </a>
                </div>
              </Card>
            </>
          )}

          {user?.role === 'portaria' && (
            <>
              <Card>
                <div className="text-center">
                  <div className="p-3 bg-purple-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                    <CheckSquare className="text-purple-600" size={24} />
                  </div>
                  <h3 className="font-medium text-gray-900 mb-2">Check-in</h3>
                  <p className="text-sm text-gray-600 mb-4">Realize check-in de participantes</p>
                  <a 
                    href="/dashboard/checkin" 
                    className="inline-flex items-center px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700"
                  >
                    Fazer Check-in
                  </a>
                </div>
              </Card>

              <Card>
                <div className="text-center">
                  <div className="p-3 bg-orange-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                    <Users className="text-orange-600" size={24} />
                  </div>
                  <h3 className="font-medium text-gray-900 mb-2">Cadastrar Nomes</h3>
                  <p className="text-sm text-gray-600 mb-4">Adicione participantes manualmente</p>
                  <a 
                    href="/dashboard/names" 
                    className="inline-flex items-center px-4 py-2 bg-orange-600 text-white text-sm font-medium rounded-lg hover:bg-orange-700"
                  >
                    Cadastrar Nomes
                  </a>
                </div>
              </Card>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
} 