import { Component, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-success-page',
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './success.page.html',
  styleUrl: './success.page.css'
})
export class SuccessPage {
  protected readonly orderService = inject(OrderService);
}