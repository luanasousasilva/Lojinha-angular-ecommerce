import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { Product } from "../../types";

@Injectable({
  providedIn: 'root'
})
export class ProductManagementService {
  private productsSubject = new BehaviorSubject<Product[]>([]);
  public products$ = this.productsSubject.asObservable();
  private authService = inject(AuthService);

  constructor() {
    this.loadFromLocalStorage();
  }

  getProducts(): Observable<Product[]> {
    return this.products$;
  }

  getProductById(id: number): Product | undefined {
    return this.productsSubject.value.find(product => product.id === id);
  }

  isCustomProduct(product: Product): boolean {
    return product.isCustom === true && product.source === 'custom' && product.createdBy !== undefined;
  }

  getAdminProducts(): Product[] {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser?.role === 'admin') {
      return this.productsSubject.value.filter(product => this.isCustomProduct(product));
    }
    return [];
  }

  addProduct(product: Omit<Product, 'id'>): void {
    const currentUser = this.authService.getCurrentUser();
    const products = this.productsSubject.value;

    const newProduct: Product = {
      ...product,
      id: this.generateCustomId(),
      createdBy: currentUser?.id,
      isCustom: true,
      source: 'custom',
      rating: product.rating || { rate: 4.5, count: 0 },
      createdAt: new Date().toISOString().split('T')[0],
      stock: product.stock || 10
    };

    const updatedProducts = [...products, newProduct];
    this.productsSubject.next(updatedProducts);
    this.saveToLocalStorage();
    this.notifyProductChange();
  }

  updateProduct(id: number, updatedProduct: Partial<Product>): void {
    const products = this.productsSubject.value;
    const index = products.findIndex(product => product.id === id);

    if (index !== -1 && this.isCustomProduct(products[index])) {
      products[index] = {
        ...products[index],
        ...updatedProduct,
        isCustom: true,
        source: 'custom',
        id: id
      };
      this.productsSubject.next([...products]);
      this.saveToLocalStorage();
      this.notifyProductChange();
    }
  }

  deleteProduct(id: number): void {
    const product = this.productsSubject.value.find(p => p.id === id);
    if (product && this.isCustomProduct(product)) {
      const products = this.productsSubject.value.filter(product => product.id !== id);
      this.productsSubject.next(products);
      this.saveToLocalStorage();
      this.notifyProductChange();
    }
  }

  private generateCustomId(): number {
    const products = this.productsSubject.value;
    if (products.length === 0) {
      return -1;
    }
    const minId = Math.min(...products.map(p => p.id));
    return minId - 1;
  }

  private saveToLocalStorage(): void {
    const customProducts = this.productsSubject.value.filter(product =>
      this.isCustomProduct(product)
    );
    localStorage.setItem('customProducts', JSON.stringify(customProducts));
  }

  private loadFromLocalStorage(): void {
    const storedProducts = localStorage.getItem('customProducts');
    if (storedProducts) {
      try {
        const products = JSON.parse(storedProducts);
        this.productsSubject.next(products);
      } catch (error) {
        console.error('Erro ao carregar produtos do localStorage:', error);
        this.productsSubject.next([]);
      }
    }
  }

  private notifyProductChange(): void {
    this.productsSubject.next([...this.productsSubject.value]);
  }

  clearAllProducts(): void {
    this.productsSubject.next([]);
    localStorage.removeItem('customProducts');
  }
}
