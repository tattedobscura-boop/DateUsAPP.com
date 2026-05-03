import { useState } from 'react';

/**
 * Calls our /api/checkout endpoint and redirects to Stripe's hosted page.
 * The secret key never touches the browser — it lives in server.js only.
 */
export function useStripeCheckout() {
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  const startCheckout = async (plan) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan,
          successUrl: `${window.location.origin}?payment=success&plan=${plan}`,
          cancelUrl:  `${window.location.origin}?payment=cancelled`,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Checkout failed');
      window.location.href = data.url;
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return { startCheckout, loading, error };
}
