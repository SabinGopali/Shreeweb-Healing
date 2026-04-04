import React from 'react';

export default function SectionHeading({ eyebrow, title, subtitle }) {
  return (
    <div className="space-y-2 text-center">
      {eyebrow ? <div className="text-xs font-semibold tracking-widest text-slate-600">{eyebrow}</div> : null}
      <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">{title}</h2>
      {subtitle ? <p className="mx-auto max-w-2xl text-sm text-slate-600 sm:text-base">{subtitle}</p> : null}
    </div>
  );
}

