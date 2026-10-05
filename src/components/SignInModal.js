'use client';
import { useState, useEffect } from 'react';

function generateCaptcha() {
  const a = Math.floor(Math.random() * 20) + 1;
  const b = Math.floor(Math.random() * 20) + 1;
  const ops = ['+', '-', '×'];
  const op = ops[Math.floor(Math.random() * 3)];
  let answer;
  switch (op) {
    case '+': answer = a + b; break;
    case '-': answer = a - b; break;
    case '×': answer = a * b; break;
  }
  return { question: `${a} ${op} ${b} = ?`, answer };
}

export default function SignInModal({ open, onClose, onSignIn }) {
  const [bookOpen, setBookOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [captcha, setCaptcha] = useState(generateCaptcha());
  const [captchaInput, setCaptchaInput] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setBookOpen(false);
      setError('');
      setCaptcha(generateCaptcha());
      setCaptchaInput('');
      setTimeout(() => setBookOpen(true), 300);
    }
  }, [open]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !email.trim() || !password.trim()) {
      setError('All fields are required.');
      return;
    }

    if (parseInt(captchaInput) !== captcha.answer) {
      setError('CAPTCHA answer is incorrect. Try again.');
      setCaptcha(generateCaptcha());
      setCaptchaInput('');
      return;
    }

    onSignIn({ name: name.trim(), email: email.trim() });
    setName('');
    setEmail('');
    setPassword('');
    setCaptchaInput('');
  };

  return (
    <div className={`modal-overlay ${open ? 'open' : ''}`} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="book-container">
        <div className={`book ${bookOpen ? 'opening' : ''}`}>
          {/* Front cover */}
          <div className="book-cover-front" onClick={() => setBookOpen(true)}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--accent-1)" strokeWidth="1.5" style={{ marginBottom: 16 }}>
              <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
              <path d="M8 7h8M8 11h6"/>
            </svg>
            <h2>Welcome</h2>
            <p>Click to open &amp; sign in</p>
          </div>

          {/* Interior page — sign-in form */}
          <div className="book-page">
            <button className="modal-close" onClick={onClose}>×</button>
            <h3>Sign In</h3>
            <form className="signin-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Verify you're human</label>
                <div className="captcha-row">
                  <span className="captcha-question">{captcha.question}</span>
                  <input
                    type="number"
                    placeholder="?"
                    value={captchaInput}
                    onChange={(e) => setCaptchaInput(e.target.value)}
                    style={{ width: 80 }}
                  />
                </div>
              </div>
              {error && <p style={{ color: '#ef4444', fontSize: 13, fontFamily: "'Inter', sans-serif" }}>{error}</p>}
              <button type="submit" className="btn-primary" style={{ marginTop: 8 }}>
                Sign In
              </button>
              <button type="button" className="btn-secondary" onClick={onClose}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
