import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from "@angular/router";
import { ProductService } from '../../services/product.service';
import { CategoryListComponent } from '../../components/category-list/category-list.component';
import { Product } from "../../../types";
import { ProductCardComponent } from "../../components/product-card/product-card.component";
import { Subscription } from 'rxjs';
import { AuthService } from "../../services/auth.service";
import { ProductManagementService } from "../../services/product-management.service";
import { TranslatePipe } from "../../pipes/translate.pipe";

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    CategoryListComponent,
    ProductCardComponent,
    TranslatePipe
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  apiProducts: Product[] = [];
  customProducts: Product[] = [];
  isAdmin = false;
  showOnlyMyProducts = false;
  isLoading = true;
  private productsSubscription!: Subscription;

  private productService = inject(ProductService);
  private authService = inject(AuthService);
  private productManagementService = inject(ProductManagementService);

  ngOnInit(): void {
    this.loadApiProducts();
    this.isAdmin = this.authService.isAdmin();

    this.productsSubscription = this.productManagementService.products$.subscribe(products => {
      this.customProducts = products.filter(product =>
        this.productManagementService.isCustomProduct(product)
      );
      this.updateProductsList();
      this.isLoading = false;
    });
  }

  ngOnDestroy(): void {
    if (this.productsSubscription) {
      this.productsSubscription.unsubscribe();
    }
  }

  loadApiProducts() {
    this.isLoading = true;
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.apiProducts = data.map(product => ({
          ...product,
          createdAt: '2024-01-01',
          stock: Math.floor(Math.random() * 100) + 1,
          isCustom: false,
          source: 'api'
        }));
        this.updateProductsList();
      },
      error: (error) => {
        console.error('Erro ao carregar produtos:', error);
        this.isLoading = false;
      }
    });
  }

  updateProductsList(): void {
    if (this.showOnlyMyProducts) {
      const currentUser = this.authService.getCurrentUser();
      this.products = this.customProducts.filter(product =>
        product.createdBy === currentUser?.id
      );
    } else {
      this.products = [...this.apiProducts, ...this.customProducts];
    }
  }

  toggleMyProducts(): void {
    this.showOnlyMyProducts = !this.showOnlyMyProducts;
    this.updateProductsList();
  }

  onCategorySelected(category: string){
    this.isLoading = true;
    this.productService.getProductsByCategory(category).subscribe({
      next: (data) => {
        const enhancedProducts = data.map(product => ({
          ...product,
          createdAt: '2024-01-01',
          stock: Math.floor(Math.random() * 100) + 1,
          isCustom: false,
          source: 'api'
        }));
        this.apiProducts = enhancedProducts;
        this.updateProductsList();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar produtos por categoria:', error);
        this.isLoading = false;
      }
    });
  }
}
