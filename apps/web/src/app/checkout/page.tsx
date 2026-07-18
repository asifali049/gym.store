'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@fitness-platform/ui';
import { fetchCart } from '@/lib/api/cart';
import { fetchAddresses, createAddress, applyCoupon, checkout, verifyPayment } from '@/lib/api/checkout';
import { openRazorpayCheckout } from '@/lib/razorpay';
import { formatINR } from '@/lib/format';
import { useAuthStore } from '@/lib/auth-store';
import { ApiError } from '@/lib/api-client';


export default function CheckoutPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    if (!user) router.replace('/login?next=/checkout');
  }, [user, router]);

  const { data: cart } = useQuery({ queryKey: ['cart'], queryFn: fetchCart, enabled: !!user });
  const { data: addresses } = useQuery({
    queryKey: ['addresses'],
    queryFn: fetchAddresses,
    enabled: !!user,
  });

  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [showNewAddress, setShowNewAddress] = useState(false);
  const [addressForm, setAddressForm] = useState({ line1: '', line2: '', city: '', state: '', pincode: '' });
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [placeError, setPlaceError] = useState<string | null>(null);

  useEffect(() => {
    if (addresses && addresses.length > 0 && !selectedAddressId) {
      setSelectedAddressId(addresses.find((a) => a.isDefault)?.id ?? addresses[0].id);
    }
    if (addresses && addresses.length === 0) setShowNewAddress(true);
  }, [addresses, selectedAddressId]);

const subtotal = (cart?.items ?? []).reduce(
  (sum: number, item: { variant: { price: number | string }; quantity: number }) => {
    const price = Number(item.variant?.price ?? 0);
    const quantity = Number(item.quantity ?? 0);

    return sum + price * quantity;
  },
  0,
);

