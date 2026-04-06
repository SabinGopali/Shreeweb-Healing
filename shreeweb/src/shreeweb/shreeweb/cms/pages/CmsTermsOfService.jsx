import { useState, useEffect } from 'react';
import { cmsTheme } from '../shreewebCmsTheme';

export default function CmsTermsOfService() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [termsData, setTermsData] = useState(null);
  const [activeTab, setActiveTab] = useState('hero');

  useEffect(() => {
    fetchTermsData();
  }, []);

  const fetchTermsData = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch('/backend/shreeweb-terms-of-service', {
        credentials: 'include',
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.message || 'Failed to fetch');
      if (data.success) setTermsData(data.data);
      else throw new Error('Invalid response');
    } catch (err) {
      console.error('Error:', err);
      setError(err.message || 'Failed to load');
    } finally {
      setLoading(false);
    }
  };

  const updateSection = async (section, updates) => {
    try {
      setSaving(true);
      const response = await fetch(`/backend/shreeweb-terms-of-service/section/${section}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(updates),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.message || 'Failed to update');
      if (data.success) {
        setTermsData(data.data);
        alert('Updated successfully!');
      }
    } catch (err) {
      alert(err.message || 'Failed to update');
    } finally {
      setSaving(false);
    }
  };

  const updateArrayField = (section, field, index, value) => {
    const updated = { ...termsData };
    updated[section][field][index] = value;
    setTermsData(updated);
  };

  const addArrayItem = (section, field) => {
    const updated = { ...termsData };
    if (!updated[section][field]) updated[section][field] = [];
    updated[section][field].push('');
    setTermsData(updated);
  };

  const removeArrayItem = (section, field, index) => {
    const updated = { ...termsData };
    updated[section][field].splice(index, 1);
    setTermsData(updated);
  };

  if (loading) return (
    <div className={cmsTheme.pageWrap}>
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-stone-600">Loading...</p>
        </div>
      </div>
    </div>
  );

  if (error) return (
    <div className={cmsTheme.pageWrap}>
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-stone-900 mb-2">Failed to Load</h3>
        <p className="text-stone-600 mb-4">{error}</p>
        <button onClick={fetchTermsData} className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700">
          Retry
        </button>
      </div>
    </div>
  );

  if (!termsData) return <div className={cmsTheme.pageWrap}><p>No data available</p></div>;

  const tabs = [
    { id: 'hero', label: 'Hero & Intro' },
    { id: 'nature', label: '1. Nature' },
    { id: 'scope', label: '2. Scope' },
    { id: 'substitute', label: '3. Not Substitute' },
    { id: 'responsibility', label: '4. Responsibility' },
    { id: 'payments', label: '5. Payments' },
    { id: 'rescheduling', label: '6. Rescheduling' },
    { id: 'boundaries', label: '7. Boundaries' },
    { id: 'ip', label: '8. IP' },
    { id: 'liability', label: '9. Liability' },
    { id: 'updates', label: '10. Updates' },
  ];

  return (
    <div className={cmsTheme.pageWrap}>
      <div className="mb-8">
        <h1 className={`${cmsTheme.title} text-2xl`}>Terms of Service Management</h1>
        <p className="text-stone-600 mt-2">Manage all sections</p>
      </div>

      <div className="mb-6 border-b border-stone-200 overflow-x-auto">
        <div className="flex gap-2 min-w-max">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id ? 'border-amber-600 text-amber-600' : 'border-transparent text-stone-600'
              }`}>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        {/* Hero & Intro Tab */}
        {activeTab === 'hero' && (
          <>
            <div className={`${cmsTheme.card} ${cmsTheme.cardPadding}`}>
              <h2 className={`${cmsTheme.title} text-xl mb-4`}>Hero Section</h2>
              <form onSubmit={(e) => {
                e.preventDefault();
                const fd = new FormData(e.target);
                updateSection('hero', { tag: fd.get('tag'), title: fd.get('title'), subtitle: fd.get('subtitle'), description: fd.get('description') });
              }} className="space-y-4">
                <div><label className={cmsTheme.label}>Tag</label><input type="text" name="tag" defaultValue={termsData.hero?.tag} className={cmsTheme.input} /></div>
                <div><label className={cmsTheme.label}>Title</label><input type="text" name="title" defaultValue={termsData.hero?.title} className={cmsTheme.input} /></div>
                <div><label className={cmsTheme.label}>Subtitle</label><input type="text" name="subtitle" defaultValue={termsData.hero?.subtitle} className={cmsTheme.input} /></div>
                <div><label className={cmsTheme.label}>Description</label><textarea name="description" defaultValue={termsData.hero?.description} rows={3} className={cmsTheme.input} /></div>
                <button type="submit" disabled={saving} className={cmsTheme.btnPrimary}>{saving ? 'Saving...' : 'Update Hero'}</button>
              </form>
            </div>
            <div className={`${cmsTheme.card} ${cmsTheme.cardPadding}`}>
              <h2 className={`${cmsTheme.title} text-xl mb-4`}>Last Updated & Introduction</h2>
              <form onSubmit={async (e) => {
                e.preventDefault();
                const fd = new FormData(e.target);
                await updateSection('lastUpdatedDate', fd.get('lastUpdatedDate'));
                await updateSection('introduction', { description: fd.get('introDescription') });
              }} className="space-y-4">
                <div><label className={cmsTheme.label}>Last Updated</label><input type="text" name="lastUpdatedDate" defaultValue={termsData.lastUpdatedDate} className={cmsTheme.input} /></div>
                <div><label className={cmsTheme.label}>Introduction</label><textarea name="introDescription" defaultValue={termsData.introduction?.description} rows={2} className={cmsTheme.input} /></div>
                <button type="submit" disabled={saving} className={cmsTheme.btnPrimary}>{saving ? 'Saving...' : 'Update'}</button>
              </form>
            </div>
          </>
        )}

        {/* 1. Nature of Services */}
        {activeTab === 'nature' && (
          <div className={`${cmsTheme.card} ${cmsTheme.cardPadding}`}>
            <h2 className={`${cmsTheme.title} text-xl mb-4`}>1. Nature of Services</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.target);
              updateSection('natureOfServices', { title: fd.get('title'), description: fd.get('description'), note: fd.get('note') });
            }} className="space-y-4">
              <div><label className={cmsTheme.label}>Title</label><input type="text" name="title" defaultValue={termsData.natureOfServices?.title} className={cmsTheme.input} /></div>
              <div><label className={cmsTheme.label}>Description</label><textarea name="description" defaultValue={termsData.natureOfServices?.description} rows={2} className={cmsTheme.input} /></div>
              <div><label className={cmsTheme.label}>Note</label><textarea name="note" defaultValue={termsData.natureOfServices?.note} rows={2} className={cmsTheme.input} /></div>
              <button type="submit" disabled={saving} className={cmsTheme.btnPrimary}>{saving ? 'Saving...' : 'Update'}</button>
            </form>
          </div>
        )}

        {/* 2. Scope & Expectations */}
        {activeTab === 'scope' && (
          <div className={`${cmsTheme.card} ${cmsTheme.cardPadding}`}>
            <h2 className={`${cmsTheme.title} text-xl mb-4`}>2. Scope & Expectations</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.target);
              updateSection('scopeExpectations', { title: fd.get('title'), description: fd.get('description'), note: fd.get('note') });
            }} className="space-y-4">
              <div><label className={cmsTheme.label}>Title</label><input type="text" name="title" defaultValue={termsData.scopeExpectations?.title} className={cmsTheme.input} /></div>
              <div><label className={cmsTheme.label}>Description</label><textarea name="description" defaultValue={termsData.scopeExpectations?.description} rows={2} className={cmsTheme.input} /></div>
              <div><label className={cmsTheme.label}>Note</label><textarea name="note" defaultValue={termsData.scopeExpectations?.note} rows={2} className={cmsTheme.input} /></div>
              <button type="submit" disabled={saving} className={cmsTheme.btnPrimary}>{saving ? 'Saving...' : 'Update'}</button>
            </form>
          </div>
        )}

        {/* 3. Not a Substitute */}
        {activeTab === 'substitute' && (
          <div className={`${cmsTheme.card} ${cmsTheme.cardPadding}`}>
            <h2 className={`${cmsTheme.title} text-xl mb-4`}>3. Not a Substitute</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.target);
              updateSection('notSubstitute', { title: fd.get('title'), description: fd.get('description'), note: fd.get('note') });
            }} className="space-y-4">
              <div><label className={cmsTheme.label}>Title</label><input type="text" name="title" defaultValue={termsData.notSubstitute?.title} className={cmsTheme.input} /></div>
              <div><label className={cmsTheme.label}>Description</label><textarea name="description" defaultValue={termsData.notSubstitute?.description} rows={2} className={cmsTheme.input} /></div>
              <div><label className={cmsTheme.label}>Note</label><textarea name="note" defaultValue={termsData.notSubstitute?.note} rows={2} className={cmsTheme.input} /></div>
              <button type="submit" disabled={saving} className={cmsTheme.btnPrimary}>{saving ? 'Saving...' : 'Update'}</button>
            </form>
          </div>
        )}

        {/* 4. Personal Responsibility */}
        {activeTab === 'responsibility' && (
          <div className={`${cmsTheme.card} ${cmsTheme.cardPadding}`}>
            <h2 className={`${cmsTheme.title} text-xl mb-4`}>4. Personal Responsibility</h2>
            <div className="space-y-4">
              <div><label className={cmsTheme.label}>Title</label><input type="text" value={termsData.personalResponsibility?.title || ''} onChange={(e) => { const u = {...termsData}; u.personalResponsibility.title = e.target.value; setTermsData(u); }} className={cmsTheme.input} /></div>
              <div><label className={cmsTheme.label}>Description</label><textarea value={termsData.personalResponsibility?.description || ''} onChange={(e) => { const u = {...termsData}; u.personalResponsibility.description = e.target.value; setTermsData(u); }} rows={2} className={cmsTheme.input} /></div>
              <div>
                <label className={cmsTheme.label}>Items</label>
                {termsData.personalResponsibility?.items?.map((item, i) => (
                  <div key={i} className="flex gap-2 mb-2">
                    <input type="text" value={item} onChange={(e) => updateArrayField('personalResponsibility', 'items', i, e.target.value)} className={cmsTheme.input} />
                    <button type="button" onClick={() => removeArrayItem('personalResponsibility', 'items', i)} className="px-3 py-2 bg-red-100 text-red-700 rounded-lg">Remove</button>
                  </div>
                ))}
                <button type="button" onClick={() => addArrayItem('personalResponsibility', 'items')} className="mt-2 px-4 py-2 bg-stone-100 text-stone-700 rounded-lg text-sm">+ Add Item</button>
              </div>
              <button onClick={() => updateSection('personalResponsibility', termsData.personalResponsibility)} disabled={saving} className={cmsTheme.btnPrimary}>{saving ? 'Saving...' : 'Update'}</button>
            </div>
          </div>
        )}

        {/* 5. Payments & Commitment */}
        {activeTab === 'payments' && (
          <div className={`${cmsTheme.card} ${cmsTheme.cardPadding}`}>
            <h2 className={`${cmsTheme.title} text-xl mb-4`}>5. Payments & Commitment</h2>
            <div className="space-y-4">
              <div><label className={cmsTheme.label}>Title</label><input type="text" value={termsData.paymentsCommitment?.title || ''} onChange={(e) => { const u = {...termsData}; u.paymentsCommitment.title = e.target.value; setTermsData(u); }} className={cmsTheme.input} /></div>
              <div>
                <label className={cmsTheme.label}>Items</label>
                {termsData.paymentsCommitment?.items?.map((item, i) => (
                  <div key={i} className="flex gap-2 mb-2">
                    <input type="text" value={item} onChange={(e) => updateArrayField('paymentsCommitment', 'items', i, e.target.value)} className={cmsTheme.input} />
                    <button type="button" onClick={() => removeArrayItem('paymentsCommitment', 'items', i)} className="px-3 py-2 bg-red-100 text-red-700 rounded-lg">Remove</button>
                  </div>
                ))}
                <button type="button" onClick={() => addArrayItem('paymentsCommitment', 'items')} className="mt-2 px-4 py-2 bg-stone-100 text-stone-700 rounded-lg text-sm">+ Add Item</button>
              </div>
              <button onClick={() => updateSection('paymentsCommitment', termsData.paymentsCommitment)} disabled={saving} className={cmsTheme.btnPrimary}>{saving ? 'Saving...' : 'Update'}</button>
            </div>
          </div>
        )}

        {/* 6. Rescheduling */}
        {activeTab === 'rescheduling' && (
          <div className={`${cmsTheme.card} ${cmsTheme.cardPadding}`}>
            <h2 className={`${cmsTheme.title} text-xl mb-4`}>6. Rescheduling & Missed Sessions</h2>
            <div className="space-y-4">
              <div><label className={cmsTheme.label}>Title</label><input type="text" value={termsData.reschedulingMissed?.title || ''} onChange={(e) => { const u = {...termsData}; u.reschedulingMissed.title = e.target.value; setTermsData(u); }} className={cmsTheme.input} /></div>
              <div>
                <label className={cmsTheme.label}>Items</label>
                {termsData.reschedulingMissed?.items?.map((item, i) => (
                  <div key={i} className="flex gap-2 mb-2">
                    <input type="text" value={item} onChange={(e) => updateArrayField('reschedulingMissed', 'items', i, e.target.value)} className={cmsTheme.input} />
                    <button type="button" onClick={() => removeArrayItem('reschedulingMissed', 'items', i)} className="px-3 py-2 bg-red-100 text-red-700 rounded-lg">Remove</button>
                  </div>
                ))}
                <button type="button" onClick={() => addArrayItem('reschedulingMissed', 'items')} className="mt-2 px-4 py-2 bg-stone-100 text-stone-700 rounded-lg text-sm">+ Add Item</button>
              </div>
              <button onClick={() => updateSection('reschedulingMissed', termsData.reschedulingMissed)} disabled={saving} className={cmsTheme.btnPrimary}>{saving ? 'Saving...' : 'Update'}</button>
            </div>
          </div>
        )}

        {/* 7. Energetic Boundaries */}
        {activeTab === 'boundaries' && (
          <div className={`${cmsTheme.card} ${cmsTheme.cardPadding}`}>
            <h2 className={`${cmsTheme.title} text-xl mb-4`}>7. Energetic Boundaries</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.target);
              updateSection('energeticBoundaries', { title: fd.get('title'), description: fd.get('description'), note: fd.get('note') });
            }} className="space-y-4">
              <div><label className={cmsTheme.label}>Title</label><input type="text" name="title" defaultValue={termsData.energeticBoundaries?.title} className={cmsTheme.input} /></div>
              <div><label className={cmsTheme.label}>Description</label><textarea name="description" defaultValue={termsData.energeticBoundaries?.description} rows={2} className={cmsTheme.input} /></div>
              <div><label className={cmsTheme.label}>Note</label><textarea name="note" defaultValue={termsData.energeticBoundaries?.note} rows={2} className={cmsTheme.input} /></div>
              <button type="submit" disabled={saving} className={cmsTheme.btnPrimary}>{saving ? 'Saving...' : 'Update'}</button>
            </form>
          </div>
        )}

        {/* 8. Intellectual Property */}
        {activeTab === 'ip' && (
          <div className={`${cmsTheme.card} ${cmsTheme.cardPadding}`}>
            <h2 className={`${cmsTheme.title} text-xl mb-4`}>8. Intellectual Property</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.target);
              updateSection('intellectualProperty', { title: fd.get('title'), description: fd.get('description'), note: fd.get('note') });
            }} className="space-y-4">
              <div><label className={cmsTheme.label}>Title</label><input type="text" name="title" defaultValue={termsData.intellectualProperty?.title} className={cmsTheme.input} /></div>
              <div><label className={cmsTheme.label}>Description</label><textarea name="description" defaultValue={termsData.intellectualProperty?.description} rows={2} className={cmsTheme.input} /></div>
              <div><label className={cmsTheme.label}>Note</label><textarea name="note" defaultValue={termsData.intellectualProperty?.note} rows={2} className={cmsTheme.input} /></div>
              <button type="submit" disabled={saving} className={cmsTheme.btnPrimary}>{saving ? 'Saving...' : 'Update'}</button>
            </form>
          </div>
        )}

        {/* 9. Limitation of Liability */}
        {activeTab === 'liability' && (
          <div className={`${cmsTheme.card} ${cmsTheme.cardPadding}`}>
            <h2 className={`${cmsTheme.title} text-xl mb-4`}>9. Limitation of Liability</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.target);
              updateSection('limitationLiability', { title: fd.get('title'), description: fd.get('description') });
            }} className="space-y-4">
              <div><label className={cmsTheme.label}>Title</label><input type="text" name="title" defaultValue={termsData.limitationLiability?.title} className={cmsTheme.input} /></div>
              <div><label className={cmsTheme.label}>Description</label><textarea name="description" defaultValue={termsData.limitationLiability?.description} rows={3} className={cmsTheme.input} /></div>
              <button type="submit" disabled={saving} className={cmsTheme.btnPrimary}>{saving ? 'Saving...' : 'Update'}</button>
            </form>
          </div>
        )}

        {/* 10. Updates to Terms */}
        {activeTab === 'updates' && (
          <div className={`${cmsTheme.card} ${cmsTheme.cardPadding}`}>
            <h2 className={`${cmsTheme.title} text-xl mb-4`}>10. Updates to Terms</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.target);
              updateSection('updatesToTerms', { title: fd.get('title'), description: fd.get('description') });
            }} className="space-y-4">
              <div><label className={cmsTheme.label}>Title</label><input type="text" name="title" defaultValue={termsData.updatesToTerms?.title} className={cmsTheme.input} /></div>
              <div><label className={cmsTheme.label}>Description</label><textarea name="description" defaultValue={termsData.updatesToTerms?.description} rows={3} className={cmsTheme.input} /></div>
              <button type="submit" disabled={saving} className={cmsTheme.btnPrimary}>{saving ? 'Saving...' : 'Update'}</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
