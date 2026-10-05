'use client';
import { useEffect, useRef } from 'react';

export default function useScrollReveal() {
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    );

    const sections = document.querySelectorAll('.content-section');
    sections.forEach(s => observer.observe(s));

    return () => observer.disconnect();
  }, []);

  return ref;
}