const total = Math.max(0, subtotal - discount);

  const addAddress = useMutation({
    mutationFn: () => createAddress(addressForm),
    onSuccess: (address) => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      setSelectedAddressId(address.id);
      setShowNewAddress(false);
    },
  });

  const applyCouponMutation = useMutation({
    mutationFn: () => applyCoupon(couponCode, subtotal),
    onSuccess: (res) => {
      setDiscount(res.discount);
      setCouponError(null);
    },
    onError: (err) => {
      setDiscount(0);
      setCouponError(err instanceof ApiError ? err.message : 'Invalid coupon');
    },
  });

  const placeOrder = useMutation({
    mutationFn: () => {
      if (!selectedAddressId) throw new Error('Select a delivery address');
      return checkout({ addressId: selectedAddressId, couponCode: couponCode || undefined });
    },
    onSuccess: async ({ order, payment }) => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });

      if (!payment) {
        // No payment gateway configured (e.g. local dev) — order is placed directly.
        router.push(`/orders/${order.id}`);
        return;
      }

      try {
        await openRazorpayCheckout({
          keyId: payment.razorpayKeyId,
          amount: payment.amount,
          orderId: payment.razorpayOrderId,
          name: `${user!.firstName} ${user!.lastName}`,
          email: user!.email,
          onSuccess: async (response) => {
            try {
              await verifyPayment(order.id, {
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              });
            } finally {
              router.push(`/orders/${order.id}`);
            }
          },
          onDismiss: () => {
            // Order already exists as PENDING — let them retry payment from the order page.
            router.push(`/orders/${order.id}`);
          },
        });
      } catch (err) {
        setPlaceError(err instanceof Error ? err.message : 'Could not open the payment widget');
      }
    },
    onError: (err) => {
      setPlaceError(err instanceof ApiError ? err.message : 'Could not place order');
    },
  });

  if (!user) return null;

  if (!cart) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-24">
        <div className="space-y-4 animate-pulse">
          <div className="h-8 w-48 rounded bg-gray-200 dark:bg-gray-800" />
          <div className="h-24 rounded-xl bg-gray-200 dark:bg-gray-800" />
          <div className="h-24 rounded-xl bg-gray-200 dark:bg-gray-800" />
          <div className="h-14 rounded-xl bg-gray-200 dark:bg-gray-800" />
        </div>
      </main>
    );
  }

  if (cart.items.length === 0) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-24 text-center">
        <div className="rounded-3xl border border-dashed border-gray-300 p-12 dark:border-gray-700">
          <h2 className="text-2xl font-semibold">
            Your cart is empty
          </h2>

          <p className="mt-3 text-gray-500">
            Add some products before proceeding to checkout.
          </p>

          <Button
            className="mt-6"
            onClick={() => router.push('/products')}
          >
            Continue Shopping
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="mb-10 text-2xl font-semibold tracking-tight">Checkout</h1>

      <section className="mb-10">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
          Delivery Address
        </h2>

        {addresses && addresses.length > 0 && (
          <div className="mb-4 space-y-2">
            {addresses.map((address) => (
              <label
                key={address.id}
                className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 text-sm ${selectedAddressId === address.id
                    ? 'border-gray-900 dark:border-white'
                    : 'border-gray-200 dark:border-gray-800'
                  }`}
              >
                <input
                  type="radio"
                  name="address"
                  checked={selectedAddressId === address.id}
                  onChange={() => setSelectedAddressId(address.id)}
                  className="mt-1"
                />
                <span>
                  {address.line1}
                  {address.line2 ? `, ${address.line2}` : ''}, {address.city}, {address.state}{' '}
                  {address.pincode}
                </span>
              </label>
            ))}
          </div>
        )}

        {!showNewAddress && (
          <button onClick={() => setShowNewAddress(true)} className="text-sm font-medium underline">
            + Add a new address
          </button>
        )}

        {showNewAddress && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              addAddress.mutate();
            }}
            className="mt-4 space-y-3 rounded-xl border border-gray-100 p-4 dark:border-gray-800"
          >
            <input
              required
              placeholder="Address line 1"
              value={addressForm.line1}
              onChange={(e) => setAddressForm((f) => ({ ...f, line1: e.target.value }))}
              className="w-full rounded-lg border border-gray-200 bg-transparent px-3 py-2 text-sm dark:border-gray-800"
            />
            <input
              placeholder="Address line 2 (optional)"
              value={addressForm.line2}
              onChange={(e) => setAddressForm((f) => ({ ...f, line2: e.target.value }))}
              className="w-full rounded-lg border border-gray-200 bg-transparent px-3 py-2 text-sm dark:border-gray-800"
            />
            <div className="grid grid-cols-3 gap-3">
              <input
                required
                placeholder="City"
                value={addressForm.city}
                onChange={(e) => setAddressForm((f) => ({ ...f, city: e.target.value }))}
                className="rounded-lg border border-gray-200 bg-transparent px-3 py-2 text-sm dark:border-gray-800"
              />
              <input
                required
                placeholder="State"
                value={addressForm.state}
                onChange={(e) => setAddressForm((f) => ({ ...f, state: e.target.value }))}
                className="rounded-lg border border-gray-200 bg-transparent px-3 py-2 text-sm dark:border-gray-800"
              />
              <input
                required
                placeholder="Pincode"
                value={addressForm.pincode}
                onChange={(e) => setAddressForm((f) => ({ ...f, pincode: e.target.value }))}
                className="rounded-lg border border-gray-200 bg-transparent px-3 py-2 text-sm dark:border-gray-800"
              />
            </div>
            <Button type="submit" disabled={addAddress.isPending}>
              {addAddress.isPending ? "Saving Address..." : "Save Address"}
            </Button>
          </form>
        )}
      </section>

      <section className="mb-10">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">Coupon</h2>
        <div className="flex gap-2">
          <input
            placeholder="Coupon code"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
            className="flex-1 rounded-lg border border-gray-200 bg-transparent px-3 py-2 text-sm dark:border-gray-800"
          />
          <Button
  type="button"
  onClick={() => {
    setCouponError(null);
    applyCouponMutation.mutate();
  }}
  disabled={
    !couponCode.trim() ||
    applyCouponMutation.isPending
  }
>
  {applyCouponMutation.isPending
    ? "Applying..."
    : "Apply"}
</Button>
        </div>
        {couponError && <p className="mt-2 text-sm text-red-500">{couponError}</p>}
        {discount > 0 && <p className="mt-2 text-sm text-green-600">Coupon applied — {formatINR(discount)} off</p>}
      </section>

      <section className="rounded-xl border border-gray-100 p-5 dark:border-gray-800">
        <div className="flex justify-between text-sm text-gray-500">
          <span>Subtotal</span>
          <span>{formatINR(subtotal)}</span>
        </div>
        {discount > 0 && (
          <div className="mt-1 flex justify-between text-sm text-green-600">
            <span>Discount</span>
            <span>-{formatINR(discount)}</span>
          </div>
        )}
        <div className="mt-3 flex justify-between border-t border-gray-100 pt-3 text-base font-semibold dark:border-gray-800">
          <span>Total</span>
          <span>{formatINR(total)}</span>
        </div>
      </section>

      {placeError && <p className="mt-4 text-sm text-red-500">{placeError}</p>}

      <Button
        onClick={() => {
    if (!placeOrder.isPending) {
      setPlaceError(null);
      placeOrder.mutate();
    }
  }}
        disabled={!selectedAddressId || placeOrder.isPending}
        className="mt-6 w-full"
      >
        {placeOrder.isPending ? "Processing Payment..." : `Place Order — ${formatINR(total)}`}
      </Button>
    </main>
  );
}
