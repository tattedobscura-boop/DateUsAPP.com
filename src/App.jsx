import { useEffect, useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import OnboardingPage from './pages/OnboardingPage';
import AppShell from './pages/app/AppShell';
import AdminPage from './pages/AdminPage';

function Router() {
  const { page, upgradePlan } = useApp();
  const [toast, setToast] = useState(null);
  if (window.location.pathname === '/admin') return <AdminPage />;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const payment = params.get('payment');
    const plan    = params.get('plan');
    if (payment === 'success' && plan) {
      upgradePlan(plan);
      setToast({ type: 'success', msg: `🎉 Welcome to DateUs ${plan.charAt(0).toUpperCase() + plan.slice(1)}!` });
      window.history.replaceState({}, '', window.location.pathname);
    } else if (payment === 'cancelled') {
      setToast({ type: 'info', msg: 'Checkout cancelled — no charge made.' });
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(t);
  }, [toast]);

  return (
    <>
      {page === 'landing'    && <LandingPage />}
      {page === 'auth'       && <AuthPage />}
      {page === 'onboarding' && <OnboardingPage />}
      {page === 'app'        && <AppShell />}
      {!['landing','auth','onboarding','app'].includes(page) && <LandingPage />}

      {toast && (
        <div style={{
          position: 'fixed', bottom: 32, left: '50%', transform: 'translateX(-50%)',
          zIndex: 9999, borderRadius: 14, padding: '13px 22px',
          background: toast.type === 'success' ? 'linear-gradient(135deg,#c9815a,#9b4468)' : '#1e1a2e',
          border: toast.type === 'success' ? 'none' : '1px solid rgba(255,245,235,0.1)',
          color: 'white', fontSize: 14, fontWeight: 600,
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          whiteSpace: 'nowrap', fontFamily: 'DM Sans, sans-serif',
          animation: 'fadeInDown 0.3s ease',
        }}>
          {toast.msg}
        </div>
      )}
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Router />
    </AppProvider>
  );
}
