import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomValidators } from '../../validators/custom.validators';
import {Router, RouterLink} from "@angular/router";

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,RouterLink],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {
  contactForm: FormGroup;
  submitted = false;

  constructor(private fb: FormBuilder,  private router: Router) {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, CustomValidators.phone]],
      subject: ['', Validators.required],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  onSubmit() {
    this.submitted = true;

    if (this.contactForm.valid) {
      console.log('Formulário de contato enviado:', this.contactForm.value);
      alert('Mensagem enviada com sucesso! Entraremos em contato em breve.');
      this.contactForm.reset();
      this.submitted = false;
    }
  }

  get f() { return this.contactForm.controls; }
}

