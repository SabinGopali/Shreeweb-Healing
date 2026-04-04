import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import SectionHeading from '../components/SectionHeading';
import ShopifyShopNowEmbed from '../components/ShopifyShopNowEmbed';
import BookingCalendar from '../components/BookingCalendar';
import EmailCapture from '../components/EmailCapture';
import { clearShreewebPaid, isShreewebPaid, setShreewebPaid } from '../lib/shreewebStorage';

const PLAN_LABELS = {
  discovery: 'Discovery Call',
  alignment: 'Energetic Alignment',
  reset: 'Energetic Reset',
  realignment: 'Realignment Program (8 Sessions)',
  transformation: 'Transformation Program (12 Sessions)',
};

export default function Booking() {
  const [params] = useSearchParams();
  const plan = params.get('plan') || 'discovery';
  const [paid, setPaid] = useState(() => isShreewebPaid());
  const planLabel = PLAN_LABELS[plan] || plan;

  useEffect(() => {
    // Design-only payment gate:
    // - `paid=1` can be used to preview the booking calendar flow.
    // - Real integration can replace this gate later via backend/webhook verification.
    const paidQuery = params.get('paid');
    if (paidQuery === '1') {
      setShreewebPaid(true);
      setPaid(true);
    } else {
      setPaid(isShreewebPaid());
    }
  }, [params]);

  return (
    <div className="space-y-8 pb-10 overflow-x-hidden">
      <SectionHeading
        eyebrow="Booking"
        title="Book your session"
        subtitle={
          paid
            ? `You’re unlocked for: ${planLabel}.`
            : 'Complete payment to unlock the calendar (design gate; unlock after intake submit).'
        }
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-4">
          {paid ? (
            <BookingCalendar />
          ) : (
            <ShopifyShopNowEmbed />
          )}

          <div className="rounded-3xl border border-slate-200 bg-white/60 p-6 shadow-sm backdrop-blur">
            <h3 className="text-sm font-bold">Before you book</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-700">
              <li>1. Pay via Shopify.</li>
              <li>2. You’ll be redirected to the confirmation page.</li>
              <li>3. Submit the intake form to unlock booking.</li>
            </ul>

            {!paid ? (
              <div className="mt-5">
                <Link
                  to={`/shreeweb/payment-confirmation?plan=${encodeURIComponent(plan)}`}
                  className="inline-flex w-full items-center justify-center rounded-full bg-orange-100 px-4 py-3 text-sm font-semibold text-orange-800 hover:bg-orange-200"
                >
                  Go to intake form
                </Link>
              </div>
            ) : null}
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-3xl border border-slate-200 bg-white/60 p-6 shadow-sm backdrop-blur">
            <h3 className="text-sm font-bold">Stay in the loop</h3>
            <p className="mt-2 text-sm text-slate-700">Get gentle updates and availability reminders.</p>
            <div className="mt-4">
              <EmailCapture context={planLabel} />
            </div>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white/60 p-6 shadow-sm backdrop-blur">
            <h3 className="text-sm font-bold">Need help?</h3>
            <p className="mt-2 text-sm text-slate-700">Contact us if you have questions before booking.</p>
            <div className="mt-4">
              <Link
                to="/shreeweb/contact"
                className="inline-flex w-full items-center justify-center rounded-full border border-orange-200 bg-orange-50 px-4 py-3 text-sm font-semibold text-orange-800 hover:bg-orange-100"
              >
                Contact us
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

