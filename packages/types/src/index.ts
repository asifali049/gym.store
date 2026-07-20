export interface ProductVariantDTO {
  id: string;
  flavor: string | null;
  weight: string | null;
  price: number;
  stock: number;
  sku: string;
}

export interface ReviewDTO {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  user?: { firstName: string; lastName: string };
}

export interface ProductDTO {
  id: string;
  name: string;
  slug: string;
  description: string;
  basePrice: number;
  brand: { id: string; name: string; slug: string };
  category: { id: string; name: string; slug: string };
  variants: ProductVariantDTO[];
  reviews?: ReviewDTO[];
}

export interface WishlistItemDTO {
  id: string;
  userId: string;
  productId: string;
  createdAt: string;
}

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED';

export interface OrderItemDTO {
  id: string;
  quantity: number;
  price: number;
  variant: {
    id: string;
    flavor: string | null;
    weight: string | null;
    product: { id: string; name: string; slug: string };
  };
}

export interface OrderDTO {
  id: string;
  status: OrderStatus;
  totalAmount: number;
  createdAt: string;
  items: OrderItemDTO[];
}

export interface UserDTO {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'CUSTOMER' | 'ADMIN' | 'SUPER_ADMIN';
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}
