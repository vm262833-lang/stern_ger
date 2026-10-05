'use client';
import { useEffect, useRef } from 'react';
import katex from 'katex';

export function MathBlock({ label, tex, explanation }) {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) {
      katex.render(tex, ref.current, {
        displayMode: true,
        throwOnError: false,
        trust: true,
      });
    }
  }, [tex]);

  return (
    <div className="math-block">
      {label && <span className="math-block-label">{label}</span>}
      <div ref={ref} />
      {explanation && <div className="math-explanation">{explanation}</div>}
    </div>
  );
}

export function MathInline({ tex }) {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) {
      katex.render(tex, ref.current, {
        displayMode: false,
        throwOnError: false,
        trust: true,
      });
    }
  }, [tex]);

  return <span className="math-inline" ref={ref} />;
}
