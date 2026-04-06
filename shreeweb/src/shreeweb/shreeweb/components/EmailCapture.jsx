import React, { useState } from 'react';

function EmailCapture({
  context = '',
  buttonText = 'Stay Updated',
  placeholderText = 'your@email.com',
}) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const val = String(email || '').trim();
    if (!val) {
      setError('Email is required.');
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(val)) {
      setError('Please enter a valid email.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/backend/email-captures/capture', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: val,
          source: 'shreeweb',
          context: context || 'general',
          tags: context ? [context] : []
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to save email');
      }

      setSuccess('Thanks! We\'ll reach out with updates and availability.');
      setEmail('');
    } catch (err) {
      console.error('Error capturing email:', err);
      setError(err.message || 'Failed to save email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <form onSubmit={submit} className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <label className="flex-1">
            <span className="sr-only">Email</span>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={placeholderText}
              className="w-full rounded-full border border-stone-200 bg-white px-4 py-3 text-stone-800 outline-none focus:ring-2 focus:ring-stone-400/30 focus:border-stone-400"
            />
          </label>
          <button
            type="submit"
            disabled={loading}
            className="rounded-full bg-orange-100 px-6 py-3 text-orange-800 font-medium hover:bg-orange-200 disabled:opacity-60 transition-colors whitespace-nowrap"
          >
            {loading ? 'Saving…' : buttonText}
          </button>
        </div>
        
        {error && (
          <div className="text-sm text-red-600 text-center">{error}</div>
        )}
        {success && (
          <div className="text-sm text-green-600 text-center">{success}</div>
        )}
      </form>
    </div>
  );
}

export default EmailCapture;