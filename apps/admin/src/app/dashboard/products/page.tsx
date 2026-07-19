'use client';

import { useQuery } from '@tanstack/react-query';
import { DataTable, ProductThumb } from '@/components/data-table';
import { fetchProducts } from '@/lib/api/products';
import { ApiError } from '@/lib/api/client';

interface ProductRow {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  variantCount: number;
  totalStock: number;
  status: 'ACTIVE' | 'DRAFT';
}

const STATUS_STYLES: Record<ProductRow['status'], string> = {
  ACTIVE: 'bg-emerald-100 text-emerald-700',
  DRAFT: 'bg-gray-100 text-gray-600',
};

export default function ProductsPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['admin', 'products'],
    queryFn: fetchProducts,
  });

  const rows: ProductRow[] =
    data?.map((p) => ({
      id: p.id,
      name: p.name,
      brand: p.brand.name,
      category: p.category.name,
      price: Number(p.basePrice),
      variantCount: p.variants.length,
      totalStock: p.variants.reduce((sum, v) => sum + v.stock, 0),
      status: p.isActive ? 'ACTIVE' : 'DRAFT',
    })) ?? [];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Products</h1>
        <button className="rounded-full bg-gray-900 px-5 py-2.5 text-sm font-medium text-white dark:bg-white dark:text-gray-900">
          + Add Product
        </button>
      </div>

      {isLoading && <p className="text-sm text-gray-500">Loading products...</p>}

      {error && (
        <p className="text-sm text-red-600">
          {error instanceof ApiError ? error.message : "Couldn't load products. Is the API running?"}
        </p>
      )}

      {!isLoading && !error && (
        <DataTable<ProductRow>
          rows={rows}
          columns={[
            {
              key: 'name',
              label: 'Product',
              render: (row) => (
                <div className="flex items-center gap-3">
                  <ProductThumb src={`https://picsum.photos/seed/${row.id}/100/100`} alt={row.name} />
                  <span className="font-medium">{row.name}</span>
                </div>
              ),
            },
            { key: 'brand', label: 'Brand' },
            { key: 'category', label: 'Category' },
            { key: 'price', label: 'Base Price', render: (row) => `₹${row.price.toLocaleString()}` },
            { key: 'variantCount', label: 'Variants' },
            {
              key: 'totalStock',
              label: 'Total Stock',
              render: (row) => <span className={row.totalStock < 20 ? 'font-medium text-red-600' : ''}>{row.totalStock}</span>,
            },
            {
              key: 'status',
              label: 'Status',
              render: (row) => (
                <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[row.status]}`}>
                  {row.status}
                </span>
              ),
            },
          ]}
        />
      )}
    </div>
  );
}
