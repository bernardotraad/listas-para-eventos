'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { apiService } from '@/services/api';
import { Card, Button, Input } from '@/components';
import { ArrowLeft, Save } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import toast from 'react-hot-toast';
import Link from 'next/link';

interface CreateUserDto {
  username: string;
  password: string;
  full_name: string;
  email: string;
  role: 'admin' | 'portaria';
  is_active: boolean;
}

export default function NewUserPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<CreateUserDto>({
    username: '',
    password: '',
    full_name: '',
    email: '',
    role: 'portaria',
    is_active: true
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.username.trim() || !formData.password.trim() || !formData.full_name.trim()) {
      toast.error('Usuário, senha e nome completo são obrigatórios');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    try {
      setIsSaving(true);
      const response = await apiService.createUser(formData);
      if (response.success) {
        toast.success('Usuário criado com sucesso!');
        router.push('/dashboard/users');
      } else {
        toast.error(response.error || 'Erro ao criar usuário');
      }
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      toast.error('Erro ao criar usuário');
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field: keyof CreateUserDto, value: string | boolean) => {
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
          <Link href="/dashboard/users">
            <Button variant="secondary" icon={<ArrowLeft size={16} />}>
              Voltar
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Novo Usuário</h1>
            <p className="text-gray-600">Crie um novo usuário no sistema</p>
          </div>
        </div>

        {/* Form */}
        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                  Nome de Usuário *
                </label>
                <Input
                  id="username"
                  type="text"
                  value={formData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  placeholder="Digite o nome de usuário"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Senha *
                </label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="Digite a senha"
                  required
                />
              </div>

              <div>
                <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-2">
                  Nome Completo *
                </label>
                <Input
                  id="full_name"
                  type="text"
                  value={formData.full_name}
                  onChange={(e) => handleInputChange('full_name', e.target.value)}
                  placeholder="Digite o nome completo"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Digite o email"
                />
              </div>

              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                  Perfil
                </label>
                <select
                  id="role"
                  value={formData.role}
                  onChange={(e) => handleInputChange('role', e.target.value as 'admin' | 'portaria')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="portaria">Portaria</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>

              <div>
                <label htmlFor="is_active" className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  id="is_active"
                  value={formData.is_active ? 'true' : 'false'}
                  onChange={(e) => handleInputChange('is_active', e.target.value === 'true')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="true">Ativo</option>
                  <option value="false">Inativo</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <Link href="/dashboard/users">
                <Button variant="secondary" type="button">
                  Cancelar
                </Button>
              </Link>
              <Button type="submit" icon={<Save size={16} />} disabled={isSaving}>
                {isSaving ? 'Criando...' : 'Criar Usuário'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </Layout>
  );
} 