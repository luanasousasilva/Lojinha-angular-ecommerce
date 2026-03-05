import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Product } from '../../../types';
import { TranslatePipe } from "../../pipes/translate.pipe";
import { ProductManagementService } from "../../services/product-management.service";
import { AdminService } from "../../services/admin.service";
import {TruncatePipe} from "../../pipes/truncate.pipe";

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, TruncatePipe, TranslatePipe],
  templateUrl: './admin-products.component.html',
  styleUrl: './admin-products.component.css'
})
export class AdminProductsComponent implements OnInit {
  private productManagementService = inject(ProductManagementService);
  private adminService = inject(AdminService);
  private router = inject(Router);

  products: Product[] = [];
  apiProducts: Product[] = [];
  customProducts: Product[] = [];
  showDeleteModal = false;
  productToDelete: number | null = null;
  isLoading = true;

  ngOnInit(): void {
    this.loadAllProducts();
  }

  loadAllProducts(): void {
    this.isLoading = true;

    this.adminService.getProducts().subscribe({
      next: (apiProducts) => {
        this.apiProducts = apiProducts.map(product => ({
          ...product,
          isCustom: false,
          source: 'api'
        }));

        this.productManagementService.getProducts().subscribe({
          next: (allProducts) => {
            this.customProducts = allProducts.filter(product =>
              this.productManagementService.isCustomProduct(product)
            );
            this.products = [...this.apiProducts, ...this.customProducts];
            this.isLoading = false;
          },
          error: (error) => {
            console.error('Erro ao carregar produtos customizados:', error);
            this.products = [...this.apiProducts];
            this.isLoading = false;
          }
        });
      },
      error: (error) => {
        console.error('Erro ao carregar produtos da API:', error);
        this.isLoading = false;
      }
    });
  }

  addProduct(): void {
    this.router.navigate(['/admin/products/new']);
  }

  editProduct(id: number): void {
    const product = this.products.find(p => p.id === id);
    if (product && this.isCustomProduct(product)) {
      this.router.navigate(['/admin/products/edit', id]);
    } else {
      alert('Este produto é da API FakeStore e não pode ser editado. Adicione um produto customizado para editar.');
    }
  }

  deleteProduct(id: number): void {
    const product = this.products.find(p => p.id === id);
    if (product && this.isCustomProduct(product)) {
      this.productToDelete = id;
      this.showDeleteModal = true;
    } else {
      alert('Este produto é da API FakeStore e não pode ser excluído. Você só pode excluir produtos que você adicionou.');
    }
  }

  handleModalResponse(): void {
    if (this.productToDelete) {
      this.productManagementService.deleteProduct(this.productToDelete);
      this.showDeleteModal = false;
      this.productToDelete = null;
      this.loadAllProducts();
    }
  }

  cancelDelete(): void {
    this.showDeleteModal = false;
    this.productToDelete = null;
  }

  goToStore(): void {
    this.router.navigate(['/']);
  }

  getCustomProductsStock(): number {
    return this.customProducts.reduce((sum, product) => sum + (product.stock || 0), 0);
  }

  isCustomProduct(product: Product): boolean {
    return this.productManagementService.isCustomProduct(product);
  }
}
