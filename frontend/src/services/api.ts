import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { 
  ApiResponse, 
  Event, 
  NameList, 
  AuthResponse, 
  CreateEventDto, 
  CreateNameListDto,
  CheckinDto,
  User 
} from '@/types';

// Configuração base do axios
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Interceptor para adicionar token de autenticação
    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Interceptor para tratamento de erros
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Métodos de autenticação
  async login(username: string, password: string): Promise<ApiResponse<AuthResponse>> {
    const response: AxiosResponse<ApiResponse<AuthResponse>> = await this.api.post('/auth/login', {
      username,
      password,
    });
    return response.data;
  }

  async verifyToken(): Promise<ApiResponse<User>> {
    const response: AxiosResponse<ApiResponse<User>> = await this.api.get('/auth/verify');
    return response.data;
  }

  // Métodos de eventos
  async getActiveEvents(): Promise<ApiResponse<Event[]>> {
    const response: AxiosResponse<ApiResponse<Event[]>> = await this.api.get('/events/active');
    return response.data;
  }

  async getEventById(id: number): Promise<ApiResponse<Event>> {
    const response: AxiosResponse<ApiResponse<Event>> = await this.api.get(`/events/${id}`);
    return response.data;
  }

  async getAllEvents(): Promise<ApiResponse<Event[]>> {
    const response: AxiosResponse<ApiResponse<Event[]>> = await this.api.get('/events');
    return response.data;
  }

  async createEvent(eventData: CreateEventDto): Promise<ApiResponse<Event>> {
    const response: AxiosResponse<ApiResponse<Event>> = await this.api.post('/events', eventData);
    return response.data;
  }

  async updateEvent(id: number, eventData: Partial<CreateEventDto>): Promise<ApiResponse<Event>> {
    const response: AxiosResponse<ApiResponse<Event>> = await this.api.put(`/events/${id}`, eventData);
    return response.data;
  }

  async deleteEvent(id: number): Promise<ApiResponse<null>> {
    const response: AxiosResponse<ApiResponse<null>> = await this.api.delete(`/events/${id}`);
    return response.data;
  }

  async getEventStats(id: number): Promise<ApiResponse<any>> {
    const response: AxiosResponse<ApiResponse<any>> = await this.api.get(`/events/${id}/stats`);
    return response.data;
  }

  // Métodos de listas de nomes
  async submitNames(nameData: CreateNameListDto): Promise<ApiResponse<{
    inserted: NameList[];
    errors: string[];
    event: Event;
  }>> {
    const response: AxiosResponse<ApiResponse<{
      inserted: NameList[];
      errors: string[];
      event: Event;
    }>> = await this.api.post('/name-lists/submit', nameData);
    return response.data;
  }

  async getEventNames(eventId: number, filters?: { status?: string; search?: string }): Promise<ApiResponse<NameList[]>> {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.search) params.append('search', filters.search);

    const response: AxiosResponse<ApiResponse<NameList[]>> = await this.api.get(
      `/name-lists/event/${eventId}?${params.toString()}`
    );
    return response.data;
  }

  async checkinParticipant(nameListId: number, checkinData: CheckinDto): Promise<ApiResponse<NameList>> {
    const response: AxiosResponse<ApiResponse<NameList>> = await this.api.put(
      `/name-lists/${nameListId}/checkin`,
      checkinData
    );
    return response.data;
  }

  async addSingleName(eventId: number, nameData: { name: string; email?: string; phone?: string }): Promise<ApiResponse<NameList>> {
    const response: AxiosResponse<ApiResponse<NameList>> = await this.api.post(
      `/name-lists/event/${eventId}/add`,
      nameData
    );
    return response.data;
  }

  async searchParticipant(eventId: number, name: string): Promise<ApiResponse<NameList[]>> {
    const response: AxiosResponse<ApiResponse<NameList[]>> = await this.api.get(
      `/name-lists/event/${eventId}/search?name=${encodeURIComponent(name)}`
    );
    return response.data;
  }

  // Métodos de usuários (apenas admin)
  async getAllUsers(): Promise<ApiResponse<User[]>> {
    const response: AxiosResponse<ApiResponse<User[]>> = await this.api.get('/users');
    return response.data;
  }

  async getUserById(id: number): Promise<ApiResponse<User>> {
    const response: AxiosResponse<ApiResponse<User>> = await this.api.get(`/users/${id}`);
    return response.data;
  }

  async updateUser(id: number, userData: Partial<User>): Promise<ApiResponse<User>> {
    const response: AxiosResponse<ApiResponse<User>> = await this.api.put(`/users/${id}`, userData);
    return response.data;
  }

  async deleteUser(id: number): Promise<ApiResponse<null>> {
    const response: AxiosResponse<ApiResponse<null>> = await this.api.delete(`/users/${id}`);
    return response.data;
  }

  // Método de health check
  async healthCheck(): Promise<ApiResponse<any>> {
    const response: AxiosResponse<ApiResponse<any>> = await this.api.get('/health');
    return response.data;
  }
}

// Instância singleton do serviço de API
export const apiService = new ApiService();
export default apiService; 