import { Component, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart-page',
  imports: [CurrencyPipe],
  templateUrl: './cart.page.html',
  styleUrl: './cart.page.css'
})
export class CartPage {
  protected readonly cartService = inject(CartService);
  private readonly router = inject(Router);

  protected updateQuantity(productId: number, change: number): void {
    this.cartService.updateQuantity(productId, change);
  }

  protected removeItem(productId: number): void {
    this.cartService.removeItem(productId);
  }

  protected clearCart(): void {
    this.cartService.clearCart();
  }

  protected checkout(): void {
    const total = this.cartService.totalPrice();
    const confirmed = confirm(`Your total amount is ₹${total.toFixed(2)} . Do you want to place your order?`);

    if (confirmed) {
      void this.router.navigateByUrl('/checkout');
    }
  }
}
