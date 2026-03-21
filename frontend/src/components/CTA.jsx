import { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { EnrollmentForm } from './EnrollmentForm';
import { getHomeContent } from '../utils/homeStore';

export const CTA = () => {
  const [showEnrollmentForm, setShowEnrollmentForm] = useState(false);
  const [content, setContent] = useState(() => getHomeContent().cta);

  useEffect(() => {
    const sync = () => { if (!document.hidden) setContent(getHomeContent().cta); };
    document.addEventListener('visibilitychange', sync);
    return () => document.removeEventListener('visibilitychange', sync);
  }, []);

  return (
    <>
      <section className="bg-white py-16 px-8 text-center">
        <button
          onClick={() => setShowEnrollmentForm(true)}
          className="inline-flex items-center gap-3 bg-brand-primary text-white px-12 py-4 rounded-full font-bold text-base hover:bg-brand-primary/90 transition-all hover:-translate-y-0.5 active:scale-95 shadow-lg shadow-brand-primary/25"
        >
          {content.buttonText} <ArrowRight size={18} />
        </button>
      </section>

      <EnrollmentForm isOpen={showEnrollmentForm} onClose={() => setShowEnrollmentForm(false)} />
    </>
  );
};
