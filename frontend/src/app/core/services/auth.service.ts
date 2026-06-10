import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface User {
  id: string;
  nombre: string;
  email: string;
  rol: 'reportante' | 'tecnico' | 'supervisor';
  chatId?: string | null;
}

export interface LoginResponse {
  token: string;
  user: User;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = `${environment.apiUrl}/auth`;

  // Signals for state
  currentUserSignal = signal<User | null>(null);
  
  isAuthenticated = computed(() => this.currentUserSignal() !== null);
  userEmail = computed(() => this.currentUserSignal()?.email || '');
  userNombre = computed(() => this.currentUserSignal()?.nombre || '');
  userRol = computed(() => this.currentUserSignal()?.rol || '');

  constructor() {
    this.loadSession();
  }

  private loadSession(): void {
    const token = localStorage.getItem('jwt_token');
    const userStr = localStorage.getItem('user_data');
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr) as User;
        this.currentUserSignal.set(user);
      } catch (e) {
        this.clearSession();
      }
    }
  }

  register(nombre: string, email: string, password: string): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/register`, { nombre, email, password });
  }

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((res) => {
        localStorage.setItem('jwt_token', res.token);
        localStorage.setItem('user_data', JSON.stringify(res.user));
        this.currentUserSignal.set(res.user);
      })
    );
  }

  forgotPassword(email: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/forgot-password`, { email });
  }

  resetPassword(token: string, password: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/reset-password`, { token, password });
  }

  logout(): void {
    this.clearSession();
    this.router.navigate(['/login']);
  }

  private clearSession(): void {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user_data');
    this.currentUserSignal.set(null);
  }

  getToken(): string | null {
    return localStorage.getItem('jwt_token');
  }
}
