import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function LogoutButton() {
  const { logout, profile } = useAuth();
  const [confirming, setConfirming] = useState(false);

  if (confirming) {
    return (
      <div
        style={{
          background: '#FEE2E2',
          borderRadius: 12,
          padding: 10,
          textAlign: 'center',
        }}
      >
        <div
          style={{
            fontSize: 11,
            color: '#9A3412',
            fontWeight: 700,
            marginBottom: 6,
            fontFamily: 'Nunito',
          }}
        >
          Yakin mau keluar, {profile?.full_name?.split(' ')[0] || 'kamu'}?
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <button
            onClick={logout}
            style={{
              flex: 1,
              padding: 6,
              borderRadius: 8,
              border: 'none',
              background: '#EF4444',
              color: 'white',
              fontSize: 11,
              fontWeight: 700,
              fontFamily: 'Nunito',
              cursor: 'pointer',
            }}
          >
            Ya, keluar
          </button>
          <button
            onClick={() => setConfirming(false)}
            style={{
              flex: 1,
              padding: 6,
              borderRadius: 8,
              border: 'none',
              background: 'white',
              color: '#9A3412',
              fontSize: 11,
              fontWeight: 700,
              fontFamily: 'Nunito',
              cursor: 'pointer',
            }}
          >
            Batal
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      style={{
        width: '100%',
        padding: '8px 12px',
        borderRadius: 12,
        border: '2px solid #FEE2E2',
        background: 'white',
        color: '#EF4444',
        cursor: 'pointer',
        fontFamily: 'Nunito',
        fontWeight: 700,
        fontSize: 12,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
      }}
    >
      🚪 Keluar
    </button>
  );
}