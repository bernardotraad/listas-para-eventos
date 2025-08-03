'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, AuthContextType } from '@/types';
import { apiService } from '@/services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Verificar token ao inicializar
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
          // Verificar se o token ainda é válido
          const response = await apiService.verifyToken();
          if (response.success && response.data) {
            setUser(response.data);
            setToken(storedToken);
          } else {
            // Token inválido, limpar storage
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          }
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (username: string, password: string) => {
    try {
      setIsLoading(true);
      console.log('🔐 Tentando fazer login com:', username);
      
      const response = await apiService.login(username, password);
      console.log('📡 Resposta da API:', response);
      
      if (response.success && response.data) {
        const { token: newToken, user: newUser } = response.data;
        
        // Salvar no localStorage
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(newUser));
        
        // Atualizar estado
        setToken(newToken);
        setUser(newUser);
        
        console.log('✅ Login realizado com sucesso!');
        toast.success('Login realizado com sucesso!');
        return true; // Indica sucesso
      } else {
        console.error('❌ Erro na resposta da API:', response);
        throw new Error(response.error || 'Erro no login');
      }
    } catch (error: any) {
      console.error('❌ Erro detalhado no login:', error);
      console.error('❌ Response data:', error.response?.data);
      console.error('❌ Response status:', error.response?.status);
      
      const errorMessage = error.response?.data?.error || error.message || 'Erro no login';
      console.error('❌ Mensagem de erro:', errorMessage);
      
      toast.error(errorMessage);
      return false; // Indica falha
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    // Limpar localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Limpar estado
    setToken(null);
    setUser(null);
    
    toast.success('Logout realizado com sucesso!');
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    logout,
    isLoading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 