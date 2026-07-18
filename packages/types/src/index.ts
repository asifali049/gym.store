export interface ProductVariantDTO {
  id: string;
  sku: string;
  price: number;
  salePrice?: number | null;
  stock: number;
  flavor?: string | null;
  weight?: string | null;
}

export interface ProductReviewDTO {
  id: string;
  rating: number;
  comment?: string | null;
}

export interface ProductDTO {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  basePrice: number;

  brand: {
    name: string;
    slug: string;
  };

  category: {
    name: string;
    slug: string;
  };

  variants: ProductVariantDTO[];

  reviews?: ProductReviewDTO[];
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

export interface AddressDTO {
  id: string;
  fullName: string;
  phone: string;
  line1: string;
  line2?: string | null;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isDefault: boolean;
}

export interface OrderItemDTO {
  id: string;
  quantity: number;
  price: number;
  variant: {
    product: {
      name: string;
    };
  };
}

export interface OrderDTO {
  id: string;
  status: string;
  totalAmount: number;
  items: OrderItemDTO[];
  createdAt: string;
}