'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Package, Pencil, Trash2 } from 'lucide-react';
import { DataTable } from '@/components/data-table';
import { fetchProducts, deleteProduct, type Product } from '@/lib/api/products';
import { ApiError } from '@/lib/api/client';
import { Modal } from '@/components/modal';
import { ProductForm } from '@/components/products/product-form';

interface ProductRow {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  variantCount: number;
  totalStock: number;
  status: 'ACTIVE' | 'DRAFT';
  image: string | null;
  raw: Product;
}

const STATUS_STYLES: Record<ProductRow['status'], string> = {
  ACTIVE: 'bg-emerald-100 text-emerald-700',
  DRAFT: 'bg-gray-100 text-gray-600',
};

function ProductThumb({ src, alt }: { src: string | null; alt: string }) {
  if (!src) {
    return (
      <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 text-gray-300 dark:border-gray-800 dark:bg-gray-900">
        <Package size={18} />
      </div>
    );
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} className="h-11 w-11 rounded-lg border border-gray-200 object-cover dark:border-gray-800" />;
}

export default function ProductsPage() {
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery({
    queryKey: ['admin', 'products'],
    queryFn: fetchProducts,
  });

  const [formOpen, setFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'products'] }),
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
      image: p.images?.[0] ?? null,
      raw: p,
    })) ?? [];

  const openCreate = () => {
    setEditingProduct(undefined);
    setFormOpen(true);
  };

  const openEdit = (product: Product) => {
    setEditingProduct(product);
    setFormOpen(true);
  };

  const handleDelete = (product: ProductRow) => {
    if (confirm(`Delete "${product.name}"? This cannot be undone.`)) {
      deleteMutation.mutate(product.id);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Products</h1>
        <button
          onClick={openCreate}
          className="rounded-full bg-gray-900 px-5 py-2.5 text-sm font-medium text-white dark:bg-white dark:text-gray-900"
        >
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
                  <ProductThumb src={row.image} alt={row.name} />
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
            {
              key: 'id',
              label: 'Actions',
              render: (row) => (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEdit(row.raw)}
                    aria-label="Edit product"
                    className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-white"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    onClick={() => handleDelete(row)}
                    aria-label="Delete product"
                    className="rounded-lg p-1.5 text-gray-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ),
            },
          ]}
        />
      )}

      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editingProduct ? 'Edit Product' : 'Add Product'}
      >
        <ProductForm
          product={editingProduct}
          onSuccess={() => setFormOpen(false)}
          onCancel={() => setFormOpen(false)}
        />
      </Modal>
    </div>
  );
}