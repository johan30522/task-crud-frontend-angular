import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'task-confirm-delete',
  template: `
  <div class="modal-header">
    <h4 class="modal-title">Confirmar Eliminación</h4>
    <button type="button" class="btn-close" aria-label="Close" (click)="activeModal.dismiss('cancel')"></button>
  </div>
  <div class="modal-body">
    <p>¿Estás seguro que quieres eliminar la tarea <strong>{{ taskName }}</strong>?</p>
  </div>
  <div class="modal-footer">
    <button type="button" class="btn btn-secondary" (click)="activeModal.dismiss('cancel')">Cancelar</button>
    <button type="button" class="btn btn-danger" (click)="confirmDelete()">Eliminar</button>
  </div>
`
})
export class ConfirmDeleteComponent {
  @Input() taskName!: string;
  @Output() deleteConfirmed = new EventEmitter<void>();

  constructor(public activeModal: NgbActiveModal) {}

  confirmDelete() {
    this.deleteConfirmed.emit();
    this.activeModal.close('delete');
  }
}
