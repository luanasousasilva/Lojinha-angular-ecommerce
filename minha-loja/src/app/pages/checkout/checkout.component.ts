import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomValidators } from '../../validators/custom.validators';
import { Store } from '@ngrx/store';
import { Router, RouterLink } from '@angular/router';
import * as CartActions from '../../store/cart.actions';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent {
  checkoutForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private router: Router
  ) {
    this.checkoutForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.minLength(10)]],
      address: ['', [Validators.required, Validators.minLength(5)]],
      cardNumber: ['', [
        Validators.required,
        Validators.minLength(16),
        Validators.maxLength(16),
        CustomValidators.numeric
      ]],
      expiryDate: ['', [
        Validators.required,
        Validators.pattern(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/)
      ]],
      securityCode: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(3),
        CustomValidators.numeric
      ]]
    });
  }

  onSubmit() {
    if (this.checkoutForm.valid) {
      console.log('Formulário enviado:', this.checkoutForm.value);
      this.store.dispatch(CartActions.clearCart());
      alert('Compra realizada com sucesso! Obrigado pela preferência.');
      this.router.navigate(['/']);
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched() {
    Object.keys(this.checkoutForm.controls).forEach(key => {
      const control = this.checkoutForm.get(key);
      control?.markAsTouched();
    });
  }
  goToPayment(): void {
    this.router.navigate(['/payment']);
  }
}
