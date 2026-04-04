import React, { useEffect, useMemo, useState } from 'react';
import { CmsHtmlPreview, stripHtmlToText } from '../cms/cmsRichTextUtils';

const fallbackSettings = {
  sectionTitle: 'What People Are Saying',
  sectionDescription: 'A few words from people who chose alignment for sustainable growth.',
  initialVisible: 3,
  loadMoreText: 'Load More Stories',
  backgroundColor: '#EDE7DC',
};

const fallbackTestimonials = [
  {
    name: 'Anita',
    role: 'Founder',
    rating: 5,
    quote:
      '<p>The sessions felt calm and deeply focused. I noticed clarity returning without forcing it, and my week became easier to manage.</p>',
  },
  {
    name: 'Rajan',
    role: 'Senior professional',
    rating: 5,
    quote:
      '<p>After the alignment, I stopped carrying tension unconsciously. Decisions felt simpler and my energy felt more steady.</p>',
  },
  {
    name: 'Mira',
    role: 'Career transition',
    rating: 4,
    quote:
      '<p>The process helped me release mental noise and reconnect with what matters. I felt lighter and more confident.</p>',
  },
  {
    name: 'Suresh',
    role: 'Entrepreneur',
    rating: 5,
    quote:
      '<p>I felt less resistance when planning next steps. The session left me grounded, and my follow-through improved.</p>',
  },
  {
    name: 'Nisha',
    role: 'Professional',
    rating: 4,
    quote:
      '<p>Even one session gave me better clarity. It felt like my body finally matched my intention.</p>',
  },
  {
    name: 'Kiran',
    role: 'Life transition',
    rating: 5,
    quote:
      '<p>I was surprised by how calm I felt afterward. The change stayed, and my focus became more consistent.</p>',
  },
];

function Stars({ rating = 5 }) {
  const full = Math.max(0, Math.min(5, Number(rating || 0)));
  return (
    <div className="flex items-center gap-1" aria-label={`${full} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => {
        const on = i < full;
        return (
          <span key={i} className={`text-lg ${on ? 'text-amber-500' : 'text-stone-300'}`}>
            ★
          </span>
        );
      })}
    </div>
  );
}

export default function TestimonialsSection() {
  const [settings, setSettings] = useState(fallbackSettings);
  const [testimonials, setTestimonials] = useState(fallbackTestimonials);
  const [visibleCount, setVisibleCount] = useState(fallbackSettings.initialVisible);

  useEffect(() => {
    let mounted = true;
    const run = async () => {
      try {
        const res = await fetch('/backend/shreeweb-testimonials-enhanced/public', { cache: 'no-store' });
        if (!res.ok) return;
        const data = await res.json().catch(() => ({}));
        if (!mounted || !data?.success || !data?.data) return;

        const nextSettings = data.data.settings || fallbackSettings;
        const nextTestimonials = Array.isArray(data.data.testimonials) ? data.data.testimonials : fallbackTestimonials;

        setSettings(nextSettings);
        setTestimonials(nextTestimonials.length ? nextTestimonials : fallbackTestimonials);
      } catch {
        // keep fallback
      }
    };
    run();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const initial = Number(settings.initialVisible) || fallbackSettings.initialVisible;
    setVisibleCount((prev) => Math.min(testimonials.length, Math.max(1, initial, prev || initial)));
  }, [settings.initialVisible, testimonials.length]);

  const visibleTestimonials = useMemo(() => testimonials.slice(0, visibleCount), [testimonials, visibleCount]);

  return (
    <section 
      className="py-16 px-4"
      style={{ backgroundColor: settings.backgroundColor || fallbackSettings.backgroundColor }}
      data-aos="fade-up"
      data-aos-duration="300"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center" data-aos="fade-up" data-aos-duration="200" data-aos-delay="100">
          <h2 className="text-3xl font-serif text-stone-800 mb-4">{stripHtmlToText(settings.sectionTitle)}</h2>
          <p className="mx-auto max-w-2xl text-lg text-stone-600 leading-relaxed">
            {stripHtmlToText(settings.sectionDescription)}
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {visibleTestimonials.map((t, index) => (
            <article
              key={t.id || stripHtmlToText(t.name) || index}
              className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow"
              data-aos="fade-up"
              data-aos-duration="200"
              data-aos-delay={200 + index * 100}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-stone-800 text-white rounded-full flex items-center justify-center font-medium">
                  {(stripHtmlToText(t.name) || 'A').slice(0, 1)}
                </div>
                <div>
                  <div className="font-serif text-stone-800">{stripHtmlToText(t.name)}</div>
                  {t.role ? <div className="text-sm text-stone-600">{stripHtmlToText(t.role)}</div> : null}
                </div>
              </div>
              
              <div className="mb-4">
                <Stars rating={t.rating} />
              </div>
              
              <blockquote className="text-stone-700 leading-relaxed italic">
                <CmsHtmlPreview html={t.quote} />
              </blockquote>
            </article>
          ))}
        </div>

        {testimonials.length > visibleTestimonials.length && (
          <div 
            className="mt-12 text-center"
            data-aos="fade-up"
            data-aos-duration="200"
            data-aos-delay="600"
          >
            <button
              type="button"
              onClick={() => setVisibleCount((c) => Math.min(testimonials.length, c + 3))}
              className="px-8 py-3 bg-stone-200 text-stone-800 rounded-full hover:bg-stone-300 transition-colors font-medium"
            >
              {settings.loadMoreText || fallbackSettings.loadMoreText}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}