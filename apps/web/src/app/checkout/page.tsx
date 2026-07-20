'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { MapPin, Plus, ShoppingBag, Tag, X } from 'lucide-react';
import { Button } from '@fitness-platform/ui';
import { fetchCart } from '@/lib/api/cart';
import {
  fetchAddresses,
  createAddress,
  applyCoupon,
  checkout,
  createPaymentOrder,
  verifyPayment,
  type AddressDTO,
  type CouponResult,
} from '@/lib/api/checkout';
import { openRazorpayCheckout } from '@/lib/razorpay';
import { formatINR } from '@/lib/format';
import { ApiError } from '@/lib/api/client';
import { useAuthStore } from '@/lib/auth-store';
import { ScrollReveal } from '@/components/animations/scroll-reveal';

export default function CheckoutPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { isAuthenticated, user } = useAuthStore();

  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<CouponResult | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [placeOrderError, setPlaceOrderError] = useState<string | null>(null);

  const [newAddress, setNewAddress] = useState({ line1: '', line2: '', city: '', state: '', pincode: '' });

  const { data: cart, isLoading: cartLoading } = useQuery({
    queryKey: ['cart'],
    queryFn: fetchCart,
    enabled: isAuthenticated,
  });

  const { data: addresses, isLoading: addressesLoading } = useQuery({
    queryKey: ['addresses'],
    queryFn: fetchAddresses,
    enabled: isAuthenticated,
  });

  const cartTotal = (cart?.items ?? []).reduce((sum, item) => sum + Number(item.variant.price) * item.quantity, 0);
  const finalTotal = appliedCoupon ? appliedCoupon.finalTotal : cartTotal;

  const createAddressMutation = useMutation({
    mutationFn: () => createAddress(newAddress),
    onSuccess: (address) => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      setSelectedAddressId(address.id);
      setShowAddressForm(false);
      setNewAddress({ line1: '', line2: '', city: '', state: '', pincode: '' });
    },
  });

  const couponMutation = useMutation({
    mutationFn: () => applyCoupon(couponCode, cartTotal),
    onSuccess: (result) => {
      setAppliedCoupon(result);
      setCouponError(null);
    },
    onError: (err) => {
      setAppliedCoupon(null);
      setCouponError(err instanceof ApiError ? err.message : 'Could not apply this coupon.');
    },
  });

  const placeOrderMutation = useMutation({
    mutationFn: async () => {
      if (!selectedAddressId) throw new Error('Please select a delivery address.');

      const order = await checkout({ addressId: selectedAddressId, couponCode: appliedCoupon?.code });
      const paymentOrder = await createPaymentOrder(order.id);

      const razorpayResponse = await openRazorpayCheckout({
        keyId: paymentOrder.keyId,
        amount: paymentOrder.amount,
        currency: paymentOrder.currency,
        orderId: paymentOrder.razorpayOrderId,
        prefill: user ? { name: `${user.firstName} ${user.lastName}`, email: user.email } : undefined,
      });

      await verifyPayment({
        orderId: order.id,
        razorpayOrderId: razorpayResponse.razorpay_order_id,
        razorpayPaymentId: razorpayResponse.razorpay_payment_id,
        razorpaySignature: razorpayResponse.razorpay_signature,
      });

      return order;
    },
    onSuccess: (order) => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      router.push(`/orders/${order.id}`);
    },
    onError: (err) => {
      setPlaceOrderError(
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : 'Something went wrong while placing your order.',
      );
    },
  });

  if (!isAuthenticated) {
    return (
      <main className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center gap-4 px-6 text-center">
        <ShoppingBag size={40} className="text-gray-300" />
        <h1 className="text-2xl font-semibold">Sign in to checkout</h1>
        <Link href="/login?redirect=/checkout" className="rounded-full bg-gray-900 px-6 py-3 text-sm font-medium text-white dark:bg-white dark:text-gray-900">
          Sign In
        </Link>
      </main>
    );
  }

  if (cartLoading || addressesLoading) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900 dark:border-gray-700 dark:border-t-white" />
      </main>
    );
  }

  const items = cart?.items ?? [];

  if (items.length === 0) {
    return (
      <main className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center gap-4 px-6 text-center">
        <ShoppingBag size={40} className="text-gray-300" />
        <h1 className="text-2xl font-semibold">Your cart is empty</h1>
        <Link href="/" className="rounded-full bg-gray-900 px-6 py-3 text-sm font-medium text-white dark:bg-white dark:text-gray-900">
          Continue Shopping
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="mb-8 text-3xl font-semibold">Checkout</h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
        <div className="flex flex-col gap-8">
          {/* Delivery address */}
          <ScrollReveal>
            <section>
              <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                <MapPin size={18} />
                Delivery Address
              </h2>

              <div className="flex flex-col gap-3">
                {(addresses ?? []).map((address: AddressDTO) => (
                  <label
                    key={address.id}
                    className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition ${
                      selectedAddressId === address.id
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
                    <div className="text-sm">
                      <p className="font-medium">{address.line1}{address.line2 ? `, ${address.line2}` : ''}</p>
                      <p className="text-gray-500">
                        {address.city}, {address.state} {address.pincode}
                      </p>
                    </div>
                  </label>
                ))}

                {!showAddressForm ? (
                  <button
                    onClick={() => setShowAddressForm(true)}
                    className="flex items-center justify-center gap-2 rounded-2xl border border-dashed border-gray-300 p-4 text-sm font-medium text-gray-600 hover:border-gray-400 dark:border-gray-700 dark:text-gray-300"
                  >
                    <Plus size={16} />
                    Add New Address
                  </button>
                ) : (
                  <div className="rounded-2xl border border-gray-200 p-4 dark:border-gray-800">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-sm font-medium">New Address</span>
                      <button onClick={() => setShowAddressForm(false)} aria-label="Cancel">
                        <X size={16} className="text-gray-400" />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <input
                        placeholder="Address line 1"
                        value={newAddress.line1}
                        onChange={(e) => setNewAddress({ ...newAddress, line1: e.target.value })}
                        className="col-span-2 rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-900 dark:border-gray-700 dark:bg-gray-950 dark:focus:border-white"
                      />
                      <input
                        placeholder="Address line 2 (optional)"
                        value={newAddress.line2}
                        onChange={(e) => setNewAddress({ ...newAddress, line2: e.target.value })}
                        className="col-span-2 rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-900 dark:border-gray-700 dark:bg-gray-950 dark:focus:border-white"
                      />
                      <input
                        placeholder="City"
                        value={newAddress.city}
                        onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                        className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-900 dark:border-gray-700 dark:bg-gray-950 dark:focus:border-white"
                      />
                      <input
                        placeholder="State"
                        value={newAddress.state}
                        onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                        className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-900 dark:border-gray-700 dark:bg-gray-950 dark:focus:border-white"
                      />
                      <input
                        placeholder="Pincode"
                        value={newAddress.pincode}
                        onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                        className="col-span-2 rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-900 dark:border-gray-700 dark:bg-gray-950 dark:focus:border-white sm:col-span-1"
                      />
                    </div>
                    <Button
                      onClick={() => createAddressMutation.mutate()}
                      disabled={createAddressMutation.isPending}
                      className="mt-3 w-full"
                    >
                      {createAddressMutation.isPending ? 'Saving...' : 'Save Address'}
                    </Button>
                  </div>
                )}
              </div>
            </section>
          </ScrollReveal>

          {/* Order items */}
          <ScrollReveal delay={0.1}>
            <section>
              <h2 className="mb-4 text-lg font-semibold">Order Items</h2>
              <div className="flex flex-col gap-3">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-sm">
                    <span>
                      {item.variant.product.name} × {item.quantity}
                    </span>
                    <span className="font-medium">{formatINR(Number(item.variant.price) * item.quantity)}</span>
                  </div>
                ))}
              </div>
            </section>
          </ScrollReveal>
        </div>

        {/* Summary sidebar */}
        <ScrollReveal delay={0.15}>
          <aside className="flex flex-col gap-4 rounded-2xl border border-gray-200 p-6 dark:border-gray-800">
            <h2 className="text-lg font-semibold">Order Summary</h2>

            <div className="flex items-center gap-2">
              <div className="flex flex-1 items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-700">
                <Tag size={14} className="text-gray-400" />
                <input
                  placeholder="Coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  className="w-full bg-transparent text-sm outline-none"
                />
              </div>
              <button
                onClick={() => couponMutation.mutate()}
                disabled={!couponCode || couponMutation.isPending}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium disabled:opacity-50 dark:border-gray-700"
              >
                Apply
              </button>
            </div>
            {couponError && <p className="text-xs text-red-600">{couponError}</p>}
            {appliedCoupon && (
              <p className="text-xs text-emerald-600">
                "{appliedCoupon.code}" applied — you saved {formatINR(appliedCoupon.discount)}
              </p>
            )}

            <div className="flex flex-col gap-2 border-t border-gray-200 pt-4 text-sm dark:border-gray-800">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span>{formatINR(cartTotal)}</span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between text-emerald-600">
                  <span>Discount</span>
                  <span>-{formatINR(appliedCoupon.discount)}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-gray-200 pt-2 text-base font-semibold dark:border-gray-800">
                <span>Total</span>
                <span>{formatINR(finalTotal)}</span>
              </div>
            </div>

            {placeOrderError && <p className="text-sm text-red-600">{placeOrderError}</p>}

            <Button
              onClick={() => {
                setPlaceOrderError(null);
                placeOrderMutation.mutate();
              }}
              disabled={!selectedAddressId || placeOrderMutation.isPending}
              className="w-full"
            >
              {placeOrderMutation.isPending ? 'Processing...' : `Pay ${formatINR(finalTotal)}`}
            </Button>
          </aside>
        </ScrollReveal>
      </div>
    </main>
  );
}
