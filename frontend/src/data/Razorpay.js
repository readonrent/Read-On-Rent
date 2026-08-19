// Loads the Razorpay checkout.js script once and returns a promise
export function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (document.getElementById('razorpay-sdk')) return resolve(true);
    const script = document.createElement('script');
    script.id = 'razorpay-sdk';
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

/**
 * Opens Razorpay checkout modal.
 * razorpayOrder = { id, amount, currency } — from backend createRazorpayOrder()
 * onSuccess(response) — response has razorpay_payment_id, razorpay_order_id, razorpay_signature
 */
export async function openRazorpayCheckout({ razorpayOrder, keyId, user, onSuccess, onFailure }) {
  const loaded = await loadRazorpayScript();
  if (!loaded) {
    onFailure?.('Razorpay SDK load nahi hua. Internet check karo.');
    return;
  }

  const options = {
    key: keyId, // 👉 Razorpay key_id (public) — put in .env as VITE_RAZORPAY_KEY_ID
    amount: razorpayOrder.amount,
    currency: razorpayOrder.currency || 'INR',
    name: 'Read on Rent',
    description: 'Book Rental Payment',
    order_id: razorpayOrder.id,
    prefill: {
      name: user?.name,
      email: user?.email,
      contact: user?.phone,
    },
    theme: { color: '#FF5A1F' },
    handler: (response) => onSuccess?.(response),
    modal: { ondismiss: () => onFailure?.('Payment cancel kar diya gaya.') },
  };

  const rzp = new window.Razorpay(options);
  rzp.on('payment.failed', (resp) => onFailure?.(resp.error?.description || 'Payment failed'));
  rzp.open();
}