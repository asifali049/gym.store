export interface ProductDTO {
  id: string;
  name: string;
  slug: string;
  basePrice: number;
  brand: { name: string; slug: string };
  category: { name: string; slug: string };
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
