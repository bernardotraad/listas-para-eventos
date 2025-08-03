'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { apiService } from '@/services/api';
import { CreateEventDto } from '@/types';
import { Card, Button, Input } from '@/components';
import { ArrowLeft, Save } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function NewEventPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<CreateEventDto>({
    name: '',
    description: '',
    event_date: '',
    event_time: '',
    location: '',
    status: 'ativo'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.event_date) {
      toast.error('Nome e data são obrigatórios');
      return;
    }

    try {
      setIsSaving(true);
      const response = await apiService.createEvent(formData);
      if (response.success && response.data) {
        toast.success('Evento criado com sucesso!');
        router.push(`/dashboard/events/${response.data.id}`);
      } else {
        toast.error(response.error || 'Erro ao criar evento');
      }
    } catch (error) {
      console.error('Erro ao criar evento:', error);
      toast.error('Erro ao criar evento');
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

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Link href="/dashboard/events">
            <Button variant="secondary" icon={<ArrowLeft size={16} />}>
              Voltar
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Novo Evento</h1>
            <p className="text-gray-600">Crie um novo evento no sistema</p>
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
              <Link href="/dashboard/events">
                <Button variant="secondary" type="button">
                  Cancelar
                </Button>
              </Link>
              <Button type="submit" icon={<Save size={16} />} disabled={isSaving}>
                {isSaving ? 'Criando...' : 'Criar Evento'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </Layout>
  );
} 