// Tipos e interfaces para o frontend

export interface User {
  id: number;
  username: string;
  email: string;
  role: 'admin' | 'portaria';
  full_name: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Event {
  id: number;
  name: string;
  description?: string;
  location?: string;
  event_date: string;
  event_time?: string;
  capacity?: number;
  status: 'ativo' | 'cancelado' | 'finalizado';
  created_by: number;
  created_by_name?: string;
  created_at: string;
  updated_at: string;
}

export interface NameList {
  id: number;
  event_id: number;
  name: string;
  email?: string;
  phone?: string;
  checkin_status: 'pendente' | 'presente' | 'ausente';
  checkin_time?: string;
  checked_by?: number;
  checked_by_name?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

// DTOs para requisições
export interface LoginDto {
  username: string;
  password: string;
}

export interface CreateEventDto {
  name: string;
  description?: string;
  location?: string;
  event_date: string;
  event_time?: string;
  capacity?: number;
}

export interface CreateNameListDto {
  event_id: number;
  names: string[];
  emails?: string[];
  phones?: string[];
}

export interface CheckinDto {
  name_list_id: number;
  status: 'presente' | 'ausente';
  notes?: string;
}

// Respostas da API
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// Estados do formulário
export interface NameEntry {
  name: string;
  email?: string;
  phone?: string;
}

// Contexto de autenticação
export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
} 