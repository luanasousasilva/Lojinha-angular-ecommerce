import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as CartActions from '../../store/cart.actions';
import { Product } from "../../../types";
import { CartState } from '../../store/cart.state';


@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent implements OnInit {
  product: Product | undefined;
  isZoomed: boolean = false;
  isInCart$: Observable<boolean>;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private store: Store<{ cart: CartState }>
  ) {
    this.isInCart$ = new Observable<boolean>(subscriber => subscriber.next(false));
  }


  addToCart() {
    if (this.product) {
      this.store.dispatch(CartActions.addProductToCart({ product: this.product }));
      console.log('Produto adicionado ao carrinho:', this.product);
      this.store.select(state => state.cart).subscribe(cart => {
        console.log('Estado do carrinho:', cart);
      });
    }
  }

  getRatingStars(): number[] {
    const rating = Math.round(this.product?.rating?.rate || 0);
    return Array(rating).fill(0);
  }

  getAvailabilityText(): string {
    const isAvailable = (this.product?.rating?.count || 0) > 0;
    return isAvailable ? 'Disponível em estoque' : 'Produto Indisponível';
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.productService.getProductById(+id).subscribe(data => {
        this.product = data;
        this.isInCart$ = this.store.select(state =>
          state.cart.items.some(item => item.id === this.product!.id));
        this.isInCart$.subscribe(isInCart => {
          console.log('Produto está no carrinho?', isInCart);
        });
      });
    }
  }
}
