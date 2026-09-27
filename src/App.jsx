import { useEffect, useState } from 'react';
import { useAuth } from './contexts/AuthContext';
import AuthPage from './pages/AuthPage';

import Sidebar from './components/SideBar';
import Topbar from './components/TopBar';
import MobileNav from './components/MobileNav';

import ZoneBerandaMurid from './pages/ZoneBerandaMurid';
import ZoneBerandaGuru from './pages/ZoneBerandaGuru';
import ZoneLiterasi from './pages/ZoneLiterasi';
import ZoneLiterasiGuru from './pages/ZoneLiterasiGuru';
import PdfViewerPage from './pages/PdfViewerPage';
import ZoneRedaksi from './pages/ZoneRedaksi';
import ZoneStudio from './pages/ZoneStudio';
import ZoneGaleri from './pages/ZoneGaleri';
import ZonePanduan from './pages/ZonePanduan';

export default function App() {
  const { user, profile, loading, updateProgress } = useAuth();
  const [zone, setZone] = useState('beranda');
  const [pdfView, setPdfView] = useState(null);

  const role = profile?.role === 'guru' ? 'guru' : 'siswa';

  // Reset saat user ganti
  useEffect(() => {
    let active = true;
    if (user && active) {
      setZone('beranda');
      setPdfView(null);
    }
    return () => { active = false; };
  }, [user]);

  // ── Guard: guru tidak boleh di "redaksi" ─────────────────────────
  useEffect(() => {
    if (role === 'guru' && zone === 'redaksi') {
      setZone('beranda');
    }
  }, [role, zone]);

  const handleSetZone = (z) => {
    // Blok kalau guru mencoba masuk redaksi
    if (role === 'guru' && z === 'redaksi') {
      setZone('beranda');
      return;
    }
    setPdfView(null);
    setZone(z);
  };

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#F2FBF5', gap: 16 }}>
        <img src="/logo.png" alt="SI NARA Logo" style={{ width: 64, height: 64, objectFit: 'contain' }} />
        <div style={{ fontFamily: 'Nunito', fontWeight: 800, fontSize: 16, color: '#2AA168' }}>
          Memuat SI NARA...
        </div>
      </div>
    );
  }

  if (!user) return <AuthPage />;

  const progress = profile?.progress_level || {
    literasiDone: false,
    checkedMaterials: {},
    quizPassed: false,
    adiksimbaDone: false,
  };

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#F2FBF5', overflow: 'hidden' }}>
      <Sidebar zone={zone} setZone={handleSetZone} progress={progress} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Topbar zone={pdfView ? 'literasi' : zone} />

        <main style={{ flex: 1, overflow: 'auto', padding: 0 }}>
          {pdfView ? (
            <PdfViewerPage
              materialKey={pdfView.materialKey}
              onBack={() => setPdfView(null)}
            />
          ) : (
            <>
              {zone === 'beranda' && role === 'guru' && (
                <ZoneBerandaGuru setZone={handleSetZone} />
              )}
              {zone === 'beranda' && role === 'siswa' && (
                <ZoneBerandaMurid role={role} setZone={handleSetZone} progress={progress} />
              )}

              {zone === 'literasi' && role === 'guru' && <ZoneLiterasiGuru />}
              {zone === 'literasi' && role === 'siswa' && (
                <ZoneLiterasi
                  progress={progress}
                  onUpdateProgress={updateProgress}
                  onOpenPdf={(materialKey) => setPdfView({ materialKey })}
                />
              )}

              {/* Redaksi hanya untuk siswa */}
              {zone === 'redaksi' && role === 'siswa' && <ZoneRedaksi setZone={handleSetZone} />}

              {zone === 'studio' && <ZoneStudio role={role} />}
              {zone === 'galeri' && <ZoneGaleri />}
              {zone === 'panduan' && <ZonePanduan role={role} setZone={handleSetZone} />}
            </>
          )}
        </main>

        <MobileNav zone={zone} setZone={handleSetZone} progress={progress} />
      </div>
    </div>
  );
}