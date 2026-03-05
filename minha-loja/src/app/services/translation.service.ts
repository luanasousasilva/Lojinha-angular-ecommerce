import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Translation {
  [key: string]: {
    [key: string]: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private currentLang = new BehaviorSubject<'pt' | 'en'>('pt');
  public currentLang$ = this.currentLang.asObservable();

  private translations: Translation = {
    pt: {
      'header.title': '🛍️ Lojinha Online',
      'header.cart': 'Ver Carrinho',
      'header.login': 'Entrar',
      'header.register': 'Cadastrar',
      'header.logout': 'Sair',
      'header.admin': 'Admin',
      'header.welcome': 'Olá, {name}',

      'products.title': '🎉 Nossos Produtos',
      'products.subtitle': 'Descubra produtos incríveis com os melhores preços do mercado',
      'products.seeAll': 'Ver Todos os Produtos',
      'products.add': 'Adicionar Produto',
      'products.myProducts': 'Meus Produtos',
      'products.allProducts': 'Ver Todos',
      'products.contact': 'Fale Conosco',
      'products.available': 'Produtos Disponíveis',
      'products.mix': 'Misturar',
      'products.noProducts': 'Nenhum produto encontrado',
      'products.reload': 'Recarregar Produtos',
      'products.loadMore': 'Carregar Mais Produtos',

      'cart.title': '🛒 Seu Carrinho',
      'cart.items': 'itens',
      'cart.subtotal': 'Subtotal:',
      'cart.shipping': 'Frete:',
      'cart.free': 'Grátis',
      'cart.total': 'Total:',
      'cart.checkout': '🚀 Finalizar Compra',
      'cart.clear': '🗑️ Limpar Carrinho',
      'cart.empty': 'Seu carrinho está vazio',
      'cart.continue': '🛍️ Continuar Comprando',

      'admin.products': '📦 Gerenciar Produtos',
      'admin.addProduct': '➕ Adicionar Produto',
      'admin.viewStore': '🏪 Ver Loja',
      'admin.myProducts': 'Meus Produtos',
      'admin.allProducts': 'Todos os Produtos',

      'common.back': '← Voltar',
      'common.save': '💾 Salvar',
      'common.edit': '✏️ Editar',
      'common.delete': '🗑️ Excluir',
      'common.cancel': 'Cancelar',
      'common.confirm': 'Confirmar',
      'common.yes': 'Sim',
      'common.no': 'Não'
    },
    en: {

      'header.title': '🛍️ Online Store',
      'header.cart': 'View Cart',
      'header.login': 'Login',
      'header.register': 'Register',
      'header.logout': 'Logout',
      'header.admin': 'Admin',
      'header.welcome': 'Hello, {name}',

      'products.title': '🎉 Our Products',
      'products.subtitle': 'Discover amazing products with the best market prices',
      'products.seeAll': 'See All Products',
      'products.add': 'Add Product',
      'products.myProducts': 'My Products',
      'products.allProducts': 'View All',
      'products.contact': 'Contact Us',
      'products.available': 'Available Products',
      'products.mix': 'Shuffle',
      'products.noProducts': 'No products found',
      'products.reload': 'Reload Products',
      'products.loadMore': 'Load More Products',

      'cart.title': '🛒 Your Cart',
      'cart.items': 'items',
      'cart.subtotal': 'Subtotal:',
      'cart.shipping': 'Shipping:',
      'cart.free': 'Free',
      'cart.total': 'Total:',
      'cart.checkout': '🚀 Checkout',
      'cart.clear': '🗑️ Clear Cart',
      'cart.empty': 'Your cart is empty',
      'cart.continue': '🛍️ Continue Shopping',

      'admin.products': '📦 Manage Products',
      'admin.addProduct': '➕ Add Product',
      'admin.viewStore': '🏪 View Store',
      'admin.myProducts': 'My Products',
      'admin.allProducts': 'All Products',

      'common.back': '← Back',
      'common.save': '💾 Save',
      'common.edit': '✏️ Edit',
      'common.delete': '🗑️ Delete',
      'common.cancel': 'Cancel',
      'common.confirm': 'Confirm',
      'common.yes': 'Yes',
      'common.no': 'No'
    }
  };

  setLanguage(lang: 'pt' | 'en'): void {
    this.currentLang.next(lang);
    localStorage.setItem('preferredLanguage', lang);
  }

  getCurrentLang(): 'pt' | 'en' {
    return this.currentLang.value;
  }

  translate(key: string, params?: {[key: string]: string}): string {
    const lang = this.currentLang.value;
    let translation = this.translations[lang]?.[key] || key;

    if (params) {
      Object.keys(params).forEach(param => {
        translation = translation.replace(`{${param}}`, params[param]);
      });
    }

    return translation;
  }

  initializeLanguage(): void {
    const storedLang = localStorage.getItem('preferredLanguage') as 'pt' | 'en';
    if (storedLang) {
      this.currentLang.next(storedLang);
    }
  }
}
