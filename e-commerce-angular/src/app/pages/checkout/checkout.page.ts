import { Component, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-checkout-page',
  imports: [CurrencyPipe, ReactiveFormsModule, RouterLink],
  templateUrl: './checkout.page.html',
  styleUrl: './checkout.page.css'
})

export class CheckoutPage {
  private readonly formBuilder = inject(FormBuilder);
  private readonly orderService = inject(OrderService);
  private readonly router = inject(Router);
  protected readonly cartService = inject(CartService);

  protected readonly form = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required, Validators.pattern(/^[a-zA-Z ]+$/)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
    address: ['', [Validators.required, Validators.minLength(8)]]
  });

  protected submit(): void {
    this.form.markAllAsTouched();

    if (this.form.invalid || this.cartService.items().length === 0) {
      return;
    }

    this.orderService.placeOrder(this.form.getRawValue());
    void this.router.navigateByUrl('/order-success');
  }
}
