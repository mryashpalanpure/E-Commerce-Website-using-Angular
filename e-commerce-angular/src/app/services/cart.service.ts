import { Injectable, computed, inject, signal } from '@angular/core';
import { CartItem, Product } from '../app.models';
import { StorageService } from './storage.service';

const CART_KEY = 'cart';

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly storage = inject(StorageService);
  readonly items = signal<CartItem[]>(this.storage.getItem<CartItem[]>(CART_KEY, []));
  readonly totalItems = computed(() => this.items().reduce((total, item) => total + item.quantity, 0));
  readonly totalPrice = computed(() => this.items().reduce((total, item) => total + item.price * item.quantity, 0));

  addToCart(product: Product): void {
    const items = [...this.items()];
    const existing = items.find((item) => item.id === product.id);

    if (existing) {
      existing.quantity += 1;
    } else {
      items.push({ ...product, quantity: 1 });
    }

    this.save(items);
  }

  updateQuantity(productId: number, change: number): void {
    const items = this.items()
      .map((item) => item.id === productId ? { ...item, quantity: item.quantity + change } : item)
      .filter((item) => item.quantity > 0);

    this.save(items);
  }

  removeItem(productId: number): void {
    this.save(this.items().filter((item) => item.id !== productId));
  }

  clearCart(): void {
    this.save([]);
  }

  private save(items: CartItem[]): void {
    this.storage.setItem(CART_KEY, items);
    this.items.set(items);
  }
}
