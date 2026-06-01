import { Component, computed, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from './services/auth.service';
import { CartService } from './services/cart.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css'
})

export class App {
  private readonly authService = inject(AuthService);
  private readonly cartService = inject(CartService);
  private readonly router = inject(Router);
  protected readonly currentUser = this.authService.currentUser;
  protected readonly cartCount = computed(() => this.cartService.totalItems());
  protected readonly currentUrl = signal(this.router.url);
  protected readonly isAuthPage = computed(() => ['/login', '/signup'].includes(this.currentUrl()));
  protected readonly hideHeader = computed(() => this.isAuthPage() || ['/cart', '/checkout','/success'].includes(this.currentUrl()));

  constructor() {
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => this.currentUrl.set(event.urlAfterRedirects));
  }

  protected logout(): void {
    this.authService.logout();
  }
}
