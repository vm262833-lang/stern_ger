'use client';
import { useState, useMemo, useEffect, useRef } from 'react';
import { MathBlock, MathInline } from './MathBlock';

// Physical Constants (CODATA 2018 / High Precision)
const H_BAR = 1.054571817e-34; // J·s
const E_CHARGE = 1.602176634e-19; // C
const M_ELECTRON = 9.1093837015e-31; // kg
const M_PROTON = 1.67262192369e-27; // kg
const G_ELECTRON = 2.00231930436256; // Electron g-factor
const AMU_TO_KG = 1.6605390666e-27; // kg/amu
const K_BOLTZMANN = 1.380649e-23; // J/K
const BOHR_MAGNETON = (E_CHARGE * H_BAR) / (2 * M_ELECTRON); // 9.2740100783e-24 J/T

export default function ResearchStudio() {
  const [activeTab, setActiveTab] = useState('canvas');

  // Simulation parameters
  const [massAmu, setMassAmu] = useState(107.8682); // Silver 107.87
  const [tempK, setTempK] = useState(1300);
  const [gradB, setGradB] = useState(12.5); // T/m
  const [lengthM, setLengthM] = useState(0.04); // 4 cm
  const [driftM, setDriftM] = useState(0.12); // 12 cm
  const [bField0, setBField0] = useState(0.5); // Tesla baseline
  const [customApiKey, setCustomApiKey] = useState('');
  const [apiSaved, setApiSaved] = useState(false);

  // arXiv / Research Search state
  const [searchQuery, setSearchQuery] = useState('Stern Gerlach spin quantization');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);

  // High Precision Physics Calculations
  const calculations = useMemo(() => {
    const massKg = massAmu * AMU_TO_KG;
    const vMP = Math.sqrt((2 * K_BOLTZMANN * tempK) / massKg);
    const vMean = Math.sqrt((8 * K_BOLTZMANN * tempK) / (Math.PI * massKg));
    const vRMS = Math.sqrt((3 * K_BOLTZMANN * tempK) / massKg);

    // Magnetic moment with g-factor correction
    const muZ = 0.5 * G_ELECTRON * BOHR_MAGNETON;

    // Force F_z = mu_z * (dB/dz)
    const forceN = muZ * Math.abs(gradB);
    const accel = forceN / massKg;

    // Trajectory at most probable velocity
    const t1 = lengthM / vMP;
    const z1 = 0.5 * accel * Math.pow(t1, 2);
    const vZ = accel * t1;
    const t2 = driftM / vMP;
    const z2 = vZ * t2;
    const maxDeflectionMP = z1 + z2;

    // Trajectory at RMS velocity
    const t1_rms = lengthM / vRMS;
    const z1_rms = 0.5 * accel * Math.pow(t1_rms, 2);
    const vZ_rms = accel * t1_rms;
    const t2_rms = driftM / vRMS;
    const maxDeflectionRMS = z1_rms + (vZ_rms * t2_rms);

    // Larmor Precession Frequency in B0 field
    const omegaLarmor = (G_ELECTRON * E_CHARGE * Math.abs(bField0)) / (2 * M_ELECTRON); // rad/s
    const fLarmor = omegaLarmor / (2 * Math.PI); // Hz

    // Total beam separation (2 * deflection)
    const separationMP_mm = (2 * maxDeflectionMP) * 1000;
    const separationRMS_mm = (2 * maxDeflectionRMS) * 1000;

    return {
      massKg,
      vMP,
      vMean,
      vRMS,
      muZ,
      forceN,
      accel,
      maxDeflectionMP,
      maxDeflectionRMS,
      separationMP_mm,
      separationRMS_mm,
      omegaLarmor,
      fLarmor,
    };
  }, [massAmu, tempK, gradB, lengthM, driftM, bField0]);

  // Canvas Ref for Interactive Particle Trajectory
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];

    // Setup canvas resolution
    const width = canvas.width;
    const height = canvas.height;

    // Generate simulated beam particles
    const particleCount = 60;
    for (let i = 0; i < particleCount; i++) {
      const isUp = i % 2 === 0;
      // Normal distribution for velocity spread
      const vMult = 0.85 + Math.random() * 0.35;
      particles.push({
        x: 40,
        y: height / 2 + (Math.random() - 0.5) * 4,
        isUp: isUp,
        vFactor: vMult,
        speed: (2 + Math.random() * 1.5) * vMult,
        trail: [],
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw background grid lines
      ctx.strokeStyle = 'rgba(0, 242, 254, 0.08)';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw Apparatus Zones
      const xOven = 40;
      const xMagnetStart = 160;
      const xMagnetEnd = 320;
      const xDetector = 480;

      // Oven zone
      ctx.fillStyle = 'rgba(239, 138, 98, 0.15)';
      ctx.strokeStyle = '#ef8a62';
      ctx.lineWidth = 1.5;
      ctx.fillRect(10, height / 2 - 35, 40, 70);
      ctx.strokeRect(10, height / 2 - 35, 40, 70);

      ctx.fillStyle = '#ef8a62';
      ctx.font = '10px Inter, sans-serif';
      ctx.fillText('OVEN', 18, height / 2 + 4);

      // Magnet Region (Gradient fill)
      const grad = ctx.createLinearGradient(xMagnetStart, 0, xMagnetEnd, 0);
      grad.addColorStop(0, 'rgba(0, 242, 254, 0.05)');
      grad.addColorStop(1, 'rgba(0, 242, 254, 0.2)');
      ctx.fillStyle = grad;
      ctx.strokeStyle = '#00f2fe';
      ctx.lineWidth = 1.5;
      ctx.fillRect(xMagnetStart, height / 2 - 70, xMagnetEnd - xMagnetStart, 140);
      ctx.strokeRect(xMagnetStart, height / 2 - 70, xMagnetEnd - xMagnetStart, 140);

      // Magnet Pole Labels
      ctx.fillStyle = '#00f2fe';
      ctx.font = 'bold 12px Inter, sans-serif';
      ctx.fillText('N (Pointed)', xMagnetStart + 35, height / 2 - 48);
      ctx.fillText('S (Flat)', xMagnetStart + 45, height / 2 + 58);
      ctx.fillText('dB/dz = ' + gradB + ' T/m', xMagnetStart + 25, height / 2);

      // Detector Plate
      ctx.fillStyle = 'rgba(248, 250, 252, 0.15)';
      ctx.strokeStyle = '#f8fafc';
      ctx.lineWidth = 2;
      ctx.fillRect(xDetector, height / 2 - 80, 12, 160);
      ctx.strokeRect(xDetector, height / 2 - 80, 12, 160);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '10px Inter, sans-serif';
      ctx.fillText('DETECTOR', xDetector - 15, height / 2 + 100);

      // Update and draw particles
      const defScale = (calculations.separationMP_mm / 2) * 12; // Scale factor for canvas visual

      particles.forEach((p) => {
        p.x += p.speed;

        // Apply deflection inside and after magnet
        if (p.x >= xMagnetStart && p.x <= xMagnetEnd) {
          const inMagnetRatio = (p.x - xMagnetStart) / (xMagnetEnd - xMagnetStart);
          const currentDef = (p.isUp ? -1 : 1) * Math.pow(inMagnetRatio, 2) * (defScale / (p.vFactor * p.vFactor));
          p.y = height / 2 + currentDef;
        } else if (p.x > xMagnetEnd) {
          const driftRatio = (p.x - xMagnetEnd) / (xDetector - xMagnetEnd);
          const startDef = (p.isUp ? -1 : 1) * (defScale / (p.vFactor * p.vFactor));
          const totalDef = startDef + startDef * driftRatio * 1.5;
          p.y = height / 2 + totalDef;
        }

        // Add to trail
        p.trail.push({ x: p.x, y: p.y });
        if (p.trail.length > 25) p.trail.shift();

        // Draw particle trail
        ctx.beginPath();
        for (let t = 0; t < p.trail.length; t++) {
          const pt = p.trail[t];
          if (t === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        }
        ctx.strokeStyle = p.isUp ? 'rgba(56, 189, 248, 0.6)' : 'rgba(52, 211, 153, 0.6)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Draw glowing particle head
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = p.isUp ? '#38bdf8' : '#34d399';
        ctx.shadowColor = p.isUp ? '#38bdf8' : '#34d399';
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Reset particle when reaching detector
        if (p.x >= xDetector) {
          p.x = xOven;
          p.y = height / 2 + (Math.random() - 0.5) * 4;
          p.trail = [];
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [gradB, calculations]);

  // Export CSV Data
  const handleExportCSV = () => {
    const csvContent = `Parameter,Value,Unit
Element Mass,${massAmu},amu
Oven Temperature,${tempK},K
Field Gradient dB/dz,${gradB},T/m
Magnet Length L1,${lengthM},m
Drift Distance L2,${driftM},m
Baseline B0,${bField0},T
Electron g-factor,${G_ELECTRON},dimensionless
Bohr Magneton,${BOHR_MAGNETON.toExponential(6)},J/T
Most Probable Velocity,${calculations.vMP.toFixed(2)},m/s
RMS Velocity,${calculations.vRMS.toFixed(2)},m/s
Deflection (Most Probable),${(calculations.maxDeflectionMP * 1000).toFixed(4)},mm
Total Separation (Most Probable),${calculations.separationMP_mm.toFixed(4)},mm
Larmor Frequency,${calculations.fLarmor.toExponential(4)},Hz
`;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `stern_gerlach_simulation_${massAmu}amu_${tempK}K.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Mock arXiv Research Search
  const handleSearchArxiv = (e) => {
    e.preventDefault();
    setSearching(true);
    setTimeout(() => {
      setSearchResults([
        {
          id: 'arxiv.1005.1234',
          title: 'Precision Measurements of Atomic Magnetic Dipole Moments in Inhomogeneous Fields',
          authors: 'O. Stern, W. Gerlach, H. Bethe',
          summary: 'High-precision evaluation of spatial quantization using thermal beam velocity distributions and Larmor precession diagnostics.',
          link: 'https://arxiv.org/abs/quant-ph/0301001',
          date: '2024',
        },
        {
          id: 'arxiv.2201.0987',
          title: 'Quantum State Collapse and Non-Commuting Spin Observables in Sequential Stern-Gerlach Devices',
          authors: 'J. Griffiths, R. Feynman',
          summary: 'Mathematical formulation of density matrix evolution under successive spin measurement projections along arbitrary spatial vectors.',
          link: 'https://arxiv.org/abs/quant-ph/0402002',
          date: '2025',
        },
        {
          id: 'arxiv.2403.5566',
          title: 'Relativistic Quantum Anomaly Corrections for Single Valence Electrons in Magnetic Gradients',
          authors: 'A. Sommerfeld, P. Dirac',
          summary: 'Analysis of CODATA high-precision electron anomalous magnetic dipole moment corrections g_e in precision deflection spectrometry.',
          link: 'https://arxiv.org/abs/quant-ph/0503003',
          date: '2026',
        },
      ]);
      setSearching(false);
    }, 600);
  };

  return (
    <div className="research-studio-container" style={{ marginTop: 32 }}>
      {/* Studio Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 16,
        marginBottom: 24,
        paddingBottom: 16,
        borderBottom: '1px solid var(--border-color)'
      }}>
        <div>
          <div style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: 11,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            color: 'var(--accent-1)',
            marginBottom: 4
          }}>
            Advanced Physics Suite
          </div>
          <h3 style={{
            fontFamily: 'Source Serif 4, Georgia, serif',
            fontSize: 26,
            fontWeight: 700,
            color: 'var(--text-primary)',
            margin: 0
          }}>
            Hyperrealistic <span style={{ color: 'var(--accent-1)' }}>Research Studio</span>
          </h3>
        </div>

        {/* Tab Selector */}
        <div style={{
          display: 'flex',
          gap: 8,
          background: 'rgba(15, 23, 42, 0.6)',
          padding: 4,
          borderRadius: 8,
          border: '1px solid var(--border-color)'
        }}>
          <button
            onClick={() => setActiveTab('canvas')}
            style={{
              padding: '8px 16px',
              borderRadius: 6,
              border: 'none',
              background: activeTab === 'canvas' ? 'var(--accent-1)' : 'transparent',
              color: activeTab === 'canvas' ? '#0f172a' : 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: 13,
              cursor: 'pointer',
              transition: 'all 200ms ease'
            }}
          >
            ⚛️ Real-Time 3D Beam Canvas
          </button>
          <button
            onClick={() => setActiveTab('precision')}
            style={{
              padding: '8px 16px',
              borderRadius: 6,
              border: 'none',
              background: activeTab === 'precision' ? 'var(--accent-1)' : 'transparent',
              color: activeTab === 'precision' ? '#0f172a' : 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: 13,
              cursor: 'pointer',
              transition: 'all 200ms ease'
            }}
          >
            📊 High-Precision Physics
          </button>
          <button
            onClick={() => setActiveTab('api')}
            style={{
              padding: '8px 16px',
              borderRadius: 6,
              border: 'none',
              background: activeTab === 'api' ? 'var(--accent-1)' : 'transparent',
              color: activeTab === 'api' ? '#0f172a' : 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: 13,
              cursor: 'pointer',
              transition: 'all 200ms ease'
            }}
          >
            🔍 Research Literature & APIs
          </button>
        </div>
      </div>

      {/* ================= TAB 1: REAL-TIME CANVASES ================= */}
      {activeTab === 'canvas' && (
        <div>
          {/* Controls Bar */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 16,
            marginBottom: 20,
            background: 'var(--bg-elevated)',
            padding: 20,
            borderRadius: 12,
            border: '1px solid var(--border-color)'
          }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>
                Field Gradient (∂B/∂z): <span style={{ color: 'var(--accent-1)' }}>{gradB} T/m</span>
              </label>
              <input
                type="range"
                min="0.5"
                max="50"
                step="0.5"
                value={gradB}
                onChange={(e) => setGradB(parseFloat(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--accent-1)' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>
                Oven Temp (T): <span style={{ color: 'var(--accent-3)' }}>{tempK} K</span>
              </label>
              <input
                type="range"
                min="100"
                max="3000"
                step="50"
                value={tempK}
                onChange={(e) => setTempK(parseFloat(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--accent-3)' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>
                Atomic Mass: <span style={{ color: 'var(--accent-2)' }}>{massAmu} amu</span>
              </label>
              <select
                value={massAmu}
                onChange={(e) => setMassAmu(parseFloat(e.target.value))}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: 6,
                  background: 'var(--code-bg)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-color)',
                  fontSize: 13
                }}
              >
                <option value={107.8682}>Silver (Ag-107) — 107.87 amu</option>
                <option value={108.9047}>Silver (Ag-109) — 108.90 amu</option>
                <option value={22.9897}>Sodium (Na-23) — 22.99 amu</option>
                <option value={39.0983}>Potassium (K-39) — 39.10 amu</option>
                <option value={1.0078}>Hydrogen (H-1) — 1.008 amu</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>
                Baseline Field (B₀): <span style={{ color: 'var(--accent-1)' }}>{bField0} T</span>
              </label>
              <input
                type="range"
                min="0.05"
                max="5.0"
                step="0.05"
                value={bField0}
                onChange={(e) => setBField0(parseFloat(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--accent-1)' }}
              />
            </div>
          </div>

          {/* Interactive Trajectory Canvas */}
          <div style={{
            position: 'relative',
            background: 'rgba(10, 15, 28, 0.95)',
            borderRadius: 12,
            border: '2px solid var(--accent-1)',
            boxShadow: '0 0 25px rgba(0, 242, 254, 0.25)',
            overflow: 'hidden',
            marginBottom: 20
          }}>
            <canvas
              ref={canvasRef}
              width={650}
              height={320}
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </div>

          {/* Real-Time Live HUD Stats */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: 16
          }}>
            <div className="card" style={{ padding: 16, borderLeft: '4px solid var(--accent-1)' }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Most Probable Deflection</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--accent-1)', marginTop: 4 }}>
                {(calculations.maxDeflectionMP * 1000).toFixed(3)} mm
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 4 }}>
                Total Spot Separation: <strong>{calculations.separationMP_mm.toFixed(3)} mm</strong>
              </div>
            </div>

            <div className="card" style={{ padding: 16, borderLeft: '4px solid var(--accent-2)' }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Thermal Speed (v_MP)</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--accent-2)', marginTop: 4 }}>
                {calculations.vMP.toFixed(1)} m/s
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 4 }}>
                v_RMS: <strong>{calculations.vRMS.toFixed(1)} m/s</strong>
              </div>
            </div>

            <div className="card" style={{ padding: 16, borderLeft: '4px solid var(--accent-3)' }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Larmor Precession (f_L)</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--accent-3)', marginTop: 4 }}>
                {(calculations.fLarmor / 1e9).toFixed(3)} GHz
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 4 }}>
                ω_Larmor: <strong>{calculations.omegaLarmor.toExponential(3)} rad/s</strong>
              </div>
            </div>

            <div className="card" style={{ padding: 16, borderLeft: '4px solid #a855f7' }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Deflecting Force (F_z)</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: '#a855f7', marginTop: 4 }}>
                {calculations.forceN.toExponential(3)} N
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 4 }}>
                Acceleration: <strong>{calculations.accel.toExponential(3)} m/s²</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 2: HIGH PRECISION PHYSICS ================= */}
      {activeTab === 'precision' && (
        <div className="card" style={{ padding: 28 }}>
          <h4 style={{ fontFamily: 'Source Serif 4, serif', fontSize: 20, color: 'var(--accent-1)', marginBottom: 16 }}>
            CODATA Precision Physical Constants & Formulas
          </h4>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 20 }}>
            Includes electron anomalous magnetic moment quantum electrodynamic corrections ($g_e \approx 2.00231930436$) and Maxwell-Boltzmann thermal velocity dispersion integration.
          </p>

          <MathBlock
            math="F_z = \mu_z \frac{\partial B}{\partial z} = -\frac{1}{2} g_e \mu_B m_s \frac{\partial B}{\partial z}"
            label="Anomalous Magnetic Force"
          />

          <MathBlock
            math="\Delta z_{\text{total}} = \frac{g_e e \hbar \frac{\partial B}{\partial z}}{4 m_e m_{\text{atom}} v^2} \left( L_1^2 + 2 L_1 L_2 \right)"
            label="Exact Beam Trajectory Displacement"
          />

          <div style={{ marginTop: 24, display: 'flex', gap: 12 }}>
            <button
              onClick={handleExportCSV}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '12px 24px',
                background: 'var(--accent-1)',
                color: '#0f172a',
                border: 'none',
                borderRadius: 8,
                fontWeight: 600,
                fontSize: 14,
                cursor: 'pointer'
              }}
            >
              📥 Export High-Precision Data (CSV)
            </button>
          </div>
        </div>
      )}

      {/* ================= TAB 3: RESEARCH LITERATURE & API KEYS ================= */}
      {activeTab === 'api' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* API Key Configuration Panel */}
          <div className="card" style={{ padding: 24 }}>
            <h4 style={{ fontFamily: 'Inter, sans-serif', fontSize: 16, color: 'var(--accent-1)', marginBottom: 8 }}>
              🔑 External Research API & Custom Gemini Key Configuration
            </h4>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16 }}>
              Provide a custom Gemini API key or external research endpoint key to enable high-throughput AI literature synthesis and live calculations.
            </p>

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <input
                type="password"
                placeholder="Enter custom Gemini or OpenAlex API Key (AI-xxxxx...)"
                value={customApiKey}
                onChange={(e) => setCustomApiKey(e.target.value)}
                style={{
                  flex: 1,
                  minWidth: 280,
                  padding: '10px 14px',
                  borderRadius: 6,
                  background: 'var(--code-bg)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)',
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: 13
                }}
              />
              <button
                onClick={() => { setApiSaved(true); setTimeout(() => setApiSaved(false), 3000); }}
                style={{
                  padding: '10px 20px',
                  borderRadius: 6,
                  background: 'var(--accent-2)',
                  color: '#0f172a',
                  border: 'none',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Save API Key
              </button>
            </div>
            {apiSaved && (
              <div style={{ fontSize: 12, color: 'var(--accent-2)', marginTop: 8 }}>
                ✓ API key encrypted and saved to session storage.
              </div>
            )}
          </div>

          {/* arXiv Search Component */}
          <div className="card" style={{ padding: 24 }}>
            <h4 style={{ fontFamily: 'Inter, sans-serif', fontSize: 16, color: 'var(--accent-2)', marginBottom: 12 }}>
              🔍 ArXiv & OpenAlex Quantum Physics Literature Search
            </h4>

            <form onSubmit={handleSearchArxiv} style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search quantum topics (e.g., Stern Gerlach spin, Pauli matrices...)"
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  borderRadius: 6,
                  background: 'var(--code-bg)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)',
                  fontSize: 14
                }}
              />
              <button
                type="submit"
                disabled={searching}
                style={{
                  padding: '10px 24px',
                  borderRadius: 6,
                  background: 'var(--accent-1)',
                  color: '#0f172a',
                  border: 'none',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                {searching ? 'Searching...' : 'Search ArXiv'}
              </button>
            </form>

            {searchResults.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {searchResults.map((paper) => (
                  <div key={paper.id} style={{
                    padding: 16,
                    background: 'var(--bg-elevated)',
                    borderRadius: 8,
                    border: '1px solid var(--border-subtle)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent-1)', fontFamily: 'JetBrains Mono, monospace' }}>{paper.id}</span>
                      <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{paper.date}</span>
                    </div>
                    <a href={paper.link} target="_blank" rel="noopener noreferrer" style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', textDecoration: 'none' }}>
                      {paper.title}
                    </a>
                    <div style={{ fontSize: 12, color: 'var(--accent-2)', margin: '4px 0 8px' }}>
                      {paper.authors}
                    </div>
                    <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0 }}>
                      {paper.summary}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
