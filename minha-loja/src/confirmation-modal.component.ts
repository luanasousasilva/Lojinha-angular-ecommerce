import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirmation-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal-overlay" (click)="onCancel()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h4 class="modal-title">Confirmação</h4>
          <button type="button" class="btn-close" (click)="onCancel()">×</button>
        </div>
        <div class="modal-body">
          <p>Tem certeza que deseja excluir este item?</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-cancel" (click)="onCancel()">
            Cancelar
          </button>
          <button type="button" class="btn btn-confirm" (click)="onConfirm()">
            Confirmar
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }

    .modal-content {
      background: white;
      border-radius: 12px;
      padding: 0;
      min-width: 400px;
      max-width: 90%;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .modal-header {
      padding: 1.5rem;
      border-bottom: 1px solid #e9ecef;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
      border-radius: 12px 12px 0 0;
    }

    .modal-title {
      margin: 0;
      color: #2c3e50;
      font-weight: 600;
    }

    .btn-close {
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      padding: 0;
      width: 30px;
      height: 30px;
      color: #6c757d;
      transition: color 0.3s ease;
    }

    .btn-close:hover {
      color: #dc3545;
    }

    .modal-body {
      padding: 2rem 1.5rem;
      text-align: center;
    }

    .modal-body p {
      margin: 0;
      font-size: 1.1rem;
      color: #495057;
    }

    .modal-footer {
      padding: 1.5rem;
      border-top: 1px solid #e9ecef;
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
    }

    .btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      min-width: 100px;
    }

    .btn-cancel {
      background: #6c757d;
      color: white;
    }

    .btn-cancel:hover {
      background: #5a6268;
      transform: translateY(-2px);
    }

    .btn-confirm {
      background: #dc3545;
      color: white;
    }

    .btn-confirm:hover {
      background: #c82333;
      transform: translateY(-2px);
    }
  `]
})
export class ConfirmationModalComponent {
  @Output() confirmed = new EventEmitter<boolean>();

  onConfirm() {
    this.confirmed.emit(true);
  }

  onCancel() {
    this.confirmed.emit(false);
  }
}
