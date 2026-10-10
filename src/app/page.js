'use client';
import { useState, useEffect } from 'react';
import { MathBlock, MathInline } from '@/components/MathBlock';
import QuantumCalculators from '@/components/QuantumCalculators';
import ResearchStudio from '@/components/ResearchStudio';
import useScrollReveal from '@/hooks/useScrollReveal';

export default function HomePage() {
  useScrollReveal();

  const [seqTab, setSeqTab] = useState(0);

  return (
    <>
      {/* ===================== HERO ===================== */}
      <section id="hero" className="hero">
        <div className="hero-bg" />
        <div className="hero-apparatus">
          <svg viewBox="0 0 400 500" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Stylized SG apparatus silhouette */}
            <rect x="40" y="180" width="60" height="100" rx="8" stroke="var(--text-muted)" strokeWidth="1.5" opacity="0.4"/>
            <text x="70" y="235" textAnchor="middle" fill="var(--text-muted)" fontSize="10" opacity="0.5">Oven</text>
            <line x1="100" y1="230" x2="160" y2="230" stroke="var(--text-muted)" strokeWidth="1" opacity="0.3" strokeDasharray="4,4"/>
            <rect x="160" y="150" width="80" height="160" rx="6" stroke="var(--accent-1)" strokeWidth="1.5" opacity="0.3"/>
            <text x="200" y="175" textAnchor="middle" fill="var(--accent-1)" fontSize="9" opacity="0.4">N</text>
            <text x="200" y="300" textAnchor="middle" fill="var(--accent-2)" fontSize="9" opacity="0.4">S</text>
            <path d="M200 190 C200 220, 200 240, 200 260" stroke="var(--text-muted)" strokeWidth="1" opacity="0.3"/>
            <line x1="240" y1="210" x2="330" y2="170" stroke="var(--accent-1)" strokeWidth="1" opacity="0.3"/>
            <line x1="240" y1="250" x2="330" y2="290" stroke="var(--accent-2)" strokeWidth="1" opacity="0.3"/>
            <rect x="330" y="140" width="30" height="180" rx="4" stroke="var(--text-muted)" strokeWidth="1.5" opacity="0.3"/>
            <circle cx="345" cy="180" r="4" fill="var(--accent-1)" opacity="0.3"/>
            <circle cx="345" cy="280" r="4" fill="var(--accent-2)" opacity="0.3"/>
          </svg>
        </div>
        <div className="hero-content">
          <div className="hero-badge">Quantum Mechanics</div>
          <h1>
            The <span className="highlight">Stern–Gerlach</span> Experiment
          </h1>
          <p className="hero-desc">
            A beam of silver atoms, a non-uniform magnetic field, and two spots on a glass plate
            that rewrote the rules of angular momentum. Explore the physics that proved
            space quantization is real.
          </p>
          <a href="#setup" className="hero-cta" onClick={(e) => { e.preventDefault(); document.getElementById('setup')?.scrollIntoView({ behavior: 'smooth' }); }}>
            Begin Exploring
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
          </a>
        </div>
      </section>

      {/* ===================== EXPERIMENTAL SETUP ===================== */}
      <section id="setup" className="content-section">
        <div className="section-inner">
          <div className="section-label">Section 01</div>
          <h2 className="section-title">Experimental <span className="accent">Setup</span></h2>

          <p>The Stern-Gerlach apparatus consists of three core components arranged in sequence: a source that produces a beam of atoms, a region of non-uniform magnetic field, and a detector screen.</p>

          {/* SVG Diagram */}
          <div className="diagram-container">
            <svg viewBox="0 0 800 280" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%' }}>
              {/* Oven */}
              <rect x="30" y="100" width="90" height="80" rx="8" stroke="var(--accent-1)" strokeWidth="2" fill="var(--accent-1-dim)"/>
              <text x="75" y="145" textAnchor="middle" fill="var(--accent-1)" fontSize="14" fontFamily="Inter, sans-serif" fontWeight="600">Oven</text>
              <text x="75" y="163" textAnchor="middle" fill="var(--text-muted)" fontSize="10" fontFamily="Inter, sans-serif">Ag atoms</text>

              {/* Beam collimator */}
              <line x1="120" y1="130" x2="200" y2="130" stroke="var(--text-muted)" strokeWidth="2" strokeDasharray="6,4"/>
              <line x1="120" y1="150" x2="200" y2="150" stroke="var(--text-muted)" strokeWidth="2" strokeDasharray="6,4"/>
              <rect x="195" y="105" width="12" height="70" rx="2" stroke="var(--text-secondary)" strokeWidth="1.5" fill="var(--bg-surface)"/>
              <rect x="199" y="127" width="4" height="26" rx="1" fill="var(--text-muted)"/>
              <text x="201" y="100" textAnchor="middle" fill="var(--text-muted)" fontSize="9" fontFamily="Inter, sans-serif">Slit</text>

              {/* Beam */}
              <line x1="207" y1="140" x2="320" y2="140" stroke="var(--accent-3)" strokeWidth="2"/>

              {/* Magnet region */}
              <rect x="320" y="50" width="160" height="180" rx="6" stroke="var(--border-color)" strokeWidth="1.5" fill="none" strokeDasharray="4,4"/>

              {/* North pole (pointed) */}
              <path d="M340 65 L460 65 L460 100 L400 120 L340 100 Z" fill="var(--accent-1-dim)" stroke="var(--accent-1)" strokeWidth="1.5"/>
              <text x="400" y="90" textAnchor="middle" fill="var(--accent-1)" fontSize="16" fontWeight="700" fontFamily="Inter, sans-serif">N</text>

              {/* South pole (flat) */}
              <rect x="340" y="170" width="120" height="45" rx="4" fill="var(--accent-2-dim)" stroke="var(--accent-2)" strokeWidth="1.5"/>
              <text x="400" y="198" textAnchor="middle" fill="var(--accent-2)" fontSize="16" fontWeight="700" fontFamily="Inter, sans-serif">S</text>

              {/* Field lines */}
              <path d="M380 120 Q380 140 380 170" stroke="var(--text-muted)" strokeWidth="0.8" opacity="0.4"/>
              <path d="M400 120 Q400 145 400 170" stroke="var(--text-muted)" strokeWidth="0.8" opacity="0.4"/>
              <path d="M420 120 Q420 140 420 170" stroke="var(--text-muted)" strokeWidth="0.8" opacity="0.4"/>
              <text x="400" y="155" textAnchor="middle" fill="var(--text-muted)" fontSize="9" fontFamily="Inter, sans-serif">∂B/∂z</text>

              {/* Beam splitting */}
              <line x1="400" y1="140" x2="480" y2="140" stroke="var(--accent-3)" strokeWidth="2"/>
              <line x1="480" y1="140" x2="620" y2="100" stroke="var(--accent-1)" strokeWidth="2"/>
              <line x1="480" y1="140" x2="620" y2="180" stroke="var(--accent-2)" strokeWidth="2"/>

              {/* Labels on beams */}
              <text x="560" y="93" fill="var(--accent-1)" fontSize="11" fontFamily="JetBrains Mono, monospace">m_j = +½</text>
              <text x="560" y="198" fill="var(--accent-2)" fontSize="11" fontFamily="JetBrains Mono, monospace">m_j = −½</text>

              {/* Detector */}
              <rect x="630" y="60" width="25" height="160" rx="4" stroke="var(--text-secondary)" strokeWidth="2" fill="var(--bg-elevated)"/>
              <circle cx="642" cy="105" r="6" fill="var(--accent-1)" opacity="0.7"/>
              <circle cx="642" cy="175" r="6" fill="var(--accent-2)" opacity="0.7"/>
              <text x="643" y="250" textAnchor="middle" fill="var(--text-muted)" fontSize="10" fontFamily="Inter, sans-serif">Detector</text>
              <text x="643" y="262" textAnchor="middle" fill="var(--text-muted)" fontSize="10" fontFamily="Inter, sans-serif">plate</text>
            </svg>
            <div className="diagram-caption">
              <span className="diagram-number">Fig. 1</span> — Schematic of the Stern-Gerlach apparatus. Silver atoms from a heated oven pass through a collimating slit, enter a region of non-uniform magnetic field (pointed N pole, flat S pole), and deflect onto a detector plate as two distinct spots.
            </div>
          </div>

          <h3>The Source: Silver Atom Oven</h3>
          <p>An oven heats silver (Ag) to produce a beam of neutral atoms. The beam passes through collimating slits to create a narrow, well-defined stream of atoms moving in one direction.</p>

          <h3>The Magnetic Field Region</h3>
          <p>The beam enters a region with a specially shaped magnet — one pole is pointed (wedge-shaped) and the other is flat. This creates a <strong>non-uniform magnetic field</strong> with a strong gradient ∂B/∂z along the vertical axis. The gradient is what causes a net force on the magnetic dipole — a uniform field would only cause the atom to precess, not deflect.</p>

          <h3>The Detector</h3>
          <p>Silver atoms deposit on a glass plate at the far end. Instead of a continuous smear (as classical physics would predict), two distinct spots appear — direct evidence of quantized angular momentum.</p>
        </div>
      </section>

      {/* ===================== WHY SILVER? ===================== */}
      <section id="why-silver" className="content-section">
        <div className="section-inner">
          <div className="section-label">Section 02</div>
          <h2 className="section-title">Why <span className="accent">Silver</span> Atoms?</h2>

          <p>Silver wasn't chosen at random. Its electron configuration makes it an ideal candidate for observing spin effects cleanly.</p>

          <div className="callout important">
            <div className="callout-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="var(--accent-3)" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            </div>
            <div className="callout-content">
              <p><strong>Silver's electron configuration:</strong> [Kr] 4d¹⁰ 5s¹</p>
              <p>One single unpaired electron in the 5s orbital. All inner shells are completely filled and paired.</p>
            </div>
          </div>

          <h3>The Key Properties</h3>
          <ul>
            <li><strong>Single valence electron:</strong> The 5s¹ electron is the only unpaired electron, so silver's magnetic moment comes entirely from this one electron.</li>
            <li><strong>Orbital angular momentum L = 0:</strong> The electron is in an s-orbital (l = 0), which means there is zero orbital angular momentum contribution. The entire magnetic moment comes from the electron's intrinsic spin.</li>
            <li><strong>Spin S = 1/2:</strong> With one unpaired electron, the total spin quantum number is S = 1/2.</li>
            <li><strong>Total angular momentum J = L + S = 0 + 1/2 = 1/2:</strong> Since L = 0, the total J equals the spin value.</li>
          </ul>

          <MathBlock
            label="Number of Spots"
            tex="2J + 1 = 2\left(\frac{1}{2}\right) + 1 = 2"
            explanation="With J = 1/2, there are exactly two possible orientations: m_J = +1/2 (spin-up) and m_J = −1/2 (spin-down). This is why the beam splits into exactly two spots."
          />

          <p>If an atom with J = 1 had been used instead, the beam would split into three spots (2(1) + 1 = 3). Silver, with J = 1/2, gives the simplest possible quantum result — a binary split.</p>
        </div>
      </section>

      {/* ===================== WHY NON-UNIFORM FIELD? ===================== */}
      <section id="why-nonuniform" className="content-section">
        <div className="section-inner">
          <div className="section-label">Section 03</div>
          <h2 className="section-title">Why a <span className="accent">Non-Uniform</span> Magnetic Field?</h2>

          <p>This is one of the most commonly misunderstood aspects of the experiment. A uniform magnetic field would not work.</p>

          <div className="card-grid card-grid-2">
            <div className="card">
              <h4 style={{ color: '#ef4444', margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: 12 }}>✕ Uniform Field</h4>
              <p className="card-text">A uniform field exerts equal and opposite forces on the two poles of the magnetic dipole. The net force is <strong>zero</strong>. The atom experiences a torque that makes it precess (Larmor precession) around the field direction, but it does not deflect — it keeps moving in a straight line.</p>
            </div>
            <div className="card">
              <h4 style={{ color: 'var(--accent-2)', margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: 12 }}>✓ Non-Uniform Field</h4>
              <p className="card-text">When the field has a gradient (∂B/∂z ≠ 0), the force on one pole of the dipole is stronger than on the other. This creates a <strong>net force</strong> that pushes the atom up or down depending on the orientation of its magnetic moment relative to the field.</p>
            </div>
          </div>

          <MathBlock
            label="Force on the Atom"
            tex="F_z = \mu_z \cdot \frac{\partial B}{\partial z}"
            explanation="The vertical force on the atom depends on two things: the z-component of the magnetic moment (μ_z) and the magnetic field gradient (∂B/∂z). No gradient means no force — regardless of the magnetic moment."
          />

          <p>The pointed pole piece creates a region where the field changes rapidly with position. This strong gradient is what allows the experiment to physically sort atoms by their spin orientation.</p>

          <div className="callout note">
            <div className="callout-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="var(--accent-2)" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
            </div>
            <div className="callout-content">
              <p><strong>Analogy:</strong> Think of a bar magnet near the edge of a refrigerator. At the center of the fridge (uniform field region) the magnet sticks but doesn't slide. At the edge (where the field drops off — a gradient), the magnet gets pulled toward the stronger field region. The Stern-Gerlach apparatus exploits this edge effect deliberately.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== THE PHYSICS ===================== */}
      <section id="physics" className="content-section">
        <div className="section-inner">
          <div className="section-label">Section 04</div>
          <h2 className="section-title">The <span className="accent">Physics</span></h2>

          <h3>Space Quantization</h3>
          <p>Classical physics predicts that if you send a beam of tiny magnets through a non-uniform field, they should scatter across a continuous range of positions — because classically, a magnetic moment can point in any direction. The detector would show a smeared-out band.</p>
          <p>Quantum mechanics says otherwise. The component of angular momentum along any chosen axis can only take discrete values. For a quantum number j, the projection m_j can be:</p>

          <MathBlock
            label="Allowed Projections"
            tex="m_j = -j,\; -j+1,\; \ldots,\; j-1,\; j"
            explanation="This gives exactly (2j + 1) possible values. For silver with j = 1/2, we get m_j = −1/2 and m_j = +1/2 — two values, two spots."
          />

          <h3>Magnetic Moment of the Silver Atom</h3>
          <p>The magnetic moment is directly related to the angular momentum. For an atom with total angular momentum quantum number J:</p>

          <MathBlock
            label="Magnetic Moment"
            tex="\vec{\mu} = -g_J \cdot \mu_B \cdot \frac{\vec{J}}{\hbar}"
            explanation="Here g_J is the Landé g-factor, μ_B is the Bohr magneton (9.274 × 10⁻²⁴ J/T), J is the total angular momentum, and ℏ is the reduced Planck constant."
          />

          <p>For silver's ground state, where the angular momentum comes entirely from the electron spin (L = 0, S = 1/2), the Landé g-factor is approximately g_J ≈ 2. The z-component of the magnetic moment is then:</p>

          <MathBlock
            label="z-Component"
            tex="\mu_z = -g_J \cdot \mu_B \cdot m_j"
            explanation="With m_j = ±1/2 and g_J ≈ 2, the two possible values of μ_z are ±μ_B. These two values produce equal and opposite deflections."
          />

          <h3>Classical vs. Quantum Prediction</h3>
          <div className="card-grid card-grid-2">
            <div className="card">
              <div className="card-title">Classical Prediction</div>
              <p className="card-text">Continuous smeared band on the detector. The beam would spread out uniformly because classically, the magnetic moment can point in any direction with equal probability.</p>
            </div>
            <div className="card">
              <div className="card-title" style={{ color: 'var(--accent-2)' }}>Quantum Result</div>
              <p className="card-text">Exactly two discrete spots, symmetrically placed above and below the undeflected position. This is direct proof that angular momentum projection is quantized.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== DERIVATIONS ===================== */}
      <section id="derivations" className="content-section">
        <div className="section-inner">
          <div className="section-label">Section 05</div>
          <h2 className="section-title"><span className="accent">Derivations</span></h2>

          <h3>Interaction Hamiltonian</h3>
          <p>A magnetic dipole in an external magnetic field has a potential energy given by the dot product of the magnetic moment and the field:</p>

          <MathBlock
            label="Hamiltonian"
            tex="H = -\vec{\mu} \cdot \vec{B}"
            explanation="The negative sign means the energy is lowest when the magnetic moment is aligned with the field (parallel) and highest when anti-aligned (anti-parallel)."
          />

          <h3>Force from the Inhomogeneous Field</h3>
          <p>The force on the atom is the negative gradient of this potential energy. If the field is primarily along the z-direction and varies with z:</p>

          <MathBlock
            label="Force Equation"
            tex="F_z = -\frac{\partial H}{\partial z} = \mu_z \frac{\partial B}{\partial z}"
            explanation="The force is proportional to both the z-component of the magnetic moment and the rate at which the field changes with position (the gradient)."
          />

          <h3>Deflection at the Detector</h3>
          <p>An atom of mass m traveling with velocity v through a field region of length L experiences a constant transverse acceleration a = F_z/m. The time spent in the field is t = L/v, and the transverse displacement accumulated is:</p>

          <MathBlock
            label="Deflection"
            tex="\delta_z = \frac{1}{2}at^2 = \frac{\mu_z}{2m} \cdot \frac{\partial B}{\partial z} \cdot \frac{L^2}{v^2}"
            explanation="Faster atoms are deflected less (they spend less time in the field). Heavier atoms are also deflected less (more inertia). The gradient and magnetic moment push the deflection larger."
          />

          <h3>Total Spot Separation</h3>
          <p>Since m_j = +1/2 atoms are deflected upward and m_j = -1/2 atoms are deflected downward by the same amount, the total separation between the two spots is:</p>

          <MathBlock
            label="Separation"
            tex="\Delta z = 2|\delta_z| = \frac{g_J \mu_B}{m} \cdot \frac{\partial B}{\partial z} \cdot \frac{L^2}{v^2}"
            explanation="Substituting μ_z = g_J · μ_B · m_j and using the fact that the two deflections are equal in magnitude but opposite in direction."
          />

          <div className="callout note">
            <div className="callout-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="var(--accent-2)" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
            </div>
            <div className="callout-content">
              <p><strong>Practical note:</strong> Real atoms have a distribution of velocities (Maxwell-Boltzmann distribution), so each spot has some width. But the two peaks are still clearly separated from each other — the quantization is unmistakable.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== PAULI MATRICES ===================== */}
      <section id="pauli" className="content-section">
        <div className="section-inner">
          <div className="section-label">Section 06</div>
          <h2 className="section-title">Pauli Matrices <span className="accent">& Spin</span></h2>

          <p>The mathematics of spin-1/2 systems is described by 2×2 matrices. The three Pauli matrices represent the spin angular momentum operators along each axis:</p>

          <MathBlock
            label="Pauli Matrix σ_x"
            tex="\sigma_x = \begin{pmatrix} 0 & 1 \\ 1 & 0 \end{pmatrix}"
            explanation="Represents spin measurement along the x-axis. It flips the spin state — it turns spin-up into spin-down and vice versa."
          />

          <MathBlock
            label="Pauli Matrix σ_y"
            tex="\sigma_y = \begin{pmatrix} 0 & -i \\ i & 0 \end{pmatrix}"
            explanation="Represents spin measurement along the y-axis. It involves imaginary numbers because of the phase relationship between spin components."
          />

          <MathBlock
            label="Pauli Matrix σ_z"
            tex="\sigma_z = \begin{pmatrix} 1 & 0 \\ 0 & -1 \end{pmatrix}"
            explanation="Represents spin measurement along the z-axis. Its eigenstates are the 'spin-up' |↑⟩ = (1,0) with eigenvalue +1, and 'spin-down' |↓⟩ = (0,1) with eigenvalue −1."
          />

          <h3>Spin Angular Momentum Operators</h3>
          <p>The actual spin operators are obtained by multiplying the Pauli matrices by ℏ/2:</p>

          <MathBlock
            label="Spin Operators"
            tex="S_x = \frac{\hbar}{2}\sigma_x, \quad S_y = \frac{\hbar}{2}\sigma_y, \quad S_z = \frac{\hbar}{2}\sigma_z"
            explanation="The eigenvalues of S_z are +ℏ/2 and −ℏ/2, corresponding to spin-up and spin-down states. These are the values measured by the Stern-Gerlach apparatus."
          />

          <h3>Why Do These Matrices Matter?</h3>
          <div className="card-grid card-grid-2">
            <div className="card">
              <div className="card-title">Non-Commuting Observables</div>
              <p className="card-text">S_x, S_y, and S_z do not commute: [S_x, S_z] ≠ 0. This means you cannot simultaneously know the spin along two different axes — measuring one disturbs the other. This is the heart of the uncertainty principle for angular momentum.</p>
            </div>
            <div className="card">
              <div className="card-title">Two-State System = Qubit</div>
              <p className="card-text">A spin-1/2 particle described by these matrices is the simplest quantum system. Its state |ψ⟩ = α|↑⟩ + β|↓⟩ is exactly a qubit — the fundamental unit of quantum computing. Every quantum gate is a 2×2 unitary matrix acting on this space.</p>
            </div>
          </div>

          <h3>Commutation Relations</h3>
          <MathBlock
            label="Fundamental Commutator"
            tex="[S_i, S_j] = i\hbar\,\epsilon_{ijk}\,S_k"
            explanation="The Levi-Civita symbol ε_ijk encodes the cyclic relationships: [S_x, S_y] = iℏS_z and cyclic permutations. This structure is what makes spin fundamentally different from any classical angular momentum."
          />
        </div>
      </section>

      {/* ===================== BLOCH SPHERE ===================== */}
      <section id="bloch" className="content-section">
        <div className="section-inner">
          <div className="section-label">Section 07</div>
          <h2 className="section-title">The <span className="accent">Bloch Sphere</span></h2>

          <p>Any spin-1/2 state can be visualized as a point on a sphere — the Bloch sphere. It is the most powerful geometric tool for understanding qubit states and measurements.</p>

          <div className="bloch-container">
            <div className="bloch-sphere-wrapper">
              {/* Bloch Sphere SVG */}
              <svg width="280" height="280" viewBox="0 0 280 280" xmlns="http://www.w3.org/2000/svg">
                {/* Sphere outline */}
                <circle cx="140" cy="140" r="110" fill="none" stroke="var(--border-color)" strokeWidth="1.5"/>
                {/* Equatorial ellipse */}
                <ellipse cx="140" cy="140" rx="110" ry="30" fill="none" stroke="var(--border-color)" strokeWidth="0.8" strokeDasharray="4,3"/>
                {/* Vertical great circle */}
                <ellipse cx="140" cy="140" rx="30" ry="110" fill="none" stroke="var(--border-color)" strokeWidth="0.8" strokeDasharray="4,3"/>

                {/* Axes */}
                <line x1="140" y1="30" x2="140" y2="250" stroke="var(--text-muted)" strokeWidth="1"/>
                <line x1="30" y1="140" x2="250" y2="140" stroke="var(--text-muted)" strokeWidth="1"/>
                <line x1="80" y1="200" x2="200" y2="80" stroke="var(--text-muted)" strokeWidth="1"/>

                {/* Axis labels */}
                <text x="140" y="22" textAnchor="middle" fill="var(--accent-1)" fontSize="14" fontWeight="700" fontFamily="JetBrains Mono, monospace">|↑⟩</text>
                <text x="140" y="268" textAnchor="middle" fill="var(--accent-2)" fontSize="14" fontWeight="700" fontFamily="JetBrains Mono, monospace">|↓⟩</text>
                <text x="260" y="145" fill="var(--text-muted)" fontSize="12" fontFamily="JetBrains Mono, monospace">x</text>
                <text x="72" y="78" fill="var(--text-muted)" fontSize="12" fontFamily="JetBrains Mono, monospace">y</text>
                <text x="144" y="15" fill="var(--text-muted)" fontSize="11" fontFamily="Inter, sans-serif">z</text>

                {/* State vector */}
                <line x1="140" y1="140" x2="200" y2="60" stroke="var(--accent-3)" strokeWidth="2.5"/>
                <circle cx="200" cy="60" r="5" fill="var(--accent-3)"/>
                <text x="212" y="55" fill="var(--accent-3)" fontSize="13" fontWeight="600" fontFamily="JetBrains Mono, monospace">|ψ⟩</text>

                {/* Theta arc */}
                <path d="M140 120 Q155 105 160 100" fill="none" stroke="var(--accent-3)" strokeWidth="1" strokeDasharray="3,2"/>
                <text x="158" y="112" fill="var(--accent-3)" fontSize="11" fontFamily="JetBrains Mono, monospace">θ</text>

                {/* Center dot */}
                <circle cx="140" cy="140" r="3" fill="var(--text-muted)"/>
              </svg>
            </div>
            <div className="bloch-info">
              <h3 style={{ marginTop: 0 }}>State Representation</h3>
              <p>Every pure state of a spin-1/2 particle can be written as:</p>
              <MathBlock
                tex="|\psi\rangle = \cos\frac{\theta}{2}|{\uparrow}\rangle + e^{i\phi}\sin\frac{\theta}{2}|{\downarrow}\rangle"
                explanation="θ is the polar angle from the z-axis (0 to π), and φ is the azimuthal angle around the z-axis (0 to 2π). The north pole is pure spin-up, the south pole is pure spin-down."
              />
              <p>Measuring along the z-axis in the SG apparatus projects the state onto either the north or south pole — |↑⟩ or |↓⟩ — with probabilities cos²(θ/2) and sin²(θ/2) respectively.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== SEQUENTIAL SG ===================== */}
      <section id="sequential" className="content-section">
        <div className="section-inner">
          <div className="section-label">Section 08</div>
          <h2 className="section-title">Sequential <span className="accent">Stern-Gerlach</span></h2>

          <p>Some of the deepest insights about quantum measurement come from chaining multiple Stern-Gerlach devices together. These thought experiments (some of which have been realized in the lab) demonstrate superposition, measurement disturbance, and incompatible observables.</p>

          <div className="sequential-tabs">
            <button className={`seq-tab ${seqTab === 0 ? 'active' : ''}`} onClick={() => setSeqTab(0)}>Experiment 1: Filtering</button>
            <button className={`seq-tab ${seqTab === 1 ? 'active' : ''}`} onClick={() => setSeqTab(1)}>Experiment 2: Two Axes</button>
            <button className={`seq-tab ${seqTab === 2 ? 'active' : ''}`} onClick={() => setSeqTab(2)}>Experiment 3: Three Stages</button>
          </div>

          <div className={`seq-content ${seqTab === 0 ? 'active' : ''}`}>
            <h3>SG-Z → Block spin-down → SG-Z</h3>
            <p>Pass the beam through a z-oriented SG apparatus. Block the spin-down beam. Now only spin-up atoms remain. Pass them through a second z-oriented SG apparatus.</p>
            <p><strong>Result:</strong> All atoms come out spin-up from the second apparatus. 100% pass through. Once the state is measured and filtered, a repeat measurement along the same axis gives the same result with certainty.</p>
            <div className="callout note">
              <div className="callout-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="var(--accent-2)" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
              </div>
              <div className="callout-content">
                <p>This is a core property of quantum measurement: a state that has been prepared by measurement persists until disturbed by a measurement along a different axis.</p>
              </div>
            </div>
          </div>

          <div className={`seq-content ${seqTab === 1 ? 'active' : ''}`}>
            <h3>SG-Z → Block spin-down → SG-X</h3>
            <p>First, select only spin-up-z atoms. Then send them through an x-oriented SG apparatus.</p>
            <p><strong>Result:</strong> The beam splits 50/50 into spin-up-x and spin-down-x. Even though we "knew" the z-spin was +ℏ/2, measuring along x gives a completely random result. The z-information tells us nothing about x.</p>
            <MathBlock
              tex="|{\uparrow_z}\rangle = \frac{1}{\sqrt{2}}|{\uparrow_x}\rangle + \frac{1}{\sqrt{2}}|{\downarrow_x}\rangle"
              explanation="A definite spin-up-z state is an equal superposition of spin-up-x and spin-down-x. This is because S_z and S_x are incompatible observables (they don't commute)."
            />
          </div>

          <div className={`seq-content ${seqTab === 2 ? 'active' : ''}`}>
            <h3>SG-Z → SG-X → SG-Z (again)</h3>
            <p>This is the most striking experiment. Start with spin-up-z atoms. Pass through SG-X (and keep, say, the spin-up-x output). Now pass those atoms through SG-Z again.</p>
            <p><strong>Result:</strong> The beam splits 50/50 again into spin-up-z and spin-down-z. The x-measurement has completely destroyed the z-information that we had earlier. We started with 100% spin-up-z and now only 50% are spin-up-z.</p>
            <div className="callout warning">
              <div className="callout-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="var(--accent-1)" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              </div>
              <div className="callout-content">
                <p><strong>This is the measurement problem in action.</strong> Measuring one observable (S_x) irreversibly disturbs the state of an incompatible observable (S_z). There is no way to know S_z and S_x simultaneously — this is a fundamental limitation of nature, not of our instruments.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== SIMULATOR ===================== */}
      <section id="simulator" className="content-section">
        <div className="section-inner">
          <div className="section-label">Section 09</div>
          <h2 className="section-title">Interactive <span className="accent">Simulation Link</span></h2>

          <p>The original Stern-Gerlach apparatus demonstrated space quantization in 1922. You can launch an external 3D simulation to observe the particle trajectories and field gradients in real time.</p>

          <div className="sim-callout-banner">
            <div className="sim-callout-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="3" width="20" height="14" rx="2" />
                <polygon points="10 8 16 10 10 12" fill="currentColor" stroke="none" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
              </svg>
            </div>
            <div className="sim-callout-text">
              <h4>External Unity WebGL Simulator</h4>
              <p>
                Run the full 3D Stern-Gerlach apparatus simulation directly in your browser without local frame embedding. Adjust magnetic gradients, rotate collimators, and inspect atomic beam splitting in real time.
              </p>
              <a
                href={process.env.NEXT_PUBLIC_UNITY_SIMULATION_URL || process.env.NEXT_PUBLIC_UNITY_API_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="sim-launch-link"
              >
                <span>Launch Unity WebGL Simulator (Opens in New Tab)</span>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== QUANTUM CALCULATIONS SUITE ===================== */}
      <section id="calculators" className="content-section">
        <div className="section-inner">
          <div className="section-label">Section 10</div>
          <h2 className="section-title">Quantum Calculation &amp; <span className="accent">Analysis Suite</span></h2>

          <p>
            Interactive quantum calculators for atomic ground state beam splitting (<MathInline tex="Z = 1 \dots 60" />), magnetic deflection and force, sequential Stern-Gerlach measurement probabilities, and quantum barrier tunneling wavevectors.
          </p>

          <QuantumCalculators />

          <ResearchStudio />
        </div>
      </section>

      {/* ===================== MISCONCEPTIONS ===================== */}
      <section id="misconceptions" className="content-section">
        <div className="section-inner">
          <div className="section-label">Section 11</div>
          <h2 className="section-title">Common <span className="accent">Misconceptions</span></h2>

          <p>The Stern-Gerlach experiment is often taught with simplifications that turn into full-blown misunderstandings. Here are the most common ones.</p>

          <div className="misconception-card">
            <div className="misconception-header">"The experiment discovered electron spin"</div>
            <div className="misconception-body">
              <div className="misconception-wrong">
                <div className="misconception-label">✕ Myth</div>
                <p className="misconception-text">Stern and Gerlach discovered the spin of the electron through their 1922 experiment.</p>
              </div>
              <div className="misconception-right">
                <div className="misconception-label">✓ Reality</div>
                <p className="misconception-text">Stern and Gerlach were testing Bohr-Sommerfeld "space quantization" — the idea that orbital angular momentum is quantized. Electron spin wasn't proposed until 1925 by Uhlenbeck and Goudsmit, three years after the experiment. Stern and Gerlach themselves believed they had confirmed Bohr's model.</p>
              </div>
            </div>
          </div>

          <div className="misconception-card">
            <div className="misconception-header">"A uniform magnetic field would work the same way"</div>
            <div className="misconception-body">
              <div className="misconception-wrong">
                <div className="misconception-label">✕ Myth</div>
                <p className="misconception-text">Any magnetic field would deflect the atoms and split the beam.</p>
              </div>
              <div className="misconception-right">
                <div className="misconception-label">✓ Reality</div>
                <p className="misconception-text">A uniform field causes Larmor precession — the magnetic moment precesses around the field direction like a gyroscope — but produces zero net force. You need a field gradient (∂B/∂z ≠ 0) to create a translational force on the atom.</p>
              </div>
            </div>
          </div>

          <div className="misconception-card">
            <div className="misconception-header">"The two spots prove only two spin states exist"</div>
            <div className="misconception-body">
              <div className="misconception-wrong">
                <div className="misconception-label">✕ Myth</div>
                <p className="misconception-text">Two spots means spin can only ever have two values.</p>
              </div>
              <div className="misconception-right">
                <div className="misconception-label">✓ Reality</div>
                <p className="misconception-text">Two spots prove that 2J + 1 = 2 for silver's ground state (J = 1/2). Other atoms with different J values would produce different numbers of spots — for instance, J = 1 gives three spots, J = 3/2 gives four spots. The number of spots depends on the quantum numbers of the specific atom.</p>
              </div>
            </div>
          </div>

          <div className="misconception-card">
            <div className="misconception-header">"Spin is like a spinning top"</div>
            <div className="misconception-body">
              <div className="misconception-wrong">
                <div className="misconception-label">✕ Myth</div>
                <p className="misconception-text">The electron physically rotates about an axis, like a tiny spinning ball.</p>
              </div>
              <div className="misconception-right">
                <div className="misconception-label">✓ Reality</div>
                <p className="misconception-text">Spin has no classical analog. It is an intrinsic quantum property with no corresponding physical rotation. A point particle cannot "spin." The angular momentum is real and measurable (as the SG experiment proves), but the mechanism is fundamentally non-classical. Spin emerges naturally from relativistic quantum mechanics (Dirac equation).</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== APPLICATIONS ===================== */}
      <section id="applications" className="content-section">
        <div className="section-inner">
          <div className="section-label">Section 12</div>
          <h2 className="section-title">Real-World <span className="accent">Applications</span></h2>

          <p>The principles demonstrated by the Stern-Gerlach experiment have become foundational across modern physics and technology.</p>

          <div className="card-grid card-grid-2">
            <div className="app-card">
              <div className="app-card-icon">
                <svg viewBox="0 0 40 40" fill="none" stroke="var(--accent-1)" strokeWidth="1.5"><circle cx="20" cy="20" r="15"/><path d="M12 20h16M20 12v16"/><circle cx="20" cy="20" r="5" strokeDasharray="2,2"/></svg>
              </div>
              <h4>MRI (Magnetic Resonance Imaging)</h4>
              <p>MRI scanners exploit the interaction between magnetic moments (of hydrogen nuclei in water) and magnetic field gradients — the exact same physics as the SG experiment. Gradient coils encode spatial position by frequency, creating detailed images of soft tissue.</p>
            </div>

            <div className="app-card">
              <div className="app-card-icon">
                <svg viewBox="0 0 40 40" fill="none" stroke="var(--accent-2)" strokeWidth="1.5"><rect x="8" y="8" width="24" height="24" rx="3"/><circle cx="16" cy="16" r="3"/><circle cx="24" cy="24" r="3"/><line x1="16" y1="16" x2="24" y2="24" strokeDasharray="2,2"/></svg>
              </div>
              <h4>Quantum Computing (Qubits)</h4>
              <p>The spin-1/2 two-state system is the physical realization of a qubit. The Bloch sphere geometry, Pauli gate operations (X, Y, Z gates), and measurement projections all trace directly back to the SG framework.</p>
            </div>

            <div className="app-card">
              <div className="app-card-icon">
                <svg viewBox="0 0 40 40" fill="none" stroke="var(--accent-3)" strokeWidth="1.5"><path d="M8 30 L20 10 L32 30"/><circle cx="20" cy="10" r="3"/><line x1="20" y1="13" x2="20" y2="30"/></svg>
              </div>
              <h4>Atomic Beam Magnetic Resonance</h4>
              <p>Isidor Rabi (Nobel Prize 1944) extended the SG method by adding oscillating fields between two SG magnets. This became the basis for precise measurements of nuclear magnetic moments and led directly to the development of NMR spectroscopy.</p>
            </div>

            <div className="app-card">
              <div className="app-card-icon">
                <svg viewBox="0 0 40 40" fill="none" stroke="var(--accent-1)" strokeWidth="1.5"><rect x="5" y="15" width="30" height="10" rx="2"/><path d="M12 15 V10 M20 15 V10 M28 15 V10"/><path d="M12 25 V30 M20 25 V30 M28 25 V30"/><circle cx="12" cy="20" r="2" fill="var(--accent-1)"/></svg>
              </div>
              <h4>Spintronics</h4>
              <p>Spintronic devices use the spin of electrons (rather than their charge) to store, process, and transmit information. Giant magnetoresistance (GMR), which underlies modern hard drive read heads, depends on spin-dependent scattering — a direct consequence of the physics the SG experiment revealed.</p>
            </div>

            <div className="app-card">
              <div className="app-card-icon">
                <svg viewBox="0 0 40 40" fill="none" stroke="var(--accent-2)" strokeWidth="1.5"><circle cx="20" cy="20" r="12"/><path d="M20 8 v24 M8 20 h24"/><circle cx="20" cy="14" r="2" fill="var(--accent-2)"/><circle cx="20" cy="26" r="2" fill="var(--accent-2)"/></svg>
              </div>
              <h4>Particle Physics</h4>
              <p>Measurements of the magnetic moments of muons, protons, and neutrons extend the SG concept to fundamental particles. The anomalous magnetic moment of the muon (g-2 experiment at Fermilab) is one of the most precise tests of the Standard Model.</p>
            </div>

            <div className="app-card">
              <div className="app-card-icon">
                <svg viewBox="0 0 40 40" fill="none" stroke="var(--accent-3)" strokeWidth="1.5"><circle cx="20" cy="20" r="8"/><path d="M14 14 L26 26 M14 26 L26 14"/><circle cx="20" cy="20" r="14" strokeDasharray="3,3"/></svg>
              </div>
              <h4>Quantum Entanglement & Bell Tests</h4>
              <p>Bell inequality experiments use pairs of spin-1/2 particles (or photon polarizations, which are mathematically equivalent) to test quantum non-locality. The SG-type measurement on each particle of an entangled pair is what reveals violations of classical correlations.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== KEY POINTS ===================== */}
      <section id="keypoints" className="content-section">
        <div className="section-inner">
          <div className="section-label">Section 13</div>
          <h2 className="section-title">Key <span className="accent">Points</span></h2>

          <div className="key-points-list">
            <div className="key-point">
              <div className="key-point-num">1</div>
              <div className="key-point-text">The experiment sends silver atoms through a <strong>non-uniform magnetic field</strong>. The field gradient creates a force proportional to the z-component of the magnetic moment.</div>
            </div>
            <div className="key-point">
              <div className="key-point-num">2</div>
              <div className="key-point-text">Classical physics predicts a continuous smear on the detector. Quantum mechanics predicts discrete spots — and the experiment confirms discrete spots.</div>
            </div>
            <div className="key-point">
              <div className="key-point-num">3</div>
              <div className="key-point-text">Silver has J = 1/2 (from the single unpaired 5s electron with L=0, S=1/2), giving exactly <strong>two spots</strong> — corresponding to m_J = +1/2 and m_J = −1/2.</div>
            </div>
            <div className="key-point">
              <div className="key-point-num">4</div>
              <div className="key-point-text">The Pauli matrices (σ_x, σ_y, σ_z) describe spin-1/2 mathematically. They don't commute — this is why measuring spin along one axis destroys information about orthogonal axes.</div>
            </div>
            <div className="key-point">
              <div className="key-point-num">5</div>
              <div className="key-point-text">The Bloch sphere maps every spin-1/2 state to a point on a unit sphere. The poles are spin-up and spin-down; the equator contains equal superpositions.</div>
            </div>
            <div className="key-point">
              <div className="key-point-num">6</div>
              <div className="key-point-text">Sequential SG experiments demonstrate that quantum measurement is <strong>not passive observation</strong> — it actively changes the state of the system.</div>
            </div>
            <div className="key-point">
              <div className="key-point-num">7</div>
              <div className="key-point-text">A uniform magnetic field causes precession only. A <strong>gradient</strong> (∂B/∂z) is required to create a net translational force that deflects the atoms.</div>
            </div>
            <div className="key-point">
              <div className="key-point-num">8</div>
              <div className="key-point-text">The spin-1/2 system is the physical realization of a <strong>qubit</strong> — the fundamental building block of quantum information and quantum computing.</div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== REFERENCES ===================== */}
      <section id="references" className="content-section">
        <div className="section-inner">
          <div className="section-label">Section 14</div>
          <h2 className="section-title">References <span className="accent">& Links</span></h2>

          <h3>Wikipedia Articles</h3>
          <div className="ref-list">
            <a className="ref-item" href="https://en.wikipedia.org/wiki/Stern%E2%80%93Gerlach_experiment" target="_blank" rel="noopener noreferrer">
              <svg className="ref-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
              <span className="ref-text">Stern–Gerlach experiment</span>
              <span className="ref-domain">wikipedia.org</span>
            </a>
            <a className="ref-item" href="https://en.wikipedia.org/wiki/Spin_(physics)" target="_blank" rel="noopener noreferrer">
              <svg className="ref-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
              <span className="ref-text">Spin (physics)</span>
              <span className="ref-domain">wikipedia.org</span>
            </a>
            <a className="ref-item" href="https://en.wikipedia.org/wiki/Pauli_matrices" target="_blank" rel="noopener noreferrer">
              <svg className="ref-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
              <span className="ref-text">Pauli matrices</span>
              <span className="ref-domain">wikipedia.org</span>
            </a>
            <a className="ref-item" href="https://en.wikipedia.org/wiki/Bloch_sphere" target="_blank" rel="noopener noreferrer">
              <svg className="ref-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
              <span className="ref-text">Bloch sphere</span>
              <span className="ref-domain">wikipedia.org</span>
            </a>
            <a className="ref-item" href="https://en.wikipedia.org/wiki/Space_quantization" target="_blank" rel="noopener noreferrer">
              <svg className="ref-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
              <span className="ref-text">Space quantization</span>
              <span className="ref-domain">wikipedia.org</span>
            </a>
            <a className="ref-item" href="https://en.wikipedia.org/wiki/Magnetic_moment" target="_blank" rel="noopener noreferrer">
              <svg className="ref-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
              <span className="ref-text">Magnetic moment</span>
              <span className="ref-domain">wikipedia.org</span>
            </a>
          </div>

          <h3>Textbook References</h3>
          <div className="ref-list">
            <div className="ref-item" style={{ cursor: 'default' }}>
              <svg className="ref-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>
              <span className="ref-text">D.J. Griffiths — "Introduction to Quantum Mechanics," Ch. 4</span>
              <span className="ref-domain">textbook</span>
            </div>
            <div className="ref-item" style={{ cursor: 'default' }}>
              <svg className="ref-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>
              <span className="ref-text">J.J. Sakurai — "Modern Quantum Mechanics," Ch. 1 (opens with SG)</span>
              <span className="ref-domain">textbook</span>
            </div>
            <div className="ref-item" style={{ cursor: 'default' }}>
              <svg className="ref-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>
              <span className="ref-text">R. Feynman — "The Feynman Lectures on Physics," Vol. III, Ch. 5</span>
              <span className="ref-domain">textbook</span>
            </div>
            <div className="ref-item" style={{ cursor: 'default' }}>
              <svg className="ref-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>
              <span className="ref-text">C. Cohen-Tannoudji — "Quantum Mechanics," Vol. 1</span>
              <span className="ref-domain">textbook</span>
            </div>
          </div>

          <h3>Original Papers</h3>
          <div className="ref-list">
            <a className="ref-item" href="https://doi.org/10.1007/BF01326983" target="_blank" rel="noopener noreferrer">
              <svg className="ref-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              <span className="ref-text">Gerlach & Stern (1922) — "Der experimentelle Nachweis der Richtungsquantelung im Magnetfeld"</span>
              <span className="ref-domain">doi.org</span>
            </a>
            <a className="ref-item" href="https://doi.org/10.1063/1.1650229" target="_blank" rel="noopener noreferrer">
              <svg className="ref-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              <span className="ref-text">Friedrich & Herschbach (2003) — "Stern and Gerlach: How a Bad Cigar Helped Reorient Atomic Physics"</span>
              <span className="ref-domain">Physics Today</span>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: '40px 48px',
        textAlign: 'center',
        borderTop: '1px solid var(--border-color)',
        fontFamily: "'Inter', sans-serif",
        fontSize: 13,
        color: 'var(--text-muted)'
      }}>
        <p>The Stern-Gerlach Experiment — An Interactive Educational Resource</p>
        <p style={{ marginTop: 8, fontSize: 12 }}>Built for conceptual understanding · Powered by Gemini AI</p>
      </footer>
    </>
  );
}
