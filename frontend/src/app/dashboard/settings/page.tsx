'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { apiService } from '@/services/api';
import { Card, Button, Input } from '@/components';
import { Settings, User, Lock, Bell, Shield } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import toast from 'react-hot-toast';

interface SettingsData {
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  privacy: {
    profileVisibility: 'public' | 'private';
    dataSharing: boolean;
  };
  security: {
    twoFactorAuth: boolean;
    sessionTimeout: number;
  };
}

export default function SettingsPage() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState<SettingsData>({
    notifications: {
      email: true,
      push: false,
      sms: false
    },
    privacy: {
      profileVisibility: 'public',
      dataSharing: false
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: 30
    }
  });

  const handleNotificationChange = (type: keyof SettingsData['notifications'], value: boolean) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [type]: value
      }
    }));
  };

  const handlePrivacyChange = (type: keyof SettingsData['privacy'], value: string | boolean) => {
    setSettings(prev => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [type]: value
      }
    }));
  };

  const handleSecurityChange = (type: keyof SettingsData['security'], value: boolean | number) => {
    setSettings(prev => ({
      ...prev,
      security: {
        ...prev.security,
        [type]: value
      }
    }));
  };

  const saveSettings = async () => {
    try {
      setIsLoading(true);
      // Implementar salvamento das configurações no backend
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simular API call
      toast.success('Configurações salvas com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      toast.error('Erro ao salvar configurações');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>
          <p className="text-gray-600">Gerencie suas preferências e configurações do sistema</p>
        </div>

        {/* Profile Settings */}
        <Card>
          <div className="flex items-center space-x-3 mb-6">
            <User className="text-blue-600" size={24} />
            <h3 className="text-lg font-medium text-gray-900">Perfil do Usuário</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome Completo
              </label>
              <Input
                type="text"
                value={user?.full_name || ''}
                disabled
                className="bg-gray-50"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome de Usuário
              </label>
              <Input
                type="text"
                value={user?.username || ''}
                disabled
                className="bg-gray-50"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <Input
                type="email"
                value={user?.email || ''}
                disabled
                className="bg-gray-50"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Perfil
              </label>
              <Input
                type="text"
                value={user?.role === 'admin' ? 'Administrador' : 'Portaria'}
                disabled
                className="bg-gray-50"
              />
            </div>
          </div>
        </Card>

        {/* Notification Settings */}
        <Card>
          <div className="flex items-center space-x-3 mb-6">
            <Bell className="text-green-600" size={24} />
            <h3 className="text-lg font-medium text-gray-900">Notificações</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">Notificações por Email</p>
                <p className="text-sm text-gray-600">Receba notificações importantes por email</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifications.email}
                  onChange={(e) => handleNotificationChange('email', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">Notificações Push</p>
                <p className="text-sm text-gray-600">Receba notificações em tempo real</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifications.push}
                  onChange={(e) => handleNotificationChange('push', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">Notificações SMS</p>
                <p className="text-sm text-gray-600">Receba notificações por SMS</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifications.sms}
                  onChange={(e) => handleNotificationChange('sms', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </Card>

        {/* Privacy Settings */}
        <Card>
          <div className="flex items-center space-x-3 mb-6">
            <Shield className="text-purple-600" size={24} />
            <h3 className="text-lg font-medium text-gray-900">Privacidade</h3>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Visibilidade do Perfil
              </label>
              <select
                value={settings.privacy.profileVisibility}
                onChange={(e) => handlePrivacyChange('profileVisibility', e.target.value as 'public' | 'private')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="public">Público</option>
                <option value="private">Privado</option>
              </select>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">Compartilhamento de Dados</p>
                <p className="text-sm text-gray-600">Permitir compartilhamento de dados para melhorias do sistema</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.privacy.dataSharing}
                  onChange={(e) => handlePrivacyChange('dataSharing', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </Card>

        {/* Security Settings */}
        <Card>
          <div className="flex items-center space-x-3 mb-6">
            <Lock className="text-red-600" size={24} />
            <h3 className="text-lg font-medium text-gray-900">Segurança</h3>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">Autenticação de Dois Fatores</p>
                <p className="text-sm text-gray-600">Adicione uma camada extra de segurança à sua conta</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.security.twoFactorAuth}
                  onChange={(e) => handleSecurityChange('twoFactorAuth', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Timeout da Sessão (minutos)
              </label>
              <select
                value={settings.security.sessionTimeout}
                onChange={(e) => handleSecurityChange('sessionTimeout', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value={15}>15 minutos</option>
                <option value={30}>30 minutos</option>
                <option value={60}>1 hora</option>
                <option value={120}>2 horas</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button 
            onClick={saveSettings} 
            disabled={isLoading}
            icon={<Settings size={16} />}
          >
            {isLoading ? 'Salvando...' : 'Salvar Configurações'}
          </Button>
        </div>
      </div>
    </Layout>
  );
} 