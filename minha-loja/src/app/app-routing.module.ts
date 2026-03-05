import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';


export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/product-list/product-list.component').then(c => c.ProductListComponent)
  },
  {
    path: 'product/:id',
    loadComponent: () => import('./pages/product-detail/product-detail.component').then(c => c.ProductDetailComponent)
  },
  {
    path: 'cart',
    loadComponent: () => import('./pages/shopping-cart/shopping-cart.component').then(c => c.ShoppingCartComponent)
  },
  {
    path: 'checkout',
    loadComponent: () => import('./pages/checkout/checkout.component').then(c => c.CheckoutComponent),
    canActivate: [authGuard]
  },
  {
    path: 'payment',
    loadComponent: () => import('./pages/payment-gateway/payment-gateway.component').then(c => c.PaymentGatewayComponent),
    canActivate: [authGuard]
  },
  {
    path: 'contact',
    loadComponent: () => import('./pages/contact/contact.component').then(c => c.ContactComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(c => c.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.component').then(c => c.RegisterComponent)
  },
  {
    path: 'admin',
    loadComponent: () => import('./pages/admin/admin.component').then(c => c.AdminComponent),
    canActivate: [authGuard, adminGuard]
  },
  {
    path: 'admin/products',
    loadComponent: () => import('./pages/admin-products/admin-products.component').then(c => c.AdminProductsComponent),
    canActivate: [authGuard, adminGuard]
  },
  {
    path: 'admin/products/new',
    loadComponent: () => import('./pages/product-form/product-form.component').then(c => c.ProductFormComponent),
    canActivate: [authGuard, adminGuard]
  },
  {
    path: 'admin/products/edit/:id',
    loadComponent: () => import('./pages/product-form/product-form.component').then(c => c.ProductFormComponent),
    canActivate: [authGuard, adminGuard]
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
