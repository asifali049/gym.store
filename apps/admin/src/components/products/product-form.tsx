'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2 } from 'lucide-react';
import { fetchBrands, createBrand } from '@/lib/api/brands';
import { fetchCategories, createCategory } from '@/lib/api/categories';
import {
  createProduct,
  updateProduct,
  addVariant,
  type Product,
  type CreateVariantInput,
} from '@/lib/api/products';
import { ApiError } from '@/lib/api/client';
import { slugify } from '@/lib/slugify';

type VariantRow = CreateVariantInput & { key: string };

function emptyVariant(): VariantRow {
  return { key: crypto.randomUUID(), flavor: '', weight: '', price: 0, stock: 0, sku: '' };
}

function BrandCategoryPicker({
  label,
  options,
  value,
  onChange,
  onCreate,
  isCreating,
}: {
  label: string;
  options: { id: string; name: string }[];
  value: string;
  onChange: (id: string) => void;
  onCreate: (name: string) => void;
  isCreating: boolean;
}) {
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState('');

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium">{label}</label>
      {!adding ? (
        <div className="flex gap-2">
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            required
            className="flex-1 rounded-xl border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-gray-900 dark:border-gray-700 dark:bg-gray-950 dark:focus:border-white"
          >
            <option value="">Select {label.toLowerCase()}</option>
            {options.map((o) => (
              <option key={o.id} value={o.id}>
                {o.name}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => setAdding(true)}
            className="rounded-xl border border-gray-300 px-3 text-sm text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-900"
          >
            + New
          </button>
        </div>
      ) : (
        <div className="flex gap-2">
          <input
            autoFocus
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder={`New ${label.toLowerCase()} name`}
            className="flex-1 rounded-xl border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-gray-900 dark:border-gray-700 dark:bg-gray-950 dark:focus:border-white"
          />
          <button
            type="button"
            disabled={!newName.trim() || isCreating}
            onClick={() => {
              onCreate(newName.trim());
              setNewName('');
              setAdding(false);
            }}
            className="rounded-xl bg-gray-900 px-3 text-sm text-white disabled:opacity-50 dark:bg-white dark:text-gray-900"
          >
            Add
          </button>
          <button
            type="button"
            onClick={() => setAdding(false)}
            className="rounded-xl border border-gray-300 px-3 text-sm text-gray-500 dark:border-gray-700"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}

export function ProductForm({
  product,
  onSuccess,
  onCancel,
}: {
  product?: Product;
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const isEdit = Boolean(product);
  const queryClient = useQueryClient();

  const [name, setName] = useState(product?.name ?? '');
  const [slug, setSlug] = useState(product?.slug ?? '');
  const [slugTouched, setSlugTouched] = useState(isEdit);
  const [description, setDescription] = useState(product?.description ?? '');
  const [basePrice, setBasePrice] = useState(product?.basePrice?.toString() ?? '');
  const [brandId, setBrandId] = useState(product?.brand.id ?? '');
  const [categoryId, setCategoryId] = useState(product?.category.id ?? '');
  const [isActive, setIsActive] = useState(product?.isActive ?? true);
  const [variants, setVariants] = useState<VariantRow[]>(
    isEdit ? [] : [emptyVariant()],
  );
  const [formError, setFormError] = useState<string | null>(null);

  const brandsQuery = useQuery({ queryKey: ['admin', 'brands'], queryFn: fetchBrands });
  const categoriesQuery = useQuery({ queryKey: ['admin', 'categories'], queryFn: fetchCategories });

  const createBrandMutation = useMutation({
    mutationFn: (name: string) => createBrand({ name, slug: slugify(name) }),
    onSuccess: (brand) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'brands'] });
      setBrandId(brand.id);
    },
  });

  const createCategoryMutation = useMutation({
    mutationFn: (name: string) => createCategory({ name, slug: slugify(name) }),
    onSuccess: (category) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] });
      setCategoryId(category.id);
    },
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        name,
        slug,
        description,
        brandId,
        categoryId,
        basePrice: Number(basePrice),
        isActive,
      };

      if (isEdit && product) {
        return updateProduct(product.id, payload);
      }

      const created = await createProduct(payload);
      for (const v of variants) {
        if (!v.sku.trim()) continue;
        await addVariant(created.id, {
          flavor: v.flavor || undefined,
          weight: v.weight || undefined,
          price: Number(v.price),
          stock: Number(v.stock),
          sku: v.sku,
        });
      }
      return created;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
      onSuccess();
    },
    onError: (err) => {
      setFormError(err instanceof ApiError ? err.message : 'Something went wrong. Please try again.');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!brandId || !categoryId) {
      setFormError('Please select a brand and category.');
      return;
    }
    saveMutation.mutate();
  };

  const updateVariantRow = (key: string, patch: Partial<VariantRow>) => {
    setVariants((rows) => rows.map((r) => (r.key === key ? { ...r, ...patch } : r)));
  };

  return (
    <form onSubmit={handleSubmit} className="flex max-h-[70vh] flex-col gap-4 overflow-y-auto pr-1">
      <label className="flex flex-col gap-1.5 text-sm font-medium">
        Product name
        <input
          required
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (!slugTouched) setSlug(slugify(e.target.value));
          }}
          className="rounded-xl border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-gray-900 dark:border-gray-700 dark:bg-gray-950 dark:focus:border-white"
        />
      </label>

      <label className="flex flex-col gap-1.5 text-sm font-medium">
        Slug
        <input
          required
          value={slug}
          onChange={(e) => {
            setSlug(e.target.value);
            setSlugTouched(true);
          }}
          className="rounded-xl border border-gray-300 px-3 py-2.5 text-sm font-mono outline-none focus:border-gray-900 dark:border-gray-700 dark:bg-gray-950 dark:focus:border-white"
        />
      </label>

      <label className="flex flex-col gap-1.5 text-sm font-medium">
        Description
        <textarea
          required
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="resize-none rounded-xl border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-gray-900 dark:border-gray-700 dark:bg-gray-950 dark:focus:border-white"
        />
      </label>

      <div className="grid grid-cols-2 gap-3">
        <BrandCategoryPicker
          label="Brand"
          options={brandsQuery.data ?? []}
          value={brandId}
          onChange={setBrandId}
          onCreate={(n) => createBrandMutation.mutate(n)}
          isCreating={createBrandMutation.isPending}
        />
        <BrandCategoryPicker
          label="Category"
          options={categoriesQuery.data ?? []}
          value={categoryId}
          onChange={setCategoryId}
          onCreate={(n) => createCategoryMutation.mutate(n)}
          isCreating={createCategoryMutation.isPending}
        />
      </div>

      <label className="flex flex-col gap-1.5 text-sm font-medium">
        Base price (₹)
        <input
          required
          type="number"
          min={0}
          step="0.01"
          value={basePrice}
          onChange={(e) => setBasePrice(e.target.value)}
          className="rounded-xl border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-gray-900 dark:border-gray-700 dark:bg-gray-950 dark:focus:border-white"
        />
      </label>

      <label className="flex items-center gap-2 text-sm font-medium">
        <input
          type="checkbox"
          checked={isActive}
          onChange={(e) => setIsActive(e.target.checked)}
          className="h-4 w-4 rounded border-gray-300 accent-gray-900 dark:accent-white"
        />
        Active (visible on storefront)
      </label>

      {!isEdit && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Variants</span>
            <button
              type="button"
              onClick={() => setVariants((v) => [...v, emptyVariant()])}
              className="flex items-center gap-1 text-xs font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            >
              <Plus size={14} /> Add variant
            </button>
          </div>

          {variants.map((v) => (
            <div key={v.key} className="grid grid-cols-12 gap-2 rounded-xl border border-gray-200 p-2 dark:border-gray-800">
              <input
                placeholder="Flavor"
                value={v.flavor ?? ''}
                onChange={(e) => updateVariantRow(v.key, { flavor: e.target.value })}
                className="col-span-3 rounded-lg border border-gray-300 px-2 py-1.5 text-xs outline-none focus:border-gray-900 dark:border-gray-700 dark:bg-gray-950"
              />
              <input
                placeholder="Weight"
                value={v.weight ?? ''}
                onChange={(e) => updateVariantRow(v.key, { weight: e.target.value })}
                className="col-span-2 rounded-lg border border-gray-300 px-2 py-1.5 text-xs outline-none focus:border-gray-900 dark:border-gray-700 dark:bg-gray-950"
              />
              <input
                type="number"
                placeholder="Price"
                value={v.price || ''}
                onChange={(e) => updateVariantRow(v.key, { price: Number(e.target.value) })}
                className="col-span-2 rounded-lg border border-gray-300 px-2 py-1.5 text-xs outline-none focus:border-gray-900 dark:border-gray-700 dark:bg-gray-950"
              />
              <input
                type="number"
                placeholder="Stock"
                value={v.stock || ''}
                onChange={(e) => updateVariantRow(v.key, { stock: Number(e.target.value) })}
                className="col-span-2 rounded-lg border border-gray-300 px-2 py-1.5 text-xs outline-none focus:border-gray-900 dark:border-gray-700 dark:bg-gray-950"
              />
              <input
                placeholder="SKU"
                value={v.sku}
                onChange={(e) => updateVariantRow(v.key, { sku: e.target.value })}
                className="col-span-2 rounded-lg border border-gray-300 px-2 py-1.5 text-xs outline-none focus:border-gray-900 dark:border-gray-700 dark:bg-gray-950"
              />
              <button
                type="button"
                onClick={() => setVariants((rows) => rows.filter((r) => r.key !== v.key))}
                className="col-span-1 flex items-center justify-center text-gray-400 hover:text-red-500"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
          <p className="text-xs text-gray-400">Rows with an empty SKU are skipped.</p>
        </div>
      )}

      {formError && <p className="text-sm text-red-600">{formError}</p>}

      <div className="mt-2 flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full border border-gray-300 px-5 py-2.5 text-sm font-medium dark:border-gray-700"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saveMutation.isPending}
          className="rounded-full bg-gray-900 px-5 py-2.5 text-sm font-medium text-white disabled:opacity-60 dark:bg-white dark:text-gray-900"
        >
          {saveMutation.isPending ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Product'}
        </button>
      </div>
    </form>
  );
}