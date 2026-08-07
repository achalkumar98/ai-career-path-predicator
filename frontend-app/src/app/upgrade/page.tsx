'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CheckCircle, Zap, Star, Crown, ArrowLeft } from 'lucide-react';

const plans = [
  {
    name: 'Basic',
    icon: Zap,
    price: 'Free',
    period: 'forever',
    desc: 'Perfect for getting started with your career journey.',
    color: '#6b7280',
    bg: '#f9fafb',
    border: '#e5e7eb',
    btnBg: '#374151',
    features: [
      '3 Resume builds per month',
      '5 ATS templates',
      'Basic job search links',
      '10 Interview questions',
      'Community support',
    ],
    notIncluded: ['AI mock interviews', 'Priority support', 'Advanced analytics'],
  },
  {
    name: 'Premium',
    icon: Star,
    price: '₹499',
    period: 'per month',
    desc: 'For serious job seekers who want an edge.',
    color: '#2255ec',
    bg: '#fff',
    border: '#2255ec',
    btnBg: '#2255ec',
    popular: true,
    features: [
      'Unlimited resume builds',
      '50+ ATS templates',
      'Smart job search — all portals',
      '500+ Interview questions',
      '10 AI mock interviews/month',
      'Resume score & feedback',
      'Email support',
    ],
    notIncluded: ['Dedicated account manager'],
  },
  {
    name: 'Pro',
    icon: Crown,
    price: '₹999',
    period: 'per month',
    desc: 'Everything you need to land your dream role, fast.',
    color: '#7c3aed',
    bg: '#faf5ff',
    border: '#7c3aed',
    btnBg: '#7c3aed',
    features: [
      'Everything in Premium',
      'Unlimited AI mock interviews',
      'Real-voice AI interview agent',
      'Advanced career analytics',
      'LinkedIn profile review',
      'Priority email & chat support',
      'Dedicated account manager',
    ],
    notIncluded: [],
  },
];

export default function UpgradePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('token'));
  }, []);

  return (
    <div style={{ minHeight: 'calc(100vh - 56px)', background: '#f9fafb', fontFamily: 'Inter, sans-serif' }}>
      {/* Top bar */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e5e7eb', padding: '14px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} className="topbar-pad">
        <Link
          href={isLoggedIn ? '/homepage' : '/'}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', textDecoration: 'none', color: '#374151', fontSize: '13px' }}
        >
          <ArrowLeft size={14} />
          {isLoggedIn ? 'Back to Dashboard' : 'Back to Home'}
        </Link>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
          <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: '#2255ec', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#fff', fontWeight: 800, fontSize: '13px' }}>N</span>
          </div>
          <span style={{ fontSize: '14px', fontWeight: 700, color: '#0f1729' }}>CareerNav</span>
        </Link>
      </div>

      {/* Hero */}
      <div style={{ background: 'linear-gradient(160deg,#f0f4ff 0%,#f9fafb 60%)', borderBottom: '1px solid #e5e7eb', padding: '64px 48px 56px', textAlign: 'center' }} className="hero-pad">
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 14px', borderRadius: '9999px', background: 'rgba(34,85,236,0.07)', border: '1px solid rgba(34,85,236,0.18)', fontSize: '12px', fontWeight: 600, color: '#2255ec', marginBottom: '20px' }}>
          ✦ Simple, transparent pricing
        </div>
        <h1 style={{ fontSize: '42px', fontWeight: 800, color: '#0f1729', marginBottom: '12px' }} className="hero-title">
          Choose Your <span style={{ color: '#2255ec' }}>Plan</span>
        </h1>
        <p style={{ fontSize: '15px', color: '#6b7280', maxWidth: '480px', margin: '0 auto', lineHeight: 1.7 }}>
          Start free, upgrade when you&apos;re ready. No hidden fees, cancel anytime.
        </p>
      </div>

      {/* Plans */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '56px 48px' }} className="page-pad">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '24px', alignItems: 'start' }} className="plans-grid">
          {plans.map(plan => {
            const Icon = plan.icon;
            return (
              <div key={plan.name} style={{ background: plan.bg, border: `2px solid ${plan.border}`, borderRadius: '18px', padding: '32px', position: 'relative', transition: 'box-shadow 200ms, transform 200ms' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 40px rgba(0,0,0,0.1)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = 'none'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}>

                {plan.popular && (
                  <div style={{ position: 'absolute', top: '-13px', left: '50%', transform: 'translateX(-50%)', background: '#2255ec', color: '#fff', fontSize: '11px', fontWeight: 700, padding: '4px 14px', borderRadius: '9999px', whiteSpace: 'nowrap' }}>
                    Most Popular
                  </div>
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: `${plan.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={18} style={{ color: plan.color }} />
                  </div>
                  <p style={{ fontSize: '16px', fontWeight: 700, color: '#0f1729' }}>{plan.name}</p>
                </div>

                <div style={{ marginBottom: '8px' }}>
                  <span style={{ fontSize: '36px', fontWeight: 800, color: '#0f1729' }}>{plan.price}</span>
                  {plan.price !== 'Free' && <span style={{ fontSize: '13px', color: '#6b7280', marginLeft: '4px' }}>/{plan.period}</span>}
                  {plan.price === 'Free' && <span style={{ fontSize: '13px', color: '#6b7280', marginLeft: '6px' }}>{plan.period}</span>}
                </div>
                <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '24px', lineHeight: 1.6 }}>{plan.desc}</p>

                <button
                  disabled
                  style={{ width: '100%', padding: '12px', borderRadius: '10px', background: plan.btnBg, color: '#fff', fontSize: '13px', fontWeight: 600, border: 'none', cursor: 'not-allowed', opacity: 0.85, marginBottom: '24px' }}
                  title="Payment integration coming soon">
                  {plan.price === 'Free' ? 'Get Started Free' : `Get ${plan.name}`}
                </button>

                <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '20px' }}>
                  <p style={{ fontSize: '11px', fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>What&apos;s included</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {plan.features.map(f => (
                      <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                        <CheckCircle size={14} style={{ color: plan.color, flexShrink: 0, marginTop: '1px' }} />
                        <span style={{ fontSize: '13px', color: '#374151' }}>{f}</span>
                      </div>
                    ))}
                    {plan.notIncluded?.map(f => (
                      <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', opacity: 0.4 }}>
                        <CheckCircle size={14} style={{ color: '#9ca3af', flexShrink: 0, marginTop: '1px' }} />
                        <span style={{ fontSize: '13px', color: '#9ca3af', textDecoration: 'line-through' }}>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Note */}
        <p style={{ textAlign: 'center', marginTop: '40px', fontSize: '13px', color: '#9ca3af' }}>
          💳 Payment integration via Razorpay coming soon. Stay tuned!
        </p>
      </div>
    </div>
  );
}
