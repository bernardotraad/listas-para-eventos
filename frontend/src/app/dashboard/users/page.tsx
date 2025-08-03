'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { apiService } from '@/services/api';
import { User } from '@/types';
import { Card, Table, Button } from '@/components';
import { Plus, Edit, Trash2, User as UserIcon, Shield, Calendar } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function UsersPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      const response = await apiService.getAllUsers();
      if (response.success && response.data) {
        setUsers(response.data);
      }
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
      toast.error('Erro ao carregar usuários');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    // Não permitir excluir o próprio usuário
    if (selectedUser.id === currentUser?.id) {
      toast.error('Você não pode excluir sua própria conta');
      setShowDeleteModal(false);
      setSelectedUser(null);
      return;
    }

    try {
      const response = await apiService.deleteUser(selectedUser.id);
      if (response.success) {
        toast.success('Usuário excluído com sucesso!');
        setUsers(users.filter(u => u.id !== selectedUser.id));
        setShowDeleteModal(false);
        setSelectedUser(null);
      }
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
      toast.error('Erro ao excluir usuário');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'portaria': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  };

  const userColumns = [
    { key: 'full_name', header: 'Nome' },
    { key: 'username', header: 'Usuário' },
    { key: 'email', header: 'Email' },
    { 
      key: 'role', 
      header: 'Perfil', 
      render: (user: User) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
          {user.role === 'admin' ? 'Administrador' : 'Portaria'}
        </span>
      )
    },
    { 
      key: 'is_active', 
      header: 'Status', 
      render: (user: User) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.is_active)}`}>
          {user.is_active ? 'Ativo' : 'Inativo'}
        </span>
      )
    },
    { 
      key: 'created_at', 
      header: 'Criado em', 
      render: (user: User) => (
        <div className="flex items-center space-x-1">
          <Calendar size={16} className="text-gray-400" />
          <span>{formatDate(user.created_at)}</span>
        </div>
      )
    },
    {
      key: 'actions',
      header: 'Ações',
      render: (user: User) => (
        <div className="flex items-center space-x-2">
          <Link
            href={`/dashboard/users/${user.id}/edit`}
            className="p-1 text-green-600 hover:text-green-800 transition-colors"
            title="Editar"
          >
            <Edit size={16} />
          </Link>
          {user.id !== currentUser?.id && (
            <button
              onClick={() => {
                setSelectedUser(user);
                setShowDeleteModal(true);
              }}
              className="p-1 text-red-600 hover:text-red-800 transition-colors"
              title="Excluir"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      )
    }
  ];

  const stats = {
    total: users.length,
    admins: users.filter(u => u.role === 'admin').length,
    portaria: users.filter(u => u.role === 'portaria').length,
    active: users.filter(u => u.is_active).length,
    inactive: users.filter(u => !u.is_active).length
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gerenciar Usuários</h1>
            <p className="text-gray-600">Gerencie usuários e permissões do sistema</p>
          </div>
          <Link href="/dashboard/users/new">
            <Button icon={<Plus size={16} />}>
              Novo Usuário
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <Card>
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <UserIcon className="text-blue-600" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Shield className="text-purple-600" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Administradores</p>
                <p className="text-2xl font-bold text-gray-900">{stats.admins}</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <UserIcon className="text-green-600" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Portaria</p>
                <p className="text-2xl font-bold text-gray-900">{stats.portaria}</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <div className="w-6 h-6 bg-green-500 rounded-full"></div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Ativos</p>
                <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <div className="w-6 h-6 bg-red-500 rounded-full"></div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Inativos</p>
                <p className="text-2xl font-bold text-gray-900">{stats.inactive}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Users Table */}
        <Card>
          <Table
            data={users}
            columns={userColumns}
            loading={isLoading}
            emptyMessage="Nenhum usuário encontrado"
          />
        </Card>

        {/* Delete Modal */}
        {showDeleteModal && selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Confirmar Exclusão
              </h3>
              <p className="text-gray-600 mb-6">
                Tem certeza que deseja excluir o usuário "{selectedUser.full_name}"? 
                Esta ação não pode ser desfeita.
              </p>
              <div className="flex justify-end space-x-3">
                <Button
                  variant="secondary"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedUser(null);
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  variant="danger"
                  onClick={handleDeleteUser}
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