import { ZONES } from '../data/constants';
import { useAuth } from '../contexts/AuthContext';
import LogoutButton from './LogoutButton';

export default function Sidebar({ zone, setZone, progress }) {
  const { profile } = useAuth();

  const role = profile?.role === 'guru' ? 'guru' : 'siswa';
  const isLiterasiDone = progress?.literasiDone;

  // Filter zone: guru tidak lihat "redaksi"
  const visibleZones = ZONES.filter((z) => {
    if (role === 'guru' && z.id === 'redaksi') return false;
    return true;
  });

  // Lock: guru bebas, siswa butuh literasi
  const getLocked = (zoneId) => {
    if (role === 'guru') return false;
    if (zoneId === 'redaksi') return !isLiterasiDone;
    if (zoneId === 'studio')  return !isLiterasiDone;
    return false;
  };

  return (
    <aside
      className="hidden-mobile"
      style={{
        width: 220, minWidth: 220, background: '#fff',
        borderRight: '2px solid #E6F5EC',
        display: 'flex', flexDirection: 'column',
        zIndex: 20,
        boxShadow: '2px 0 12px rgba(42,161,104,0.07)',
      }}
    >
      {/* Logo */}
      <div style={{ padding: '20px 20px 12px', borderBottom: '2px solid #E6F5EC' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <img
            src="/logo.png"
            alt="SI NARA Logo"
            style={{
              width: 44, height: 44, borderRadius: 14,
              objectFit: 'contain', flexShrink: 0,
            }}
          />
          <div>
            <div style={{ fontFamily: 'Nunito', fontWeight: 900, fontSize: 18, color: '#1a2e22', lineHeight: 1.1 }}>
              SI NARA
            </div>
            <div style={{ fontSize: 10, color: '#6B9E80', fontWeight: 600, letterSpacing: '0.04em' }}>
              JURNALIS CILIK
            </div>
          </div>
        </div>
      </div>

      {/* User Badge */}
      <div style={{ padding: '12px 16px', borderBottom: '2px solid #E6F5EC' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            background: role === 'guru' ? '#DBF0FF' : '#F0FAF4',
            borderRadius: 12,
            padding: '10px 12px',
          }}
        >
          <div
            style={{
              width: 34, height: 34, borderRadius: 50,
              background: role === 'guru'
                ? 'linear-gradient(135deg,#3B8FD4,#1E40AF)'
                : 'linear-gradient(135deg,#2AA168,#166534)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 16, flexShrink: 0,
            }}
          >
            {role === 'guru' ? '👩‍🏫' : '👦'}
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div
              style={{
                fontFamily: 'Nunito', fontWeight: 800, fontSize: 12,
                color: role === 'guru' ? '#1E40AF' : '#166534',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}
              title={profile?.full_name}
            >
              {profile?.full_name || (role === 'guru' ? 'Guru' : 'Siswa')}
            </div>
            <div
              style={{
                fontSize: 10,
                color: role === 'guru' ? '#3B8FD4' : '#2AA168',
                fontWeight: 700,
                letterSpacing: '0.05em',
                fontFamily: 'Nunito',
              }}
            >
              {role === 'guru' ? 'GURU / EDITOR' : 'SISWA'}
            </div>
          </div>
        </div>
      </div>

      {/* Nav Items */}
      <nav style={{ flex: 1, padding: '12px 10px', display: 'flex', flexDirection: 'column', gap: 4 }}>
        {visibleZones.map((z) => {
          const locked = getLocked(z.id);
          return (
            <button
              key={z.id}
              onClick={() => !locked && setZone(z.id)}
              disabled={locked}
              title={locked ? 'Selesaikan Pojok Literasi dulu untuk membuka' : ''}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 12px', borderRadius: 12, border: 'none',
                cursor: locked ? 'not-allowed' : 'pointer',
                background: zone === z.id ? z.color + '18' : 'transparent',
                color: locked ? '#B0C4B8' : (zone === z.id ? z.color : '#4A7060'),
                fontFamily: 'Nunito',
                fontWeight: zone === z.id ? 800 : 600,
                fontSize: 13, textAlign: 'left',
                borderLeft: zone === z.id ? `3px solid ${z.color}` : '3px solid transparent',
                transition: 'all 0.18s',
                opacity: locked ? 0.55 : 1,
              }}
            >
              <span style={{ fontSize: 18 }}>{locked ? '🔒' : z.emoji}</span>
              <span>{z.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Bottom info */}
      <div style={{ padding: '12px 16px', borderTop: '2px solid #E6F5EC', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ background: '#F0FAF4', borderRadius: 12, padding: '10px 12px' }}>
          <div style={{ fontSize: 11, color: '#2AA168', fontWeight: 700, fontFamily: 'Nunito' }}>
            🌿 Sumberbrantas
          </div>
          <div style={{ fontSize: 10, color: '#6B9E80', marginTop: 2 }}>
            Kota Batu, Jawa Timur
          </div>
        </div>
        <LogoutButton />
      </div>
    </aside>
  );
}