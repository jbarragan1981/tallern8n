import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface IncidenciaStats {
  total: number;
  estados: { estado: string; count: number }[];
  severidades: { severidad: string; count: number }[];
  proyectos: { proyecto: string; count: number }[];
}

export interface Proyecto {
  id: string;
  nombre: string;
  activo: boolean;
}

export interface Incidencia {
  id: string;
  tipo: 'desarrollo' | 'novedad';
  proyectoId?: string | null;
  proyecto?: Proyecto | null;
  titulo: string;
  descripcion?: string | null;
  severidad: 'Alta' | 'Media' | 'Baja';
  estado: 'abierto' | 'en_progreso' | 'resuelto';
  reportadoPor?: { nombre: string; email: string } | null;
  asignadoA?: { nombre: string; email: string } | null;
  adjuntoUrl?: string | null;
  creadoEn: string;
  actualizadoEn: string;
}

@Injectable({
  providedIn: 'root',
})
export class IncidenciaService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getStats(): Observable<IncidenciaStats> {
    return this.http.get<IncidenciaStats>(`${this.apiUrl}/incidencias/stats`);
  }

  getIncidencias(): Observable<Incidencia[]> {
    return this.http.get<Incidencia[]>(`${this.apiUrl}/incidencias`);
  }

  updateEstado(id: string, estado: 'abierto' | 'en_progreso' | 'resuelto', comentario: string): Observable<Incidencia> {
    return this.http.patch<Incidencia>(`${this.apiUrl}/incidencias/${id}/estado`, { estado, comentario });
  }

  getProyectos(): Observable<Proyecto[]> {
    return this.http.get<Proyecto[]>(`${this.apiUrl}/proyectos`);
  }
}
