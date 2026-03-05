export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
}

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };

  isCustom?: boolean;
  createdBy?: number;
  source?: 'api' | 'custom';
  createdAt?: string;
  stock?: number;
}

export interface CartItem extends Product {
  quantity: number;
}
