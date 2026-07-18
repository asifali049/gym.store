let scriptPromise: Promise<boolean> | null = null;

function loadRazorpayScript(): Promise<boolean> {
  if (typeof window === 'undefined') return Promise.resolve(false);
  if ((window as any).Razorpay) return Promise.resolve(true);

  if (!scriptPromise) {
    scriptPromise = new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }
  return scriptPromise;
}

interface OpenRazorpayParams {
  keyId: string;
  amount: number;
  orderId: string;
  name: string;
  email: string;
  onSuccess: (payload: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => void;
  onDismiss: () => void;
}

export async function openRazorpayCheckout(params: OpenRazorpayParams) {
  const loaded = await loadRazorpayScript();
  if (!loaded) throw new Error('Could not load the payment widget. Check your connection and try again.');

  const razorpay = new (window as any).Razorpay({
    key: params.keyId,
    amount: params.amount,
    currency: 'INR',
    name: 'Fitness Platform',
    order_id: params.orderId,
    prefill: { name: params.name, email: params.email },
    theme: { color: '#111827' },
    handler: (response: {
      razorpay_order_id: string;
      razorpay_payment_id: string;
      razorpay_signature: string;
    }) => params.onSuccess(response),
    modal: { ondismiss: params.onDismiss },
  });

  razorpay.open();
}
