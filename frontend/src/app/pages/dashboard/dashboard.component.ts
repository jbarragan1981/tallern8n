import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IncidenciaService, IncidenciaStats } from '../../core/services/incidencia.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  private incidenciaService = inject(IncidenciaService);

  stats = signal<IncidenciaStats | null>(null);
  isLoading = signal(true);
  errorMessage = signal<string | null>(null);

  // Computed properties / helpers for cards
  abiertasCount = signal(0);
  progresoCount = signal(0);
  resueltasCount = signal(0);

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.isLoading.set(true);
    this.incidenciaService.getStats().subscribe({
      next: (data) => {
        this.stats.set(data);
        
        // Extract states counts
        const abiertas = data.estados.find(e => e.estado === 'abierto')?.count || 0;
        const progreso = data.estados.find(e => e.estado === 'en_progreso')?.count || 0;
        const resueltas = data.estados.find(e => e.estado === 'resuelto')?.count || 0;
        
        this.abiertasCount.set(abiertas);
        this.progresoCount.set(progreso);
        this.resueltasCount.set(resueltas);

        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Error al cargar estadísticas del dashboard');
        this.isLoading.set(false);
      },
    });
  }
}
