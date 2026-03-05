import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartStatusComponent } from '../cart-status/cart-status.component';
import { RouterLink } from "@angular/router";
import { AuthService } from '../../services/auth.service';
import { TranslationService } from '../../services/translation.service';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, CartStatusComponent, RouterLink, TranslatePipe],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  private authService = inject(AuthService);
  private translationService = inject(TranslationService);

  currentUser = this.authService.currentUser$;
  currentLang = this.translationService.currentLang$;

  switchLanguage(): void {
    const newLang = this.translationService.getCurrentLang() === 'pt' ? 'en' : 'pt';
    this.translationService.setLanguage(newLang);
  }

  logout(): void {
    this.authService.logout();
    window.location.reload();
  }
}
