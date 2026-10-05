'use client';
import { useState, useMemo } from 'react';
import { MathBlock, MathInline } from './MathBlock';
import { ELEMENTS_Z1_TO_60, getElementByZ } from '../data/elementsData';

// Physical Constants in SI units
const H_BAR = 1.054571817e-34; // J·s
const E_CHARGE = 1.602176634e-19; // J/eV
const M_ELECTRON = 9.1093837e-31; // kg
const M_PROTON = 1.6726219e-27; // kg
const M_ALPHA = 6.644657e-27; // kg
const AMU_TO_KG = 1.6605390666e-27; // kg/amu
const K_BOLTZMANN = 1.380649e-23; // J/K
const BOHR_MAGNETON = 9.274010078e-24; // J/T (A·m²)

export default function QuantumCalculators() {
  const [activeTab, setActiveTab] = useState('atomic-z');

  // ================= TAB 1: ATOMIC Z SPLITTING =================
  const [selectedZ, setSelectedZ] = useState(47); // Default to Silver (Z=47)
  const element = useMemo(() => getElementByZ(selectedZ), [selectedZ]);

  // ================= TAB 2: STERN-GERLACH DEFLECTION =================
  const [sgPreset, setSgPreset] = useState('Ag');
  const [sgMassAmu, setSgMassAmu] = useState(107.87); // amu
  const [sgGradB, setSgGradB] = useState(10.0); // T/m (Tesla per meter)
  const [sgTempK, setSgTempK] = useState(1300); // Kelvin
  const [sgLengthM, setSgLengthM] = useState(0.035); // 3.5 cm = 0.035 m
  const [sgDriftM, setSgDriftM] = useState(0.10); // 10 cm = 0.10 m

  const handleSgPreset = (elemKey) => {
    setSgPreset(elemKey);
    if (elemKey === 'Ag') {
      setSgMassAmu(107.87);
      setSgTempK(1300);
    } else if (elemKey === 'H') {
      setSgMassAmu(1.008);
      setSgTempK(300);
    } else if (elemKey === 'Na') {
      setSgMassAmu(22.99);
      setSgTempK(600);
    } else if (elemKey === 'K') {
      setSgMassAmu(39.10);
      setSgTempK(500);
    }
  };

  const sgResults = useMemo(() => {
    const massKg = sgMassAmu * AMU_TO_KG;
    // Mean thermal velocity v = sqrt(3 k_B T / m)
    const velocity = Math.sqrt((3 * K_BOLTZMANN * Math.max(1, sgTempK)) / massKg);
    // Force F_z = mu_B * (dB/dz)
    const forceN = BOHR_MAGNETON * Math.abs(sgGradB);
    // Acceleration a_z = F_z / m
    const accel = forceN / massKg;
    // Time in magnet t1 = L1 / v
    const t1 = sgLengthM / velocity;
    // Deflection at magnet exit delta_z1 = 0.5 * a * t1^2
    const deltaZ1 = 0.5 * accel * Math.pow(t1, 2);
    // Transverse velocity v_z = a * t1
    const vZ = accel * t1;
    // Drift time t2 = L2 / v
    const t2 = sgDriftM / velocity;
    // Drift deflection delta_z2 = v_z * t2
    const deltaZ2 = vZ * t2;
    // Total deflection from center = delta_z1 + delta_z2
    const totalDeflectionM = deltaZ1 + deltaZ2;
    // Beam separation between + and - spins = 2 * totalDeflection
    const totalSeparationMm = (2 * totalDeflectionM) * 1000;

    return {
      massKg,
      velocity,
      forceN,
      accel,
      t1,
      vZ,
      totalDeflectionM,
      totalSeparationMm,
    };
  }, [sgMassAmu, sgGradB, sgTempK, sgLengthM, sgDriftM]);

  // ================= TAB 3: SEQUENTIAL SG =================
  const [seqAngleDeg, setSeqAngleDeg] = useState(45); // Angle theta in degrees

  const seqResults = useMemo(() => {
    const rad = (seqAngleDeg * Math.PI) / 180;
    const halfAngle = rad / 2;
    const pPlusTheta = Math.pow(Math.cos(halfAngle), 2);
    const pMinusTheta = Math.pow(Math.sin(halfAngle), 2);

    // Probability of passing SG3(+z) after SG2(+theta)
    const pFinalPlusZ = pPlusTheta * Math.pow(Math.cos(halfAngle), 2);
    // Probability of passing SG3(-z) after SG2(+theta)
    const pFinalMinusZ = pPlusTheta * Math.pow(Math.sin(halfAngle), 2);

    return {
      rad,
      pPlusTheta,
      pMinusTheta,
      pFinalPlusZ,
      pFinalMinusZ,
      pctPlusTheta: (pPlusTheta * 100).toFixed(1),
      pctMinusTheta: (pMinusTheta * 100).toFixed(1),
      pctFinalPlusZ: (pFinalPlusZ * 100).toFixed(1),
      pctFinalMinusZ: (pFinalMinusZ * 100).toFixed(1),
    };
  }, [seqAngleDeg]);

  // ================= TAB 4: QUANTUM TUNNELING =================
  const [particleType, setParticleType] = useState('electron');
  const [customMassKg, setCustomMassKg] = useState(M_ELECTRON);
  const [energyEv, setEnergyEv] = useState(2.0); // 2 eV
  const [barrierV0Ev, setBarrierV0Ev] = useState(5.0); // 5 eV
  const [barrierWidthNm, setBarrierWidthNm] = useState(0.5); // 0.5 nm

  const handleParticleChange = (type) => {
    setParticleType(type);
    if (type === 'electron') setCustomMassKg(M_ELECTRON);
    else if (type === 'proton') setCustomMassKg(M_PROTON);
    else if (type === 'alpha') setCustomMassKg(M_ALPHA);
  };

  const tunnelingResults = useMemo(() => {
    const mass = particleType === 'custom' ? customMassKg : (
      particleType === 'proton' ? M_PROTON : (particleType === 'alpha' ? M_ALPHA : M_ELECTRON)
    );
    const energyJ = Math.max(0.0001, energyEv) * E_CHARGE;
    const v0J = Math.max(0.0001, barrierV0Ev) * E_CHARGE;
    const widthM = barrierWidthNm * 1e-9;

    // Free wavevector k = sqrt(2 m E) / hbar
    const kMeters = Math.sqrt(2 * mass * energyJ) / H_BAR;
    const kNm = kMeters / 1e9; // in nm^-1
    const deBroglieNm = (2 * Math.PI) / kNm; // lambda in nm

    // Inside barrier kappa = sqrt(2 m (V0 - E)) / hbar (when V0 > E)
    let kappaMeters = 0;
    let kappaNm = 0;
    let transCoeff = 1.0;

    if (v0J > energyJ) {
      kappaMeters = Math.sqrt(2 * mass * (v0J - energyJ)) / H_BAR;
      kappaNm = kappaMeters / 1e9;
      // WKB / Exact transmission T for rectangular barrier
      const sinhTerm = Math.sinh(kappaMeters * widthM);
      const denominator = 1 + (Math.pow(v0J, 2) * Math.pow(sinhTerm, 2)) / (4 * energyJ * (v0J - energyJ));
      transCoeff = 1 / Math.max(1, denominator);
    } else {
      // Over-barrier transmission
      const kPrime = Math.sqrt(2 * mass * (energyJ - v0J)) / H_BAR;
      const sinTerm = Math.sin(kPrime * widthM);
      const denom = 1 + (Math.pow(v0J, 2) * Math.pow(sinTerm, 2)) / (4 * energyJ * (energyJ - v0J));
      transCoeff = 1 / Math.max(1, denom);
    }

    return {
      kMeters,
      kNm,
      deBroglieNm,
      kappaMeters,
      kappaNm,
      transCoeff,
      transPercent: (transCoeff * 100).toExponential(3),
    };
  }, [particleType, customMassKg, energyEv, barrierV0Ev, barrierWidthNm]);

  return (
    <div className="quantum-calc-container">
      {/* Tab Navigation */}
      <div className="quantum-calc-tabs">
        <button
          type="button"
          className={`quantum-calc-tab-btn ${activeTab === 'atomic-z' ? 'active' : ''}`}
          onClick={() => setActiveTab('atomic-z')}
        >
          <span className="tab-badge">Z = 1..60</span>
          <span>Atomic Beam Splitting</span>
        </button>
        <button
          type="button"
          className={`quantum-calc-tab-btn ${activeTab === 'sg-deflection' ? 'active' : ''}`}
          onClick={() => setActiveTab('sg-deflection')}
        >
          <span className="tab-badge">F_z & Δz</span>
          <span>Stern-Gerlach Deflection</span>
        </button>
        <button
          type="button"
          className={`quantum-calc-tab-btn ${activeTab === 'seq-sg' ? 'active' : ''}`}
          onClick={() => setActiveTab('seq-sg')}
        >
          <span className="tab-badge">cos²(θ/2)</span>
          <span>Sequential SG Probabilities</span>
        </button>
        <button
          type="button"
          className={`quantum-calc-tab-btn ${activeTab === 'tunneling' ? 'active' : ''}`}
          onClick={() => setActiveTab('tunneling')}
        >
          <span className="tab-badge">k = √(2mE)/ħ</span>
          <span>Quantum Tunneling</span>
        </button>
      </div>

      {/* ===================== TAB 1: ATOMIC Z SPLITTING ===================== */}
      {activeTab === 'atomic-z' && (
        <div className="calc-tab-panel">
          <div className="calc-panel-header">
            <h3>Atomic Number Splitting Calculator (<MathInline tex="Z = 1 \text{ to } 60" />)</h3>
            <p>
              In a Stern-Gerlach inhomogeneous magnetic field, an incident atomic beam splits into exactly{' '}
              <strong><MathInline tex="2J + 1" /></strong> components, where <MathInline tex="J" /> is the total electronic angular momentum of the atom&apos;s ground state. Closed-shell atoms with <MathInline tex="J = 0" /> pass undeflected (<MathInline tex="2(0)+1 = 1" /> spot).
            </p>
          </div>

          <div className="calc-grid-layout">
            {/* Input Controls */}
            <div className="calc-card inputs-card">
              <div className="calc-card-title">Select Atomic Number (Z)</div>

              <div className="calc-field">
                <div className="calc-field-header">
                  <label htmlFor="z-slider">Atomic Number <MathInline tex="Z" />: <strong>{selectedZ}</strong> ({element.name})</label>
                  <input
                    id="z-number"
                    type="number"
                    min="1"
                    max="60"
                    value={selectedZ}
                    onChange={(e) => setSelectedZ(Math.max(1, Math.min(60, parseInt(e.target.value) || 1)))}
                    className="calc-number-input"
                  />
                </div>
                <input
                  id="z-slider"
                  type="range"
                  min="1"
                  max="60"
                  value={selectedZ}
                  onChange={(e) => setSelectedZ(parseInt(e.target.value))}
                  className="calc-slider"
                />
                <div className="slider-ticks">
                  <span>1 (H)</span>
                  <span>15 (P)</span>
                  <span>30 (Zn)</span>
                  <span>47 (Ag)</span>
                  <span>60 (Nd)</span>
                </div>
              </div>

              {/* Quick Preset Buttons */}
              <div className="calc-quick-pills">
                <span className="quick-pills-label">Key Milestones:</span>
                {[
                  { z: 1, label: '¹H' },
                  { z: 2, label: '²He' },
                  { z: 7, label: '⁷N' },
                  { z: 8, label: '⁸O' },
                  { z: 24, label: '²⁴Cr' },
                  { z: 26, label: '²⁶Fe' },
                  { z: 47, label: '⁴⁷Ag' },
                  { z: 60, label: '⁶⁰Nd' },
                ].map((item) => (
                  <button
                    key={item.z}
                    type="button"
                    className={`quick-pill ${selectedZ === item.z ? 'active' : ''}`}
                    onClick={() => setSelectedZ(item.z)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {/* Element Specs Card */}
              <div className="element-spec-box">
                <div className="element-big-badge">
                  <span className="elem-z">{element.z}</span>
                  <span className="elem-symbol">{element.symbol}</span>
                  <span className="elem-name">{element.name}</span>
                </div>
                <div className="element-meta-list">
                  <div className="element-meta-row">
                    <span>Atomic Mass:</span>
                    <strong>{element.massAmu} u</strong>
                  </div>
                  <div className="element-meta-row">
                    <span>Configuration:</span>
                    <code>{element.config}</code>
                  </div>
                  <div className="element-meta-row">
                    <span>Ground Term Symbol:</span>
                    <strong><MathInline tex={`^{${Math.round(2*element.s + 1)}}${element.l}_{${element.j === 0.5 ? '1/2' : (element.j === 1.5 ? '3/2' : (element.j === 2.5 ? '5/2' : (element.j === 3.5 ? '7/2' : (element.j === 4.5 ? '9/2' : element.j))))}}`} /></strong>
                  </div>
                  <div className="element-meta-row">
                    <span>Total Angular Momentum <MathInline tex="J" />:</span>
                    <strong>{element.j}</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Results & Visual Splitting */}
            <div className="calc-card results-card">
              <div className="calc-card-title">Beam Splitting Prediction</div>

              <div className="beam-count-highlight">
                <span className="beam-count-number">{element.beams}</span>
                <span className="beam-count-text">
                  {element.beams === 1 ? 'Beam Component (No Splitting)' : 'Distinct Split Beams'}
                </span>
                <span className="beam-count-formula">
                  <MathInline tex={`N = 2J + 1 = 2(${element.j}) + 1 = ${element.beams}`} />
                </span>
              </div>

              {/* Dynamic SVG Beam Visualizer */}
              <div className="beam-svg-container">
                <svg viewBox="0 0 500 240" className="beam-splitting-svg">
                  <defs>
                    <linearGradient id="beamInGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="var(--accent-1)" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="var(--accent-2)" stopOpacity="0.9" />
                    </linearGradient>
                  </defs>

                  {/* Oven source */}
                  <rect x="20" y="95" width="40" height="50" rx="4" fill="var(--bg-elevated)" stroke="var(--border-color)" strokeWidth="1.5" />
                  <text x="40" y="125" textAnchor="middle" fill="var(--text-secondary)" fontSize="10">Oven</text>

                  {/* Incident beam */}
                  <line x1="60" y1="120" x2="180" y2="120" stroke="url(#beamInGrad)" strokeWidth="3" strokeDasharray="4 2" />

                  {/* Magnet pole tips */}
                  <path d="M 180,50 L 250,50 L 215,85 Z" fill="var(--bg-elevated)" stroke="var(--accent-1)" strokeWidth="1.5" />
                  <text x="215" y="70" textAnchor="middle" fill="var(--accent-1)" fontSize="11" fontWeight="bold">N (Knife)</text>

                  <path d="M 180,190 L 250,190 L 215,155 Z" fill="var(--bg-elevated)" stroke="var(--accent-2)" strokeWidth="1.5" />
                  <text x="215" y="180" textAnchor="middle" fill="var(--accent-2)" fontSize="11" fontWeight="bold">S (Grooved)</text>

                  {/* Detector Screen */}
                  <rect x="440" y="20" width="12" height="200" rx="2" fill="var(--bg-elevated)" stroke="var(--border-color)" strokeWidth="1.5" />
                  <text x="446" y="230" textAnchor="middle" fill="var(--text-secondary)" fontSize="10">Detector Screen</text>

                  {/* Split trajectories */}
                  {Array.from({ length: element.beams }).map((_, idx) => {
                    const total = element.beams;
                    // Vertical spread from y=40 to y=200
                    const yEnd = total === 1 ? 120 : 40 + (idx / (total - 1)) * 160;
                    const mjVal = element.j === 0 ? '0' : (-(element.j) + idx).toFixed(1).replace('.0', '');
                    const color = idx % 2 === 0 ? 'var(--accent-1)' : 'var(--accent-2)';

                    return (
                      <g key={idx}>
                        <path
                          d={`M 230,120 Q 330,${120 + (yEnd - 120) * 0.3} 440,${yEnd}`}
                          fill="none"
                          stroke={color}
                          strokeWidth="2"
                          opacity="0.85"
                        />
                        {/* Spot on detector */}
                        <circle cx="446" cy={yEnd} r="4" fill={color} />
                        {/* m_J label */}
                        <text x="465" y={yEnd + 4} fill="var(--text-primary)" fontSize="10" fontFamily="var(--font-mono)">
                          {`m_J=${mjVal}`}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>

              <div className="physics-explanation-note">
                <span className="note-title">Physical Explanation for {element.name}:</span>
                <p>{element.note}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================== TAB 2: STERN-GERLACH DEFLECTION ===================== */}
      {activeTab === 'sg-deflection' && (
        <div className="calc-tab-panel">
          <div className="calc-panel-header">
            <h3>Stern-Gerlach Beam Deflection & Force Calculator</h3>
            <p>
              Calculate the magnetic deflecting force <MathInline tex="F_z = \mu_z \frac{\partial B_z}{\partial z}" />, mean atomic velocity <MathInline tex="v = \sqrt{\frac{3 k_B T}{m}}" />, and spatial beam separation <MathInline tex="2\Delta z" /> on the detector screen.
            </p>
          </div>

          <div className="calc-grid-layout">
            {/* Inputs */}
            <div className="calc-card inputs-card">
              <div className="calc-card-title">Experimental Parameters</div>

              <div className="calc-field">
                <label>Atomic Species Preset:</label>
                <div className="preset-button-row">
                  {[
                    { id: 'Ag', label: 'Silver (¹⁰⁷Ag)' },
                    { id: 'H', label: 'Hydrogen (¹H)' },
                    { id: 'Na', label: 'Sodium (²³Na)' },
                    { id: 'K', label: 'Potassium (³⁹K)' },
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      className={`preset-btn ${sgPreset === p.id ? 'active' : ''}`}
                      onClick={() => handleSgPreset(p.id)}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="calc-field">
                <label htmlFor="sg-mass">Atomic Mass <MathInline tex="m" /> (u / amu):</label>
                <input
                  id="sg-mass"
                  type="number"
                  step="0.01"
                  value={sgMassAmu}
                  onChange={(e) => {
                    setSgMassAmu(parseFloat(e.target.value) || 1);
                    setSgPreset('custom');
                  }}
                  className="calc-number-input"
                />
              </div>

              <div className="calc-field">
                <div className="calc-field-header">
                  <label htmlFor="sg-grad">Magnetic Field Gradient <MathInline tex="\frac{\partial B_z}{\partial z}" /> (T/m):</label>
                  <input
                    type="number"
                    step="0.5"
                    value={sgGradB}
                    onChange={(e) => setSgGradB(parseFloat(e.target.value) || 0)}
                    className="calc-number-input"
                  />
                </div>
                <input
                  id="sg-grad"
                  type="range"
                  min="1"
                  max="100"
                  step="1"
                  value={sgGradB}
                  onChange={(e) => setSgGradB(parseFloat(e.target.value))}
                  className="calc-slider"
                />
              </div>

              <div className="calc-field">
                <div className="calc-field-header">
                  <label htmlFor="sg-temp">Oven Temperature <MathInline tex="T" /> (Kelvin):</label>
                  <input
                    type="number"
                    min="50"
                    max="3000"
                    value={sgTempK}
                    onChange={(e) => setSgTempK(Math.max(10, parseInt(e.target.value) || 300))}
                    className="calc-number-input"
                  />
                </div>
                <input
                  id="sg-temp"
                  type="range"
                  min="100"
                  max="2000"
                  step="25"
                  value={sgTempK}
                  onChange={(e) => setSgTempK(parseInt(e.target.value))}
                  className="calc-slider"
                />
              </div>

              <div className="calc-field-row">
                <div className="calc-field">
                  <label htmlFor="sg-l1">Magnet Length <MathInline tex="L_1" /> (m):</label>
                  <input
                    id="sg-l1"
                    type="number"
                    step="0.005"
                    value={sgLengthM}
                    onChange={(e) => setSgLengthM(Math.max(0.001, parseFloat(e.target.value) || 0.01))}
                    className="calc-number-input"
                  />
                </div>
                <div className="calc-field">
                  <label htmlFor="sg-l2">Drift Distance <MathInline tex="L_2" /> (m):</label>
                  <input
                    id="sg-l2"
                    type="number"
                    step="0.01"
                    value={sgDriftM}
                    onChange={(e) => setSgDriftM(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="calc-number-input"
                  />
                </div>
              </div>
            </div>

            {/* Step-by-Step Outputs */}
            <div className="calc-card results-card">
              <div className="calc-card-title">Computed Quantities & Derivation</div>

              <div className="results-metrics-grid">
                <div className="metric-tile">
                  <span className="metric-label">Thermal Velocity <MathInline tex="v_{rms}" /></span>
                  <span className="metric-val">{Math.round(sgResults.velocity).toLocaleString()} m/s</span>
                  <span className="metric-sub">Average beam longitudinal speed</span>
                </div>
                <div className="metric-tile">
                  <span className="metric-label">Transverse Force <MathInline tex="F_z" /></span>
                  <span className="metric-val">{sgResults.forceN.toExponential(3)} N</span>
                  <span className="metric-sub"><MathInline tex="\mu_B \cdot (\partial B_z / \partial z)" /></span>
                </div>
                <div className="metric-tile">
                  <span className="metric-label">Acceleration <MathInline tex="a_z" /></span>
                  <span className="metric-val">{sgResults.accel.toExponential(3)} m/s²</span>
                  <span className="metric-sub"><MathInline tex="F_z / m" /></span>
                </div>
                <div className="metric-tile highlight">
                  <span className="metric-label">Detector Separation <MathInline tex="2\Delta z" /></span>
                  <span className="metric-val">{sgResults.totalSeparationMm.toFixed(3)} mm</span>
                  <span className="metric-sub">Total split distance on screen</span>
                </div>
              </div>

              {/* Step by Step Math */}
              <div className="calc-math-breakdown">
                <h4>Step-by-Step Formula Breakdown</h4>
                <MathBlock
                  tex={`F_z = \\mu_B \\frac{\\partial B_z}{\\partial z} = (9.274 \\times 10^{-24} \\text{ J/T}) \\times (${sgGradB} \\text{ T/m}) = ${sgResults.forceN.toExponential(3)} \\text{ N}`}
                  label="1. Magnetic Force"
                />
                <MathBlock
                  tex={`v_x = \\sqrt{\\frac{3 k_B T}{m}} = \\sqrt{\\frac{3 \\times (1.381 \\times 10^{-23}) \\times ${sgTempK}}{${sgResults.massKg.toExponential(3)}}} = ${Math.round(sgResults.velocity)} \\text{ m/s}`}
                  label="2. Beam Velocity"
                />
                <MathBlock
                  tex={`2\\Delta z = \\frac{2 F_z L_1}{m v_x^2} \\left( \\frac{L_1}{2} + L_2 \\right) = ${sgResults.totalSeparationMm.toFixed(3)} \\text{ mm}`}
                  label="3. Beam Separation on Detector"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================== TAB 3: SEQUENTIAL SG ===================== */}
      {activeTab === 'seq-sg' && (
        <div className="calc-tab-panel">
          <div className="calc-panel-header">
            <h3>Sequential Stern-Gerlach Probability Calculator</h3>
            <p>
              Explore quantum projection and the collapse of state when an atomic beam passes through successive Stern-Gerlach filters oriented along different axes <MathInline tex="\hat{z} \to \hat{n}(\theta) \to \hat{z}" />.
            </p>
          </div>

          <div className="calc-grid-layout">
            <div className="calc-card inputs-card">
              <div className="calc-card-title">Filter Cascade Configuration</div>

              <div className="filter-stages-diagram">
                <div className="stage-chip">
                  <span className="stage-num">SG 1</span>
                  <span className="stage-axis">Oriented along <MathInline tex="\hat{z}" /></span>
                  <span className="stage-state">Outputs <MathInline tex="|+z\rangle" /> (100%)</span>
                </div>
                <div className="stage-arrow">➔</div>
                <div className="stage-chip active">
                  <span className="stage-num">SG 2</span>
                  <span className="stage-axis">Rotated by <MathInline tex="\theta" /></span>
                  <span className="stage-state">Outputs <MathInline tex="|+\theta\rangle" /></span>
                </div>
                <div className="stage-arrow">➔</div>
                <div className="stage-chip">
                  <span className="stage-num">SG 3</span>
                  <span className="stage-axis">Re-analyzed along <MathInline tex="\hat{z}" /></span>
                  <span className="stage-state">Measures <MathInline tex="|+z\rangle" /> & <MathInline tex="|-z\rangle" /></span>
                </div>
              </div>

              <div className="calc-field">
                <div className="calc-field-header">
                  <label htmlFor="seq-angle-slider">Angle <MathInline tex="\theta" /> of SG-2: <strong>{seqAngleDeg}°</strong></label>
                  <input
                    type="number"
                    min="0"
                    max="180"
                    value={seqAngleDeg}
                    onChange={(e) => setSeqAngleDeg(Math.max(0, Math.min(180, parseInt(e.target.value) || 0)))}
                    className="calc-number-input"
                  />
                </div>
                <input
                  id="seq-angle-slider"
                  type="range"
                  min="0"
                  max="180"
                  value={seqAngleDeg}
                  onChange={(e) => setSeqAngleDeg(parseInt(e.target.value))}
                  className="calc-slider"
                />
                <div className="slider-ticks">
                  <span>0° (Parallel to z)</span>
                  <span>45°</span>
                  <span>90° (along x)</span>
                  <span>135°</span>
                  <span>180° (anti-parallel)</span>
                </div>
              </div>

              {/* Quick Angle Presets */}
              <div className="calc-quick-pills">
                <span className="quick-pills-label">Presets:</span>
                {[
                  { angle: 0, label: 'θ = 0° (Identical)' },
                  { angle: 45, label: 'θ = 45°' },
                  { angle: 90, label: 'θ = 90° (Orthogonal)' },
                  { angle: 180, label: 'θ = 180° (Inverted)' },
                ].map((item) => (
                  <button
                    key={item.angle}
                    type="button"
                    className={`quick-pill ${seqAngleDeg === item.angle ? 'active' : ''}`}
                    onClick={() => setSeqAngleDeg(item.angle)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Results & Quantum Probabilities */}
            <div className="calc-card results-card">
              <div className="calc-card-title">Transition Probabilities & Quantum State</div>

              <div className="probability-meters-list">
                {/* SG-2 Output */}
                <div className="prob-meter-group">
                  <div className="prob-meter-header">
                    <span>Probability to exit SG-2 as <MathInline tex="|+\theta\rangle" />:</span>
                    <strong>{seqResults.pctPlusTheta}% (<MathInline tex={`\\cos^2(${seqAngleDeg}°/2)`} />)</strong>
                  </div>
                  <div className="prob-progress-bar">
                    <div className="prob-progress-fill accent-1" style={{ width: `${seqResults.pctPlusTheta}%` }} />
                  </div>
                </div>

                <div className="prob-meter-group">
                  <div className="prob-meter-header">
                    <span>Probability to exit SG-2 as <MathInline tex="|\\!-\\theta\\rangle" />:</span>
                    <strong>{seqResults.pctMinusTheta}% (<MathInline tex={`\\sin^2(${seqAngleDeg}°/2)`} />)</strong>
                  </div>
                  <div className="prob-progress-bar">
                    <div className="prob-progress-fill accent-2" style={{ width: `${seqResults.pctMinusTheta}%` }} />
                  </div>
                </div>

                {/* SG-3 Output */}
                <div className="prob-meter-group highlight-box">
                  <div className="prob-meter-header">
                    <span>Net Beam reaching SG-3(<MathInline tex="|-z\rangle" />):</span>
                    <strong>{seqResults.pctFinalMinusZ}%</strong>
                  </div>
                  <div className="prob-progress-bar">
                    <div className="prob-progress-fill" style={{ width: `${seqResults.pctFinalMinusZ}%`, backgroundColor: 'var(--accent-3)' }} />
                  </div>
                  <p className="prob-subtext">
                    Even though all <MathInline tex="|-z\rangle" /> atoms were blocked by SG-1, inserting the intermediate SG-2 filter at <MathInline tex="{seqAngleDeg}°" /> regenerates <MathInline tex="|-z\rangle" /> spins! This proves quantum measurement alters the state.
                  </p>
                </div>
              </div>

              {/* Math state vector */}
              <div className="calc-math-breakdown">
                <h4>Quantum State Vector Formulation</h4>
                <MathBlock
                  tex={`|+\\theta\\rangle = \\cos\\left(\\frac{${seqAngleDeg}^\\circ}{2}\\right)|+z\\rangle + \\sin\\left(\\frac{${seqAngleDeg}^\\circ}{2}\\right)|-z\\rangle = ${(Math.cos(seqResults.rad/2)).toFixed(3)}|+z\\rangle + ${(Math.sin(seqResults.rad/2)).toFixed(3)}|-z\\rangle`}
                  label="Rotated Spinor"
                />
                <MathBlock
                  tex={`P(-z \\text{ at SG3}) = \\cos^2\\left(\\frac{\\theta}{2}\\right) \\sin^2\\left(\\frac{\\theta}{2}\\right) = \\frac{1}{4}\\sin^2(${seqAngleDeg}^\\circ) = ${seqResults.pctFinalMinusZ}\\%`}
                  label="Total Transmission"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================== TAB 4: QUANTUM TUNNELING ===================== */}
      {activeTab === 'tunneling' && (
        <div className="calc-tab-panel">
          <div className="calc-panel-header">
            <h3>Quantum Tunneling Wavevector & Transmission Calculator</h3>
            <p>
              Given particle mass <MathInline tex="m" /> and kinetic energy <MathInline tex="E" />, compute the free wavevector{' '}
              <strong><MathInline tex="k = \frac{\sqrt{2mE}}{\hbar}" /></strong>, decay constant{' '}
              <MathInline tex="\kappa = \frac{\sqrt{2m(V_0 - E)}}{\hbar}" />, de Broglie wavelength, and barrier transmission probability <MathInline tex="T" />.
            </p>
          </div>

          <div className="calc-grid-layout">
            {/* Inputs */}
            <div className="calc-card inputs-card">
              <div className="calc-card-title">Particle & Barrier Parameters</div>

              <div className="calc-field">
                <label>Particle Species:</label>
                <div className="preset-button-row">
                  {[
                    { id: 'electron', label: 'Electron (e⁻)' },
                    { id: 'proton', label: 'Proton (p⁺)' },
                    { id: 'alpha', label: 'Alpha (⁴He²⁺)' },
                    { id: 'custom', label: 'Custom' },
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      className={`preset-btn ${particleType === p.id ? 'active' : ''}`}
                      onClick={() => handleParticleChange(p.id)}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {particleType === 'custom' && (
                <div className="calc-field">
                  <label htmlFor="custom-mass">Custom Mass <MathInline tex="m" /> (kg):</label>
                  <input
                    id="custom-mass"
                    type="number"
                    step="1e-31"
                    value={customMassKg}
                    onChange={(e) => setCustomMassKg(parseFloat(e.target.value) || M_ELECTRON)}
                    className="calc-number-input"
                  />
                </div>
              )}

              <div className="calc-field">
                <div className="calc-field-header">
                  <label htmlFor="tun-energy">Incident Energy <MathInline tex="E" /> (eV):</label>
                  <input
                    id="tun-energy"
                    type="number"
                    step="0.1"
                    min="0.01"
                    value={energyEv}
                    onChange={(e) => setEnergyEv(Math.max(0.01, parseFloat(e.target.value) || 0.1))}
                    className="calc-number-input"
                  />
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="20"
                  step="0.1"
                  value={energyEv}
                  onChange={(e) => setEnergyEv(parseFloat(e.target.value))}
                  className="calc-slider"
                />
              </div>

              <div className="calc-field">
                <div className="calc-field-header">
                  <label htmlFor="tun-v0">Barrier Potential <MathInline tex="V_0" /> (eV):</label>
                  <input
                    id="tun-v0"
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={barrierV0Ev}
                    onChange={(e) => setBarrierV0Ev(Math.max(0.1, parseFloat(e.target.value) || 0.1))}
                    className="calc-number-input"
                  />
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="25"
                  step="0.5"
                  value={barrierV0Ev}
                  onChange={(e) => setBarrierV0Ev(parseFloat(e.target.value))}
                  className="calc-slider"
                />
              </div>

              <div className="calc-field">
                <div className="calc-field-header">
                  <label htmlFor="tun-width">Barrier Width <MathInline tex="a" /> (nm):</label>
                  <input
                    id="tun-width"
                    type="number"
                    step="0.05"
                    min="0.01"
                    value={barrierWidthNm}
                    onChange={(e) => setBarrierWidthNm(Math.max(0.01, parseFloat(e.target.value) || 0.1))}
                    className="calc-number-input"
                  />
                </div>
                <input
                  type="range"
                  min="0.05"
                  max="3.0"
                  step="0.05"
                  value={barrierWidthNm}
                  onChange={(e) => setBarrierWidthNm(parseFloat(e.target.value))}
                  className="calc-slider"
                />
              </div>
            </div>

            {/* Results */}
            <div className="calc-card results-card">
              <div className="calc-card-title">Computed Wavevector & Transmission</div>

              <div className="results-metrics-grid">
                <div className="metric-tile highlight">
                  <span className="metric-label">Wavevector <MathInline tex="k" /></span>
                  <span className="metric-val">{tunnelingResults.kNm.toFixed(3)} nm⁻¹</span>
                  <span className="metric-sub">{tunnelingResults.kMeters.toExponential(3)} m⁻¹</span>
                </div>
                <div className="metric-tile">
                  <span className="metric-label">de Broglie Wavelength <MathInline tex="\lambda" /></span>
                  <span className="metric-val">{tunnelingResults.deBroglieNm.toFixed(3)} nm</span>
                  <span className="metric-sub"><MathInline tex="\lambda = 2\pi / k" /></span>
                </div>
                <div className="metric-tile">
                  <span className="metric-label">Barrier Attenuation <MathInline tex="\kappa" /></span>
                  <span className="metric-val">{tunnelingResults.kappaNm.toFixed(3)} nm⁻¹</span>
                  <span className="metric-sub"><MathInline tex="\sqrt{2m(V_0 - E)}/\hbar" /></span>
                </div>
                <div className="metric-tile highlight">
                  <span className="metric-label">Transmission Coeff <MathInline tex="T" /></span>
                  <span className="metric-val">{tunnelingResults.transPercent}%</span>
                  <span className="metric-sub">
                    {energyEv >= barrierV0Ev ? 'Classical Transmission (E > V₀)' : 'Quantum Tunneling (E < V₀)'}
                  </span>
                </div>
              </div>

              {/* Step by step Math */}
              <div className="calc-math-breakdown">
                <h4>Step-by-Step Mathematical Derivation</h4>
                <MathBlock
                  tex={`k = \\frac{\\sqrt{2 m E}}{\\hbar} = \\frac{\\sqrt{2 \\times (${(particleType === 'custom' ? customMassKg : (particleType === 'proton' ? M_PROTON : (particleType === 'alpha' ? M_ALPHA : M_ELECTRON))).toExponential(3)}) \\times (${(energyEv * E_CHARGE).toExponential(3)})}}{1.055 \\times 10^{-34}} = ${tunnelingResults.kNm.toFixed(3)} \\text{ nm}^{-1}`}
                  label="1. Free Wavevector"
                />
                {barrierV0Ev > energyEv ? (
                  <MathBlock
                    tex={`\\kappa = \\frac{\\sqrt{2 m (V_0 - E)}}{\\hbar} = ${tunnelingResults.kappaNm.toFixed(3)} \\text{ nm}^{-1}`}
                    label="2. Barrier Decay Constant"
                  />
                ) : (
                  <MathBlock
                    tex={`E > V_0 \\implies \\text{Particle is classically permitted over barrier}`}
                    label="2. Classical Regime"
                  />
                )}
                <MathBlock
                  tex={`T = \\left[ 1 + \\frac{V_0^2 \\sinh^2(\\kappa a)}{4E(V_0 - E)} \\right]^{-1} = ${tunnelingResults.transCoeff.toExponential(3)} \\quad (${tunnelingResults.transPercent}\\%`}
                  label="3. Barrier Transmission Probability"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
