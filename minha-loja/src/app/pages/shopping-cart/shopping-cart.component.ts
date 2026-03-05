import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { RouterLink, Router } from "@angular/router";
import * as CartActions from '../../store/cart.actions';
import { CartItem } from "../../../types";
import { CartState } from '../../store/cart.state';

@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './shopping-cart.component.html',
  styleUrl: './shopping-cart.component.css'
})
export class ShoppingCartComponent {
  showRemoveModal = false;
  showClearModal = false;
  productIdToRemove: number | null = null;

  cartItems: Observable<CartItem[]>;
  cartTotal: Observable<number>;
  cartItemCount: Observable<number>;

  constructor(
    private router: Router,
    private store: Store<{ cart: CartState }>
  ) {
    this.cartItems = this.store.select(state => state.cart.items);
    this.cartTotal = this.store.select(state => state.cart.total);
    this.cartItemCount = this.store.select(state => state.cart.itemCount);
  }

  removeItem(productId: number) {
    this.productIdToRemove = productId;
    this.showRemoveModal = true;
  }

  clearCart() {
    this.showClearModal = true;
  }

  onModalConfirmed(confirmed: boolean) {
    if (confirmed) {
      if (this.showRemoveModal && this.productIdToRemove) {
        this.store.dispatch(CartActions.removeProductFromCart({ productId: this.productIdToRemove }));
      } else if (this.showClearModal) {
        this.store.dispatch(CartActions.clearCart());
      }
    }

    this.showRemoveModal = false;
    this.showClearModal = false;
    this.productIdToRemove = null;
  }

  increaseQuantity(productId: number) {
    this.store.dispatch(CartActions.increaseQuantity({ productId }));
  }

  decreaseQuantity(productId: number) {
    this.store.dispatch(CartActions.decreaseQuantity({ productId }));
  }

  goToCheckout() {
    this.router.navigate(['/checkout']);
  }
}
