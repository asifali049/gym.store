export interface BrandDTO {
  name: string;
  slug: string;
  logoUrl?: string | null;
}

export interface CategoryDTO {
  name: string;
  slug: string;
}

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
  userId: string;
  rating: number;
  comment: string | null;
  createdAt: string;
}

export interface ProductDTO {
  id: string;
  name: string;
  slug: string;
  description?: string;
  basePrice: number;
  brand: BrandDTO;
  category: CategoryDTO;
  variants?: ProductVariantDTO[];
  reviews?: ReviewDTO[];
}

export interface UserDTO {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string | null;
  role: 'CUSTOMER' | 'ADMIN' | 'SUPER_ADMIN';
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface CartItemDTO {
  id: string;
  quantity: number;
  variant: ProductVariantDTO & { product: ProductDTO };
}

export interface CartDTO {
  id: string;
  items: CartItemDTO[];
}

export interface AddressDTO {
  id: string;
  line1: string;
  line2: string | null;
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
  variant: ProductVariantDTO & { product: ProductDTO };
}

export interface OrderDTO {
  id: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  items: OrderItemDTO[];
  payment?: { status: string } | null;
}
