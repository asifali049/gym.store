interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface OpenCheckoutParams {
  keyId: string;
  amount: number; // in paise
  currency: string;
  orderId: string; // razorpay order id
  name?: string;
  description?: string;
  prefill?: { name?: string; email?: string; contact?: string };
}

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void };
  }
}

function loadRazorpayScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') return reject(new Error('Not in a browser environment'));
    if (window.Razorpay) return resolve();

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Razorpay checkout script'));
    document.body.appendChild(script);
  });
}

export async function openRazorpayCheckout(params: OpenCheckoutParams): Promise<RazorpayResponse> {
  if (!params.keyId) {
    throw new Error('Payments are not configured yet. Please contact support.');
  }

  await loadRazorpayScript();

  return new Promise((resolve, reject) => {
    const razorpay = new window.Razorpay({
      key: params.keyId,
      amount: params.amount,
      currency: params.currency,
      order_id: params.orderId,
      name: params.name ?? 'PeakFuel',
      description: params.description ?? 'Order payment',
      prefill: params.prefill,
      theme: { color: '#22c55e' },
      handler: (response: RazorpayResponse) => resolve(response),
      modal: {
        ondismiss: () => reject(new Error('Payment was cancelled.')),
      },
    });
    razorpay.open();
  });
}
