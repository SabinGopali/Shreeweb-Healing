import React, { useMemo, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import SectionHeading from '../components/SectionHeading';
import { isShreewebPaid, setShreewebPaid } from '../lib/shreewebStorage';
import emailjs from '@emailjs/browser';

const PLAN_LABELS = {
  discovery: 'Discovery Call',
  alignment: 'Energetic Alignment',
  reset: 'Energetic Reset',
  realignment: 'Realignment Program (8 Sessions)',
  transformation: 'Transformation Program (12 Sessions)',
};

function safeJsonStringify(value) {
  try {
    return JSON.stringify(value);
  } catch {
    return '';
  }
}

export default function PaymentConfirmation() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const plan = params.get('plan') || 'discovery';
  const planLabel = PLAN_LABELS[plan] || plan;

  const alreadyPaid = useMemo(() => isShreewebPaid(), []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    orderReference: '',
    goal: '',
    // Plan-specific fields (design-only placeholders; connect backend later)
    discoveryOutcome: '',
    chakraFocus: 'Not sure yet',
    sessionMode: 'Online',
    resetTheme: 'Stress release',
    startWindow: 'Flexible',
  });

  const validate = () => {
    const errs = [];
    if (!form.fullName.trim()) errs.push('Full name is required.');
    if (!form.email.trim()) errs.push('Email is required.');
    if (!/^\\S+@\\S+\\.\\S+$/.test(String(form.email || '').trim())) errs.push('Email is invalid.');
    if (!String(form.phone || '').trim()) errs.push('Phone is required.');
    if (!form.goal.trim()) errs.push('Please tell us your goal (1-2 lines).');
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const errs = validate();
    if (errs.length) {
      setError(errs.join(' '));
      return;
    }

    setLoading(true);
    try {
      const intake = {
        plan,
        planLabel,
        ...form,
        at: new Date().toISOString(),
      };

      window.localStorage.setItem('shreeweb_payment_intake_v1', safeJsonStringify(intake));
      setShreewebPaid(true);

      // Optional: store submission in backend contact list so you can manage it in admin.
      // Note: backend contact endpoint requires phone + subject + message.
      try {
        await fetch('/backend/contact/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: form.fullName,
            email: form.email,
            phone: form.phone,
            subject: `Payment confirmation intake - ${planLabel}`,
            message: `Order ref: ${form.orderReference || '-'}\nGoal: ${form.goal}`,
          }),
        });
      } catch {
        // ignore storage failures; booking can still unlock.
      }

      // Email: implement your email delivery here (email provider / your existing backend mailer / EmailJS).
      // If you configure EmailJS (VITE_EMAILJS_SERVICE_ID + VITE_EMAILJS_TEMPLATE_ID + VITE_EMAILJS_PUBLIC_KEY),
      // this will send a confirmation email to the customer. Otherwise, it will just store the intake.
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

      if (serviceId && templateId && publicKey) {
        try {
          await emailjs.send(serviceId, templateId, {
            to_email: form.email,
            full_name: form.fullName,
            phone: form.phone,
            plan: planLabel,
            order_reference: form.orderReference,
            goal: form.goal,
          }, publicKey);
        } catch {
          // Non-blocking: still unlock booking.
        }
      }

      setSuccess('Intake received. Confirmation email is queued to your inbox (or stored if EmailJS is not configured). Your intake was also saved locally (design preview).');

      // Move user to booking after a short delay.
      window.setTimeout(() => {
        navigate(`/shreeweb/booking?plan=${encodeURIComponent(plan)}`);
      }, 1200);
    } catch (e2) {
      setError(e2?.message || 'Failed to submit intake form.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-10 overflow-x-hidden">
      <SectionHeading
        eyebrow="Payment confirmation"
        title="Submit your intake form"
        subtitle={alreadyPaid ? 'You’re already unlocked. Proceed to booking.' : 'After submitting, booking will unlock automatically.'}
      />

      {alreadyPaid ? (
        <div className="rounded-3xl border border-slate-200 bg-white/60 p-6 shadow-sm backdrop-blur">
          <p className="text-sm text-slate-700">
            Booking is unlocked for: <span className="font-semibold">{planLabel}</span>.
          </p>
          <div className="mt-5">
            <button
              type="button"
              onClick={() => navigate(`/shreeweb/booking?plan=${encodeURIComponent(plan)}`)}
              className="w-full rounded-full bg-orange-100 px-4 py-3 text-sm font-semibold text-orange-800 hover:bg-orange-200"
            >
              Go to booking calendar
            </button>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-white/60 p-6 shadow-sm backdrop-blur">
            <h3 className="text-sm font-bold">Intake form</h3>
            <p className="mt-2 text-sm text-slate-700">
              Fill this in so we can tailor your session for <span className="font-semibold">{planLabel}</span>.
            </p>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <label className="block text-sm">
                <span className="text-slate-700">Full name</span>
                <input
                  className="mt-1 w-full rounded-2xl border border-slate-200 bg-white/70 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-400/30"
                  value={form.fullName}
                  onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
                />
              </label>

              <label className="block text-sm">
                <span className="text-slate-700">Email</span>
                <input
                  type="email"
                  className="mt-1 w-full rounded-2xl border border-slate-200 bg-white/70 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-400/30"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                />
              </label>

              <label className="block text-sm">
                <span className="text-slate-700">Phone</span>
                <input
                  className="mt-1 w-full rounded-2xl border border-slate-200 bg-white/70 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-400/30"
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                />
              </label>

              <label className="block text-sm">
                <span className="text-slate-700">Order reference (optional)</span>
                <input
                  className="mt-1 w-full rounded-2xl border border-slate-200 bg-white/70 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-400/30"
                  value={form.orderReference}
                  onChange={(e) => setForm((f) => ({ ...f, orderReference: e.target.value }))}
                />
              </label>

              <label className="block text-sm">
                <span className="text-slate-700">Your goal (1-2 lines)</span>
                <textarea
                  rows={5}
                  className="mt-1 w-full rounded-2xl border border-slate-200 bg-white/70 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-400/30"
                  value={form.goal}
                  onChange={(e) => setForm((f) => ({ ...f, goal: e.target.value }))}
                />
              </label>

              {plan === 'discovery' ? (
                <label className="block text-sm">
                  <span className="text-slate-700">What would you like to explore?</span>
                  <textarea
                    rows={4}
                    className="mt-1 w-full rounded-2xl border border-slate-200 bg-white/70 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-400/30"
                    value={form.discoveryOutcome}
                    onChange={(e) => setForm((f) => ({ ...f, discoveryOutcome: e.target.value }))}
                    placeholder="e.g., clarity about next steps, reducing internal noise, grounding for the week…"
                  />
                </label>
              ) : null}

              {plan === 'alignment' ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block text-sm">
                    <span className="text-slate-700">Chakra focus</span>
                    <select
                      className="mt-1 w-full rounded-2xl border border-slate-200 bg-white/70 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-400/30"
                      value={form.chakraFocus}
                      onChange={(e) => setForm((f) => ({ ...f, chakraFocus: e.target.value }))}
                    >
                      {[
                        'Not sure yet',
                        'Root (stability)',
                        'Sacral (flow & emotion)',
                        'Solar Plexus (confidence)',
                        'Heart (love & acceptance)',
                        'Throat (expression)',
                        'Third Eye (clarity)',
                        'Crown (alignment)',
                      ].map((x) => (
                        <option key={x} value={x}>
                          {x}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="block text-sm">
                    <span className="text-slate-700">Session mode (design)</span>
                    <select
                      className="mt-1 w-full rounded-2xl border border-slate-200 bg-white/70 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-400/30"
                      value={form.sessionMode}
                      onChange={(e) => setForm((f) => ({ ...f, sessionMode: e.target.value }))}
                    >
                      {['Online', 'In-person'].map((x) => (
                        <option key={x} value={x}>
                          {x}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              ) : null}

              {plan === 'reset' || plan === 'realignment' || plan === 'transformation' ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block text-sm">
                    <span className="text-slate-700">Program theme</span>
                    <select
                      className="mt-1 w-full rounded-2xl border border-slate-200 bg-white/70 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-400/30"
                      value={form.resetTheme}
                      onChange={(e) => setForm((f) => ({ ...f, resetTheme: e.target.value }))}
                    >
                      {['Stress release', 'Sleep & calm', 'Decision clarity', 'Emotional balancing', 'Other'].map((x) => (
                        <option key={x} value={x}>
                          {x}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="block text-sm">
                    <span className="text-slate-700">Start window</span>
                    <select
                      className="mt-1 w-full rounded-2xl border border-slate-200 bg-white/70 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-400/30"
                      value={form.startWindow}
                      onChange={(e) => setForm((f) => ({ ...f, startWindow: e.target.value }))}
                    >
                      {['This week', 'Next week', 'This month', 'Flexible'].map((x) => (
                        <option key={x} value={x}>
                          {x}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              ) : null}

              {error ? <div className="rounded-2xl bg-rose-50 border border-rose-200 p-3 text-sm text-rose-700">{error}</div> : null}
              {success ? <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-3 text-sm text-emerald-700">{success}</div> : null}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-orange-100 px-4 py-3 text-sm font-semibold text-orange-800 hover:bg-orange-200 disabled:opacity-60"
              >
                {loading ? 'Submitting…' : 'Submit & unlock booking'}
              </button>
            </form>
          </div>

          <aside className="rounded-3xl border border-slate-200 bg-white/60 p-6 shadow-sm backdrop-blur">
            <h3 className="text-sm font-bold">What happens next?</h3>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-slate-700">
              <li>We review your intake form.</li>
              <li>A confirmation email is sent with your next steps.</li>
              <li>Your booking calendar unlocks automatically.</li>
            </ol>
          </aside>
        </div>
      )}
    </div>
  );
}

