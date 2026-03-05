import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./components/header/header.component";
import { FooterComponent } from './components/footer/footer.component';
import { AuthService } from './services/auth.service';
import { TranslationService } from './services/translation.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'loja-angular';

  constructor(
    private authService: AuthService,
    private translationService: TranslationService
  ) {}

  ngOnInit(): void {
    this.authService.initializeUser();
    this.translationService.initializeLanguage();
  }
}
