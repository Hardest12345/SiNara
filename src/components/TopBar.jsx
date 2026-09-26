import { ZONES } from '../data/constants';
import { useAuth } from '../contexts/AuthContext';

export default function Topbar({ zone }) {
  const { profile } = useAuth();
  const activeZone = ZONES.find((z) => z.id === zone);
  const role = profile?.role === 'guru' ? 'guru' : 'siswa';
  const initial = (profile?.full_name || 'U').charAt(0).toUpperCase();

  return (
    <header
      style={{
        background: 'white', borderBottom: '2px solid #E6F5EC',
        padding: '12px 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexShrink: 0,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div
          style={{
            width: 36, height: 36, borderRadius: 10, fontSize: 18,
            background: activeZone.color + '20',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          {activeZone.emoji}
        </div>
        <div>
          <div style={{ fontFamily: 'Nunito', fontWeight: 800, fontSize: 16, color: '#1a2e22' }}>
            {activeZone.label}
          </div>
          <div style={{ fontSize: 11, color: '#6B9E80' }}>
            {role === 'guru'
              ? 'Dashboard Pemantauan · SI NARA'
              : 'SI NARA · Jurnalis Cilik Sumberbrantas'}
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div
          style={{
            background: role === 'guru' ? '#DBF0FF' : '#D4F0E3',
            color: role === 'guru' ? '#1E40AF' : '#166534',
            padding: '5px 12px', borderRadius: 20,
            fontSize: 12, fontWeight: 700, fontFamily: 'Nunito',
          }}
        >
          {role === 'guru' ? '👩‍🏫 Guru/Editor' : '👦 Siswa'}
        </div>
        <div
          style={{
            width: 36, height: 36, borderRadius: 50,
            background: role === 'guru'
              ? 'linear-gradient(135deg,#3B8FD4,#1E40AF)'
              : 'linear-gradient(135deg,#2AA168,#3B8FD4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14, color: 'white', fontWeight: 800, fontFamily: 'Nunito',
          }}
        >
          {initial}
        </div>
      </div>
    </header>
  );
}