import { DataTable, ProductThumb, StarRating } from '@/components/data-table';

interface ProductRow {
  id: string;
  image: string;
  name: string;
  brand: string;
  category: string;
  flavor: string;
  weight: string;
  sku: string;
  price: number;
  stock: number;
  rating: number;
  status: 'ACTIVE' | 'DRAFT' | 'OUT_OF_STOCK';
}

// Static sample data — swap for a live apiFetch<ProductRow[]>('/products') call
// once the API is running. Fields mirror the ProductVariant + Product Prisma models
// (flavor, weight, sku, stock) plus a few admin-UI-only fields (image, rating, status).
const SAMPLE_PRODUCTS: ProductRow[] = [
  {
    id: 'p_1',
    image: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=200&h=200&fit=crop',
    name: 'Whey Isolate Gold',
    brand: 'PeakFuel',
    category: 'Whey Protein',
    flavor: 'Chocolate Fudge',
    weight: '2 kg',
    sku: 'WIG-CHOC-2KG',
    price: 2499,
    stock: 142,
    rating: 4.6,
    status: 'ACTIVE',
  },
  {
    id: 'p_2',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop',
    name: 'Creatine Monohydrate',
    brand: 'PeakFuel',
    category: 'Creatine',
    flavor: 'Unflavored',
    weight: '500 g',
    sku: 'CRT-UNF-500G',
    price: 899,
    stock: 310,
    rating: 4.8,
    status: 'ACTIVE',
  },
  {
    id: 'p_3',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop',
    name: 'Pre-Workout Ignite',
    brand: 'IgniteLabs',
    category: 'Pre Workout',
    flavor: 'Blue Raspberry',
    weight: '300 g',
    sku: 'PWI-BLUR-300G',
    price: 1299,
    stock: 58,
    rating: 4.3,
    status: 'ACTIVE',
  },
  {
    id: 'p_4',
    image: 'https://images.unsplash.com/photo-1622484212385-a83c6c8a9c4c?w=200&h=200&fit=crop',
    name: 'Mass Gainer XL',
    brand: 'PeakFuel',
    category: 'Mass Gainer',
    flavor: 'Vanilla',
    weight: '3 kg',
    sku: 'MGX-VAN-3KG',
    price: 2199,
    stock: 0,
    rating: 4.1,
    status: 'OUT_OF_STOCK',
  },
];

const STATUS_STYLES: Record<ProductRow['status'], string> = {
  ACTIVE: 'bg-emerald-100 text-emerald-700',
  DRAFT: 'bg-gray-100 text-gray-600',
  OUT_OF_STOCK: 'bg-red-100 text-red-700',
};

export default function ProductsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Products</h1>
        <button className="rounded-full bg-gray-900 px-5 py-2.5 text-sm font-medium text-white dark:bg-white dark:text-gray-900">
          + Add Product
        </button>
      </div>
      <DataTable<ProductRow>
        rows={SAMPLE_PRODUCTS}
        columns={[
          {
            key: 'image',
            label: '',
            render: (row) => <ProductThumb src={row.image} alt={row.name} />,
          },
          {
            key: 'name',
            label: 'Product',
            render: (row) => (
              <div>
                <p className="font-medium">{row.name}</p>
                <p className="text-xs text-gray-500">{row.flavor}</p>
              </div>
            ),
          },
          { key: 'sku', label: 'SKU' },
          { key: 'brand', label: 'Brand' },
          { key: 'category', label: 'Category' },
          { key: 'weight', label: 'Weight / Size' },
          { key: 'price', label: 'Price', render: (row) => `₹${row.price.toLocaleString()}` },
          {
            key: 'stock',
            label: 'Stock',
            render: (row) => (
              <span className={row.stock < 20 ? 'font-medium text-red-600' : ''}>{row.stock}</span>
            ),
          },
          {
            key: 'rating',
            label: 'Rating',
            render: (row) => <StarRating rating={row.rating} />,
          },
          {
            key: 'status',
            label: 'Status',
            render: (row) => (
              <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[row.status]}`}>
                {row.status.replace('_', ' ')}
              </span>
            ),
          },
        ]}
      />
    </div>
  );
}
