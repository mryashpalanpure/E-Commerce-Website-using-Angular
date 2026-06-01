import { Injectable, inject, signal } from '@angular/core';
import { CustomerDetails, Order } from '../app.models';
import { CartService } from './cart.service';
import { StorageService } from './storage.service';

const ORDER_KEY = 'lastOrder';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly cartService = inject(CartService);
  private readonly storage = inject(StorageService);
  readonly lastOrder = signal<Order | null>(this.storage.getItem<Order | null>(ORDER_KEY, null));

  placeOrder(customer: CustomerDetails): Order {
    const order: Order = {
      id: `ORD-${Date.now()}`,
      createdAt: new Date().toISOString(),
      customer,
      items: this.cartService.items(),
      total: this.cartService.totalPrice()
    };

    this.storage.setItem(ORDER_KEY, order);
    this.lastOrder.set(order);
    this.cartService.clearCart();
    return order;
  }
}
