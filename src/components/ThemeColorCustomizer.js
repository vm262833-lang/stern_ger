'use client';
import { useState, useEffect } from 'react';

const PRESETS = [
  {
    id: 'piano-black',
    name: 'Polished Piano Black (Obsidian Sheen)',
    iconColor: '#38bdf8',
    subColor: '#000000',
    vars: {
      '--bg-primary': '#000000',
      '--bg-surface': 'rgba(4, 4, 6, 0.94)',
      '--bg-elevated': 'rgba(12, 12, 16, 0.96)',
      '--bg-hover': 'rgba(24, 24, 32, 0.98)',
      '--text-primary': '#ffffff',
      '--text-secondary': '#d1d5db',
      '--text-muted': '#9ca3af',
      '--accent-1': '#ef8a62',
      '--accent-2': '#38bdf8',
      '--accent-3': '#fbbf24',
      '--accent-1-dim': 'rgba(239, 138, 98, 0.15)',
      '--accent-2-dim': 'rgba(56, 189, 248, 0.15)',
      '--accent-3-dim': 'rgba(251, 191, 36, 0.15)',
      '--border-color': 'rgba(255, 255, 255, 0.14)',
      '--border-subtle': 'rgba(255, 255, 255, 0.07)',
      '--code-bg': '#000000',
      '--shadow-sm': '0 4px 14px rgba(0, 0, 0, 0.9)',
      '--shadow-md': '0 12px 36px rgba(0, 0, 0, 0.95)',
      '--shadow-lg': '0 24px 60px rgba(0, 0, 0, 0.98)',
    }
  },
  {
    id: 'red-black',
    name: 'Red & Black (Cyber Lab)',
    iconColor: '#e11d48',
    subColor: '#0a0a0a',
    vars: {
      '--bg-primary': '#0a0a0a',
      '--bg-surface': '#161416',
      '--bg-elevated': '#22191d',
      '--bg-hover': '#2f1f25',
      '--text-primary': '#fce7eb',
      '--text-secondary': '#d19aa6',
      '--text-muted': '#966773',
      '--accent-1': '#e11d48',
      '--accent-2': '#fb7185',
      '--accent-3': '#fda4af',
      '--accent-1-dim': 'rgba(225, 29, 72, 0.15)',
      '--accent-2-dim': 'rgba(251, 113, 133, 0.12)',
      '--accent-3-dim': 'rgba(253, 164, 175, 0.10)',
      '--border-color': '#421620',
      '--border-subtle': '#2a1117',
      '--code-bg': '#120b0d',
      '--shadow-sm': '0 1px 3px rgba(0, 0, 0, 0.6)',
      '--shadow-md': '0 4px 12px rgba(225, 29, 72, 0.15)',
      '--shadow-lg': '0 8px 30px rgba(0, 0, 0, 0.8)',
    }
  },
  {
    id: 'midnight-scholar',
    name: 'Midnight Scholar (Dark)',
    iconColor: '#ef8a62',
    subColor: '#1c1917',
    vars: {
      '--bg-primary': '#1c1917',
      '--bg-surface': '#292524',
      '--bg-elevated': '#333029',
      '--bg-hover': '#3d3832',
      '--text-primary': '#e7e5e4',
      '--text-secondary': '#a8a29e',
      '--text-muted': '#78716c',
      '--accent-1': '#ef8a62',
      '--accent-2': '#7dd3b3',
      '--accent-3': '#fbbf24',
      '--accent-1-dim': 'rgba(239, 138, 98, 0.12)',
      '--accent-2-dim': 'rgba(125, 211, 179, 0.10)',
      '--accent-3-dim': 'rgba(251, 191, 36, 0.10)',
      '--border-color': '#44403c',
      '--border-subtle': '#3a3633',
      '--code-bg': '#1a1815',
    }
  },
  {
    id: 'warm-lab',
    name: 'Warm Lab (Aged Paper)',
    iconColor: '#c0583a',
    subColor: '#faf8f5',
    vars: {
      '--bg-primary': '#faf8f5',
      '--bg-surface': '#ffffff',
      '--bg-elevated': '#f5f2ed',
      '--bg-hover': '#eee9e2',
      '--text-primary': '#2d2a26',
      '--text-secondary': '#6b6560',
      '--text-muted': '#9a9490',
      '--accent-1': '#c0583a',
      '--accent-2': '#2a6b4e',
      '--accent-3': '#d4a847',
      '--accent-1-dim': 'rgba(192, 88, 58, 0.08)',
      '--accent-2-dim': 'rgba(42, 107, 78, 0.07)',
      '--accent-3-dim': 'rgba(212, 168, 71, 0.08)',
      '--border-color': '#e8e4de',
      '--border-subtle': '#f0ece6',
      '--code-bg': '#f0ece6',
    }
  },
  {
    id: 'chalkboard',
    name: 'Physics Chalkboard',
    iconColor: '#f4d35e',
    subColor: '#1a291e',
    vars: {
      '--bg-primary': '#16241a',
      '--bg-surface': '#1f3325',
      '--bg-elevated': '#284230',
      '--bg-hover': '#32523d',
      '--text-primary': '#f0e6d2',
      '--text-secondary': '#b8c9a9',
      '--text-muted': '#8a9b7c',
      '--accent-1': '#f4d35e',
      '--accent-2': '#ee6c4d',
      '--accent-3': '#7ec8e3',
      '--accent-1-dim': 'rgba(244, 211, 94, 0.12)',
      '--accent-2-dim': 'rgba(238, 108, 77, 0.12)',
      '--accent-3-dim': 'rgba(126, 200, 227, 0.12)',
      '--border-color': '#3b5842',
      '--border-subtle': '#2d4533',
      '--code-bg': '#121d15',
    }
  },
  {
    id: 'deep-cobalt',
    name: 'Deep Cobalt & Cyan',
    iconColor: '#38bdf8',
    subColor: '#0b1120',
    vars: {
      '--bg-primary': '#0b1120',
      '--bg-surface': '#131e36',
      '--bg-elevated': '#1b2a4c',
      '--bg-hover': '#243763',
      '--text-primary': '#f1f5f9',
      '--text-secondary': '#94a3b8',
      '--text-muted': '#64748b',
      '--accent-1': '#38bdf8',
      '--accent-2': '#818cf8',
      '--accent-3': '#34d399',
      '--accent-1-dim': 'rgba(56, 189, 248, 0.12)',
      '--accent-2-dim': 'rgba(129, 140, 248, 0.12)',
      '--accent-3-dim': 'rgba(52, 211, 153, 0.12)',
      '--border-color': '#203358',
      '--border-subtle': '#182743',
      '--code-bg': '#070b16',
    }
  }
];

