import React, { useMemo, useState } from 'react';

export default function FaqSection() {
  const faqs = useMemo(
    () => [
      {
        q: 'Is this medical treatment?',
        a: 'No. These sessions are wellness experiences and are not a substitute for medical diagnosis or treatment.',
      },
      {
        q: 'Do I need to prepare before the session?',
        a: 'Bring curiosity and a calm intention. After booking, you can share what you want to work on in the intake form.',
      },
      {
        q: 'Where are sessions held?',
        a: 'This is a design preview. Replace with your real policy (online/in-person, location, and availability).',
      },
      {
        q: 'How does the payment unlock booking?',
        a: 'In this design preview, booking is unlocked after you submit the intake form following payment.',
      },
    ],
    []
  );

  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section className="py-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 space-y-2 text-center">
          <div className="text-xs font-semibold tracking-widest text-slate-600">FAQ</div>
          <h3 className="text-2xl font-extrabold tracking-tight">Questions, answered gently</h3>
        </div>

        <div className="mx-auto w-full max-w-3xl space-y-3">
          {faqs.map((f, idx) => {
            const open = openIndex === idx;
            return (
              <div key={f.q} className="rounded-3xl border border-slate-200 bg-white/60 p-4 shadow-sm">
                <button
                  type="button"
                  className="flex w-full items-start justify-between gap-3 text-left"
                  onClick={() => setOpenIndex(open ? null : idx)}
                >
                  <span className="text-sm font-bold text-slate-900">{f.q}</span>
                  <span className="text-slate-500">{open ? '−' : '+'}</span>
                </button>
                {open ? <p className="mt-3 text-sm leading-relaxed text-slate-700">{f.a}</p> : null}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

