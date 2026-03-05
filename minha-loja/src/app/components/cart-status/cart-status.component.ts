import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { CartState } from '../../store/cart.state';

@Component({
  selector: 'app-cart-status',
  imports: [ CommonModule ],
  templateUrl: './cart-status.component.html',
  styleUrl: './cart-status.component.css'
})
export class CartStatusComponent {
  cartItemCount: Observable<number>;

  constructor(private store: Store<{ cart: CartState }>) {
    this.cartItemCount = this.store.select(state => state.cart.items.length);
  }
}
