import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function AuthPage() {
  const { login, register } = useAuth();
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [form, setForm] = useState({
    email: '',
    password: '',
    fullName: '',
    role: 'siswa',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'login') {
        if (!form.email.includes('@')) throw new Error('Email harus mengandung "@"');
        await login({ email: form.email, password: form.password });
      } else {
        if (!form.email.includes('@')) throw new Error('Email harus mengandung "@"');
        if (form.password.length < 6) throw new Error('Password minimal 6 karakter');
        if (!form.fullName.trim()) throw new Error('Nama lengkap wajib diisi');

        await register({
          email: form.email,
          password: form.password,
          fullName: form.fullName,
          role: form.role,
        });

        // Auto-login setelah register
        await login({ email: form.email, password: form.password });
      }
      // Sukses → AuthContext akan otomatis redirect
    } catch (err) {
      const msg = err?.message || 'Terjadi kesalahan';
      if (msg.includes('Invalid login credentials')) {
        setError('Email atau password salah.');
      } else if (msg.includes('User already registered')) {
        setError('Email ini sudah terdaftar. Coba login.');
      } else if (msg.includes('Password should be')) {
        setError('Password minimal 6 karakter.');
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg,#1E8C58 0%,#2AA168 40%,#3B8FD4 100%)',
        padding: 20,
        fontFamily: 'Poppins, sans-serif',
      }}
    >
      <div
        style={{
          background: 'white',
          borderRadius: 24,
          padding: '36px 32px',
          width: '100%',
          maxWidth: 440,
          boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div
            style={{
              width: 64,
              height: 64,
              margin: '0 auto 12px',
              borderRadius: 20,
              background: 'linear-gradient(135deg,#2AA168,#3B8FD4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 32,
            }}
          >
            📰
          </div>
          <div
            style={{
              fontFamily: 'Nunito, sans-serif',
              fontWeight: 900,
              fontSize: 26,
              color: '#1a2e22',
            }}
          >
            SI NARA
          </div>
          <div style={{ fontSize: 12, color: '#6B9E80', fontWeight: 600, letterSpacing: 1 }}>
            JURNALIS CILIK SUMBERBRANTAS
          </div>
        </div>

        {/* Toggle Login/Register */}
        <div
          style={{
            display: 'flex',
            background: '#F0FAF4',
            borderRadius: 12,
            padding: 4,
            marginBottom: 20,
          }}
        >
          {['login', 'register'].map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => {
                setMode(m);
                setError('');
              }}
              style={{
                flex: 1,
                padding: '10px 0',
                borderRadius: 9,
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'Nunito, sans-serif',
                fontWeight: 700,
                fontSize: 14,
                background: mode === m ? '#2AA168' : 'transparent',
                color: mode === m ? 'white' : '#6B9E80',
                transition: 'all 0.2s',
              }}
            >
              {m === 'login' ? '🔑 Masuk' : '✨ Daftar'}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {mode === 'register' && (
            <>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#4A7060', marginBottom: 6, fontFamily: 'Nunito' }}>
                👤 Nama Lengkap
              </label>
              <input
                className="field-input"
                style={{ marginBottom: 14 }}
                placeholder="Contoh: Budi Santoso"
                value={form.fullName}
                onChange={(e) => handleChange('fullName', e.target.value)}
              />

              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#4A7060', marginBottom: 6, fontFamily: 'Nunito' }}>
                🎓 Peran
              </label>
              <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                {[
                  { value: 'siswa', label: '👦 Siswa' },
                  { value: 'guru',  label: '👩‍🏫 Guru' },
                ].map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => handleChange('role', r.value)}
                    style={{
                      flex: 1,
                      padding: '10px 0',
                      borderRadius: 12,
                      border: `2px solid ${form.role === r.value ? '#2AA168' : '#D4F0E3'}`,
                      background: form.role === r.value ? '#D4F0E3' : 'white',
                      color: form.role === r.value ? '#166534' : '#6B9E80',
                      cursor: 'pointer',
                      fontFamily: 'Nunito',
                      fontWeight: 700,
                      fontSize: 13,
                    }}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </>
          )}

          <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#4A7060', marginBottom: 6, fontFamily: 'Nunito' }}>
            📧 Email
          </label>
          <input
            className="field-input"
            style={{ marginBottom: 14 }}
            type="email"
            placeholder="nama@email.com"
            value={form.email}
            onChange={(e) => handleChange('email', e.target.value)}
            autoComplete="email"
          />

          <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#4A7060', marginBottom: 6, fontFamily: 'Nunito' }}>
            🔒 Password
          </label>
          <input
            className="field-input"
            style={{ marginBottom: 16 }}
            type="password"
            placeholder="Minimal 6 karakter"
            value={form.password}
            onChange={(e) => handleChange('password', e.target.value)}
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
          />

          {error && (
            <div
              style={{
                background: '#FEE2E2',
                color: '#9A3412',
                borderRadius: 12,
                padding: '10px 14px',
                fontSize: 13,
                marginBottom: 14,
                fontWeight: 600,
                fontFamily: 'Nunito',
              }}
            >
              ⚠️ {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: 14,
              border: 'none',
              cursor: loading ? 'wait' : 'pointer',
              background: loading
                ? '#B0C4B8'
                : 'linear-gradient(135deg,#2AA168,#3B8FD4)',
              color: 'white',
              fontFamily: 'Nunito',
              fontWeight: 800,
              fontSize: 15,
              transition: 'all 0.2s',
            }}
          >
            {loading
              ? '⏳ Memproses...'
              : mode === 'login'
              ? '🔑 Masuk ke SI NARA'
              : '✨ Daftar Sekarang'}
          </button>
        </form>

        {/* Info */}
        <div
          style={{
            marginTop: 18,
            background: '#F0FAF4',
            borderRadius: 12,
            padding: '10px 14px',
            fontSize: 11,
            color: '#4A7060',
            lineHeight: 1.6,
            textAlign: 'center',
          }}
        >
          💡 Gunakan <strong>email & password</strong> saja. Tidak ada login Google/Instagram di SI NARA.
        </div>
      </div>
    </div>
  );
}