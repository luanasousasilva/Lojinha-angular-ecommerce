import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from "../../services/auth.service";
import { AdminService } from "../../services/admin.service";
import { ProductManagementService } from "../../services/product-management.service";

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.css'
})
export class ProductFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private adminService = inject(AdminService);
  private productManagementService = inject(ProductManagementService);
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  productForm: FormGroup;
  isEditMode = false;
  productId: number | null = null;
  isLoading = false;
  categories: string[] = [];
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;

  constructor() {
    this.productForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      price: ['', [Validators.required, Validators.min(0.01)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      category: ['', Validators.required],
      image: ['', Validators.required],
      stock: [10, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    this.loadCategories();

    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.productId = +params['id'];
        this.loadProductData();
      }
    });
  }

  loadCategories(): void {
    this.adminService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => {
        console.error('Erro ao carregar categorias:', error);
        this.categories = ['electronics', 'jewelery', "men's clothing", "women's clothing"];
      }
    });
  }

  loadProductData(): void {
    if (this.productId) {
      this.isLoading = true;

      const customProduct = this.productManagementService.getProductById(this.productId);
      if (customProduct && this.productManagementService.isCustomProduct(customProduct)) {
        this.productForm.patchValue({
          title: customProduct.title,
          price: customProduct.price,
          description: customProduct.description,
          category: customProduct.category,
          image: customProduct.image,
          stock: customProduct.stock || 10
        });
        this.imagePreview = customProduct.image;
        this.isLoading = false;
      } else {
        this.adminService.getProductById(this.productId).subscribe({
          next: (product) => {
            this.productForm.patchValue({
              title: product.title,
              price: product.price,
              description: product.description,
              category: product.category,
              image: product.image,
              stock: product.stock || 10
            });
            this.imagePreview = product.image;
            this.isLoading = false;
          },
          error: (error) => {
            console.error('Erro ao carregar produto:', error);
            this.isLoading = false;
          }
        });
      }
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Validar tipo de arquivo
      if (!file.type.startsWith('image/')) {
        alert('Por favor, selecione apenas arquivos de imagem.');
        return;
      }

      // Validar tamanho do arquivo (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('A imagem deve ter no máximo 5MB.');
        return;
      }

      this.selectedFile = file;

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
        this.productForm.patchValue({
          image: reader.result as string
        });
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(): void {
    this.selectedFile = null;
    this.imagePreview = null;
    this.productForm.patchValue({
      image: ''
    });
    // Reset file input
    const fileInput = document.getElementById('imageFile') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  }

  onImageError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    imgElement.style.display = 'none';
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      this.isLoading = true;
      const productData = this.productForm.value;
      const currentUser = this.authService.getCurrentUser();

      const enhancedProductData = {
        ...productData,
        rating: { rate: 4.5, count: 0 },
        createdAt: new Date().toISOString().split('T')[0],
        createdBy: currentUser?.id,
        isCustom: true,
        source: 'custom'
      };

      if (this.isEditMode && this.productId) {
        const existingProduct = this.productManagementService.getProductById(this.productId);
        if (existingProduct && this.productManagementService.isCustomProduct(existingProduct)) {
          this.productManagementService.updateProduct(this.productId, enhancedProductData);
          this.isLoading = false;
          alert('Produto atualizado com sucesso!');
          this.router.navigate(['/admin/products']);
        } else {
          alert('Este produto não pode ser editado pois não é um produto customizado.');
          this.isLoading = false;
        }
      } else {
        this.productManagementService.addProduct(enhancedProductData);
        this.isLoading = false;
        alert('Produto adicionado com sucesso!');
        this.router.navigate(['/admin/products']);
      }
    } else {
      Object.keys(this.productForm.controls).forEach(key => {
        this.productForm.get(key)?.markAsTouched();
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/admin/products']);
  }

  goToAdmin(): void {
    this.router.navigate(['/admin']);
  }
}
