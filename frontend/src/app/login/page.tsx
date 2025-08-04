'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button, Input, Card } from '@/components';
import { LogIn, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ username?: string; password?: string }>({});
  
  const { login, isLoading } = useAuth();
  const router = useRouter();

  const validateForm = () => {
    const newErrors: { username?: string; password?: string } = {};
    
    if (!username.trim()) {
      newErrors.username = 'Usuário é obrigatório';
    }
    
    if (!password.trim()) {
      newErrors.password = 'Senha é obrigatória';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const success = await login(username, password);
    if (success) {
      // Pequeno delay para mostrar o toast de sucesso
      setTimeout(() => {
        router.push('/dashboard');
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 py-6 sm:py-8">
      <div className="w-full max-w-sm sm:max-w-md">
        <Card className="shadow-xl border-0">
          <div className="text-center mb-6 sm:mb-8">
            <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 sm:mb-6">
              <LogIn className="text-blue-600" size={24} />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 leading-8 mb-2">Login</h1>
            <p className="text-sm sm:text-base text-gray-600 leading-6">Acesse sua conta</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <Input
              label="Usuário"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              error={errors.username}
              placeholder="Digite seu usuário"
              autoComplete="username"
              required
            />

            <div className="relative">
              <Input
                label="Senha"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
                placeholder="Digite sua senha"
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-10 sm:top-10 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <Button
              type="submit"
              className="w-full"
              loading={isLoading}
              disabled={isLoading}
              size="lg"
            >
              {!isLoading && <LogIn size={16} className="mr-2" />}
              Entrar
            </Button>
          </form>

          <div className="mt-6 sm:mt-8 text-center">
            <Link 
              href="/" 
              className="text-sm text-blue-600 hover:text-blue-500 transition-colors duration-200 leading-5"
            >
              ← Voltar para a página inicial
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
} 