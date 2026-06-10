import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IncidenciaService, Incidencia } from '../../core/services/incidencia.service';

@Component({
  selector: 'app-incidencias',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './incidencias.component.html',
  styleUrl: './incidencias.component.css',
})
export class IncidenciasComponent implements OnInit {
  private incidenciaService = inject(IncidenciaService);

  incidencias = signal<Incidencia[]>([]);
  isLoading = signal(true);
  errorMessage = signal<string | null>(null);

  // Status modification state
  selectedIncidencia = signal<Incidencia | null>(null);
  newEstado = signal<'abierto' | 'en_progreso' | 'resuelto'>('abierto');
  comentario = signal('');
  isUpdating = signal(false);
  updateError = signal<string | null>(null);

  ngOnInit(): void {
    this.loadIncidencias();
  }

  loadIncidencias(): void {
    this.isLoading.set(true);
    this.incidenciaService.getIncidencias().subscribe({
      next: (data) => {
        this.incidencias.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Error al obtener el listado de incidencias.');
        this.isLoading.set(false);
      },
    });
  }

  openChangeStatusModal(incidencia: Incidencia): void {
    this.selectedIncidencia.set(incidencia);
    this.newEstado.set(incidencia.estado);
    this.comentario.set('');
    this.updateError.set(null);
  }

  closeModal(): void {
    this.selectedIncidencia.set(null);
  }

  onSubmitStatusChange(): void {
    const inc = this.selectedIncidencia();
    if (!inc) return;

    if (!this.comentario() || this.comentario().length < 5) {
      this.updateError.set('La justificación debe tener al menos 5 caracteres');
      return;
    }

    this.isUpdating.set(true);
    this.updateError.set(null);

    this.incidenciaService.updateEstado(inc.id, this.newEstado(), this.comentario()).subscribe({
      next: () => {
        this.isUpdating.set(false);
        this.closeModal();
        this.loadIncidencias();
      },
      error: (err) => {
        this.isUpdating.set(false);
        this.updateError.set(err.error?.message || 'Error al actualizar el estado.');
      },
    });
  }
}
