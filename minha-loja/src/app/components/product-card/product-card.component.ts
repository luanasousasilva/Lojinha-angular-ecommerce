import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Product } from '../../../types';
import { Store } from '@ngrx/store';
import * as CartActions from '../../store/cart.actions';
import { TruncatePipe } from "../../pipes/truncate.pipe";
import { OnSalePipe } from "../../pipes/on-sale.pipe";
import { AuthService } from "../../services/auth.service";
import { ProductManagementService } from "../../services/product-management.service";

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    TruncatePipe,
    OnSalePipe
  ],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css'
})
export class ProductCardComponent {
  @Input() product!: Product;
  @Input() showCategory: boolean = true;

  private authService = inject(AuthService);
  private store = inject(Store);
  private productManagementService = inject(ProductManagementService);

  isHovered = false;
  isAdmin = this.authService.isAdmin();
  showDeleteModal = false;

  get isOnSale(): boolean {
    return this.product.price < 50;
  }

  get ratingStars(): number[] {
    const rating = Math.round(this.product.rating?.rate || 0);
    return Array(rating).fill(0);
  }

  get canEdit(): boolean {
    return this.isAdmin && this.productManagementService.isCustomProduct(this.product);
  }

  addToCart(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.store.dispatch(CartActions.addProductToCart({ product: this.product }));
  }

  editProduct(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    if (this.canEdit) {
      window.location.href = `/admin/products/edit/${this.product.id}`;
    }
  }

  deleteProduct(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    if (this.canEdit) {
      this.showDeleteModal = true;
    }
  }

  onModalConfirmed(confirmed: boolean): void {
    if (confirmed && this.canEdit) {
      this.productManagementService.deleteProduct(this.product.id);
    }
    this.showDeleteModal = false;
  }
}
