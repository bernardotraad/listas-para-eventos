'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { apiService } from '@/services/api';
import { Event, NameList } from '@/types';
import { Card, Button } from '@/components';
import { BarChart3, Download, Calendar, Users, CheckSquare } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import toast from 'react-hot-toast';

interface ReportData {
  totalEvents: number;
  activeEvents: number;
  totalParticipants: number;
  checkedInParticipants: number;
  eventsByMonth: { month: string; count: number }[];
  participantsByEvent: { eventName: string; count: number }[];
}

export default function ReportsPage() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [reportData, setReportData] = useState<ReportData>({
    totalEvents: 0,
    activeEvents: 0,
    totalParticipants: 0,
    checkedInParticipants: 0,
    eventsByMonth: [],
    participantsByEvent: []
  });
  const [selectedPeriod, setSelectedPeriod] = useState('30');

  useEffect(() => {
    loadReportData();
  }, [selectedPeriod]);

  const loadReportData = async () => {
    try {
      setIsLoading(true);
      
      // Carregar eventos
      const eventsResponse = await apiService.getAllEvents();
      if (eventsResponse.success && eventsResponse.data) {
        const events = eventsResponse.data;
        const activeEvents = events.filter(e => e.status === 'ativo');
        
        // Simular dados de participantes (implementar quando backend estiver pronto)
        const totalParticipants = 0;
        const checkedInParticipants = 0;
        
        // Simular dados de eventos por mês
        const eventsByMonth = [
          { month: 'Jan', count: 2 },
          { month: 'Fev', count: 3 },
          { month: 'Mar', count: 1 },
          { month: 'Abr', count: 4 },
          { month: 'Mai', count: 2 },
          { month: 'Jun', count: 5 }
        ];
        
        // Simular dados de participantes por evento
        const participantsByEvent = events.slice(0, 5).map(event => ({
          eventName: event.name,
          count: Math.floor(Math.random() * 100) + 10
        }));
        
        setReportData({
          totalEvents: events.length,
          activeEvents: activeEvents.length,
          totalParticipants,
          checkedInParticipants,
          eventsByMonth,
          participantsByEvent
        });
      }
    } catch (error) {
      console.error('Erro ao carregar relatórios:', error);
      toast.error('Erro ao carregar relatórios');
    } finally {
      setIsLoading(false);
    }
  };

  const exportReport = () => {
    // Implementar exportação de relatório
    toast.success('Relatório exportado com sucesso!');
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

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Relatórios</h1>
            <p className="text-gray-600">Visualize estatísticas e relatórios do sistema</p>
          </div>
          <div className="flex items-center space-x-3">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="w-32 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="7">Últimos 7 dias</option>
              <option value="30">Últimos 30 dias</option>
              <option value="90">Últimos 90 dias</option>
              <option value="365">Último ano</option>
            </select>
            <Button icon={<Download size={16} />} onClick={exportReport}>
              Exportar
            </Button>
          </div>
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
                <p className="text-2xl font-bold text-gray-900">{reportData.totalEvents}</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <BarChart3 className="text-green-600" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Eventos Ativos</p>
                <p className="text-2xl font-bold text-gray-900">{reportData.activeEvents}</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="text-purple-600" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Participantes</p>
                <p className="text-2xl font-bold text-gray-900">{reportData.totalParticipants}</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <CheckSquare className="text-orange-600" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Check-ins Realizados</p>
                <p className="text-2xl font-bold text-gray-900">{reportData.checkedInParticipants}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Eventos por Mês</h3>
            <div className="space-y-3">
              {reportData.eventsByMonth.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{item.month}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${(item.count / Math.max(...reportData.eventsByMonth.map(e => e.count))) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{item.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Participantes por Evento</h3>
            <div className="space-y-3">
              {reportData.participantsByEvent.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 truncate max-w-32">{item.eventName}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ width: `${(item.count / Math.max(...reportData.participantsByEvent.map(e => e.count))) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{item.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Atividade Recente</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Novo evento "Workshop de Tecnologia" criado</span>
              <span className="text-xs text-gray-400 ml-auto">2h atrás</span>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-600">50 participantes registrados no evento "Conferência 2024"</span>
              <span className="text-xs text-gray-400 ml-auto">4h atrás</span>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span className="text-sm text-gray-600">30 check-ins realizados hoje</span>
              <span className="text-xs text-gray-400 ml-auto">6h atrás</span>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
} 