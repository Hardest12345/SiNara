import { ZONES } from '../data/constants';
import { useAuth } from '../contexts/AuthContext';

export default function MobileNav({ zone, setZone, progress }) {
  const { profile } = useAuth();
  const role = profile?.role === 'guru' ? 'guru' : 'siswa';
  const isLiterasiDone = progress?.literasiDone;

  const visibleZones = ZONES.filter((z) => {
    if (role === 'guru' && z.id === 'redaksi') return false;
    return true;
  });

  const getLocked = (id) => {
    if (role === 'guru') return false;
    if (id === 'redaksi' || id === 'studio') return !isLiterasiDone;
    return false;
  };

  return (
    <nav
      className="show-mobile"
      style={{
        borderTop: '2px solid #E6F5EC',
        background: 'white', padding: '8px 4px 12px',
        display: 'none',
      }}
    >
      {visibleZones.map((z) => {
        const locked = getLocked(z.id);
        return (
          <button
            key={z.id}
            onClick={() => !locked && setZone(z.id)}
            disabled={locked}
            style={{
              flex: 1, display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: 2,
              border: 'none', background: 'transparent',
              cursor: locked ? 'not-allowed' : 'pointer',
              padding: '4px 0',
              opacity: locked ? 0.45 : 1,
            }}
          >
            <span style={{ fontSize: 22 }}>{locked ? '🔒' : z.emoji}</span>
            <span
              style={{
                fontSize: 10, fontFamily: 'Nunito', fontWeight: 700,
                color: zone === z.id ? z.color : '#9CA3AF',
              }}
            >
              {z.short}
            </span>
          </button>
        );
      })}
    </nav>
  );
}