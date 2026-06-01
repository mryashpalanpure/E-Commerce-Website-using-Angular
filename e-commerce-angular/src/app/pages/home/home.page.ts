import { Component, computed, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Router } from '@angular/router';
import { Product } from '../../app.models';
import { CartService } from '../../services/cart.service';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-home-page',
  imports: [CurrencyPipe],
  templateUrl: './home.page.html',
  styleUrl: './home.page.css'
})
export class HomePage {
  private readonly productService = inject(ProductService);
  private readonly cartService = inject(CartService);
  private readonly router = inject(Router);

  protected readonly products = signal<Product[]>([]);
  protected readonly isLoading = signal(true);
  protected readonly errorMessage = signal('');
  protected readonly searchTerm = signal('');
  protected readonly filteredProducts = computed(() => {
    const query = this.searchTerm().trim().toLowerCase();

    if (!query) {
      return this.products();
    }

    return this.products().filter((product) =>
      product.title.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query)
    );
  });

  constructor() {
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products.set(products);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Products could not be loaded. Please check your internet connection and try again.');
        this.isLoading.set(false);
      }
    });
  }

  protected addToCart(product: Product): void {
    this.cartService.addToCart(product);
    void this.router.navigateByUrl('/cart');
  }
}