export default function ThemeColorCustomizer() {
  const [isOpen, setIsOpen] = useState(false);
  const [activePreset, setActivePreset] = useState('piano-black');
  const [customColors, setCustomColors] = useState({
    bgPrimary: '#030305',
    bgSurface: '#0c0c10',
    accent1: '#ef8a62',
    textPrimary: '#f8fafc',
  });

  // Apply colors to :root CSS variables
  const applyCSSVars = (vars) => {
    const root = document.documentElement;
    Object.entries(vars).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
  };

  // Load saved custom theme from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('sg_custom_theme');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.preset) {
          setActivePreset(parsed.preset);
          const p = PRESETS.find(item => item.id === parsed.preset);
          if (p) applyCSSVars(p.vars);
        }
        if (parsed.custom) {
          setCustomColors(parsed.custom);
          if (parsed.isCustom) {
            applyCustom(parsed.custom);
          }
        }
      }
    } catch {
      // ignore
    }
  }, []);

  const selectPreset = (preset) => {
    setActivePreset(preset.id);
    applyCSSVars(preset.vars);
    setCustomColors({
      bgPrimary: preset.vars['--bg-primary'] || '#1c1917',
      bgSurface: preset.vars['--bg-surface'] || '#292524',
      accent1: preset.vars['--accent-1'] || '#ef8a62',
      textPrimary: preset.vars['--text-primary'] || '#e7e5e4',
    });
    try {
      localStorage.setItem('sg_custom_theme', JSON.stringify({ preset: preset.id, isCustom: false }));
    } catch {}
  };

  const applyCustom = (colors) => {
    const vars = {
      '--bg-primary': colors.bgPrimary,
      '--bg-surface': colors.bgSurface,
      '--text-primary': colors.textPrimary,
      '--accent-1': colors.accent1,
      '--accent-1-dim': `${colors.accent1}22`,
      '--border-color': `${colors.textPrimary}26`,
      '--border-subtle': `${colors.textPrimary}12`,
    };
    applyCSSVars(vars);
  };

  const handleCustomChange = (key, val) => {
    const updated = { ...customColors, [key]: val };
    setCustomColors(updated);
    setActivePreset('custom');
    applyCustom(updated);
    try {
      localStorage.setItem('sg_custom_theme', JSON.stringify({ preset: 'custom', isCustom: true, custom: updated }));
    } catch {}
  };

  const resetToDefault = () => {
    const defaultPreset = PRESETS[0]; // Polished Piano Black
    selectPreset(defaultPreset);
    document.documentElement.removeAttribute('style');
    try {
      localStorage.removeItem('sg_custom_theme');
    } catch {}
  };

  return (
    <div className="theme-dock-container">
      {/* Floating Toggle Button */}
      <button
        type="button"
        className={`theme-dock-toggle ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        title="Customize UI Colors & Themes"
        aria-label="Theme Color Customizer"
      >
        <span className="theme-dock-pixel-icon" style={{ backgroundColor: customColors.accent1 }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c3.31 0 6-2.69 6-6 0-4.96-4.49-9-10-9z"/>
            <circle cx="6.5" cy="11.5" r="1.5" fill="currentColor"/>
            <circle cx="9.5" cy="7.5" r="1.5" fill="currentColor"/>
            <circle cx="14.5" cy="7.5" r="1.5" fill="currentColor"/>
            <circle cx="17.5" cy="11.5" r="1.5" fill="currentColor"/>
          </svg>
        </span>
        <span className="theme-dock-label">Theme Studio</span>
      </button>

      {/* Floating Popover Dock */}
      {isOpen && (
        <div className="theme-dock-popover">
          <div className="theme-dock-header">
            <div className="theme-dock-title">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="var(--accent-1)" strokeWidth="2">
                <rect x="2" y="2" width="20" height="20" rx="3"/>
                <path d="M7 2v20M17 2v20M2 12h20M2 7h20M2 17h20"/>
              </svg>
              <span>Pixel & Color Studio</span>
            </div>
            <button
              type="button"
              className="theme-dock-close"
              onClick={() => setIsOpen(false)}
              aria-label="Close customizer"
            >
              ✕
            </button>
          </div>

          <div className="theme-dock-section">
            <label className="theme-dock-subtitle">Curated Pixel Presets</label>
            <div className="theme-preset-grid">
              {PRESETS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  className={`theme-preset-card ${activePreset === p.id ? 'active' : ''}`}
                  onClick={() => selectPreset(p)}
                >
                  <div className="theme-preset-pixel-preview">
                    <span className="pixel-box" style={{ backgroundColor: p.subColor }} />
                    <span className="pixel-box" style={{ backgroundColor: p.iconColor }} />
                  </div>
                  <span className="theme-preset-name">{p.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="theme-dock-section">
            <label className="theme-dock-subtitle">Custom Color Pickers</label>
            <div className="theme-color-inputs">
              <div className="theme-color-row">
                <label htmlFor="bg-primary-picker">
                  <span className="color-swatch-chip" style={{ backgroundColor: customColors.bgPrimary }} />
                  <span>Background</span>
                </label>
                <input
                  id="bg-primary-picker"
                  type="color"
                  value={customColors.bgPrimary}
                  onChange={(e) => handleCustomChange('bgPrimary', e.target.value)}
                />
              </div>

              <div className="theme-color-row">
                <label htmlFor="bg-surface-picker">
                  <span className="color-swatch-chip" style={{ backgroundColor: customColors.bgSurface }} />
                  <span>Cards / Surface</span>
                </label>
                <input
                  id="bg-surface-picker"
                  type="color"
                  value={customColors.bgSurface}
                  onChange={(e) => handleCustomChange('bgSurface', e.target.value)}
                />
              </div>

              <div className="theme-color-row">
                <label htmlFor="accent1-picker">
                  <span className="color-swatch-chip" style={{ backgroundColor: customColors.accent1 }} />
                  <span>Primary Accent</span>
                </label>
                <input
                  id="accent1-picker"
                  type="color"
                  value={customColors.accent1}
                  onChange={(e) => handleCustomChange('accent1', e.target.value)}
                />
              </div>

              <div className="theme-color-row">
                <label htmlFor="text-primary-picker">
                  <span className="color-swatch-chip" style={{ backgroundColor: customColors.textPrimary }} />
                  <span>Text Color</span>
                </label>
                <input
                  id="text-primary-picker"
                  type="color"
                  value={customColors.textPrimary}
                  onChange={(e) => handleCustomChange('textPrimary', e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="theme-dock-footer">
            <button
              type="button"
              className="theme-reset-btn"
              onClick={resetToDefault}
            >
              Reset to Default
            </button>
            <span className="theme-status-text">
              {activePreset === 'custom' ? 'Custom Live' : 'Preset Active'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
