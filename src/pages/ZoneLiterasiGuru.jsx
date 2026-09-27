import { useState, useEffect } from "react";
import SectionHeader from "../components/SectionHeader";
import ModalNotification from "../components/ModalNotification";
import { useAuth } from "../contexts/AuthContext";
import { MATERIALS } from "../data/constants";
import { getMaterials, upsertMaterial, uploadMaterialPdf } from "../lib/db";

export default function ZoneLiterasiGuru() {
  const { user } = useAuth();
  const [materialsMap, setMaterialsMap] = useState({}); // { key: { pdf_url, updated_at, ... } }
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState({}); // { key: true/false }

  const [modal, setModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "info",
    confirmText: "OK",
  });

  const showModal = ({ title, message, type = "info", confirmText = "OK" }) => {
    setModal({ isOpen: true, title, message, type, confirmText });
  };

  const closeModal = () => setModal((m) => ({ ...m, isOpen: false }));

  // ═══ Load materials dari DB ═══════════════════════════════════════
  const loadMaterials = async () => {
    const list = await getMaterials();
    const map = {};
    list.forEach((m) => {
      map[m.material_key] = m;
    });
    setMaterialsMap(map);
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      await loadMaterials();
      if (mounted) setLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // ═══ Upload handler ═══════════════════════════════════════════════
  const handleUpload = async (materialKey, file) => {
    if (!file || !user) return;

    // Validasi: harus PDF & maks 20 MB
    if (file.type !== "application/pdf") {
      showModal({
        title: "Format File Salah",
        message: "File harus berformat PDF.",
        type: "warning",
      });
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      showModal({
        title: "Ukuran Terlalu Besar",
        message: "Ukuran file PDF maksimal 20 MB.",
        type: "warning",
      });
      return;
    }

    setUploading((p) => ({ ...p, [materialKey]: true }));
    try {
      const materialInfo = MATERIALS.find((m) => m.id === materialKey);

      // 1. Upload PDF ke Storage
      const pdfUrl = await uploadMaterialPdf(file, materialKey);

      // 2. Upsert ke tabel materials
      await upsertMaterial({
        materialKey,
        title: materialInfo?.title || materialKey,
        description: materialInfo?.desc || "",
        pdfUrl,
        uploadedBy: user.id,
      });

      // 3. Refresh
      await loadMaterials();
      showModal({
        title: "Upload Berhasil! ✅",
        message: "Modul PDF berhasil diunggah dan siap dibaca oleh siswa.",
        type: "success",
      });
    } catch (err) {
      console.error(err);
      showModal({
        title: "Gagal Upload",
        message: err.message || "Terjadi kesalahan saat mengunggah PDF.",
        type: "error",
      });
    } finally {
      setUploading((p) => ({ ...p, [materialKey]: false }));
    }
  };

  const formatDate = (iso) => {
    if (!iso) return "—";
    return new Date(iso).toLocaleString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div style={{ padding: 24, maxWidth: 1000, margin: "0 auto" }}>
      <SectionHeader
        emoji="📚"
        title="Kelola Bahan Ajar"
        subtitle="Unggah PDF materi untuk siswa"
        color="#3B8FD4"
      />

      {/* Info */}
      <div
        style={{
          background: "#DBF0FF",
          borderRadius: 14,
          padding: "14px 18px",
          marginBottom: 20,
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <span style={{ fontSize: 22 }}>👩‍🏫</span>
        <div style={{ fontSize: 13, color: "#1E40AF", lineHeight: 1.5 }}>
          <strong>Info:</strong> Unggah file PDF untuk setiap topik materi.
          Siswa akan bisa membuka modul dalam mode <strong>preview</strong>{" "}
          (read-only) setelah diunggah.
        </div>
      </div>

      {loading ? (
        <div style={{ padding: 60, textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📚</div>
          <div
            style={{ fontFamily: "Nunito", fontWeight: 800, color: "#3B8FD4" }}
          >
            Memuat daftar modul...
          </div>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: 16,
          }}
        >
          {MATERIALS.map((m) => {
            const dbMat = materialsMap[m.id];
            const hasPdf = !!dbMat?.pdf_url;
            const isUploading = uploading[m.id];

            return (
              <div
                key={m.id}
                style={{
                  background: "white",
                  borderRadius: 18,
                  padding: 20,
                  border: `2px solid ${hasPdf ? m.color : "#E6F5EC"}`,
                  boxShadow: "0 2px 12px rgba(42,161,104,0.08)",
                  position: "relative",
                }}
              >
                {/* Status badge */}
                <div
                  style={{
                    position: "absolute",
                    top: 14,
                    right: 14,
                    background: hasPdf ? "#D4F0E3" : "#FEF9E0",
                    color: hasPdf ? "#166534" : "#854D0E",
                    padding: "3px 10px",
                    borderRadius: 20,
                    fontSize: 10,
                    fontWeight: 700,
                    fontFamily: "Nunito",
                  }}
                >
                  {hasPdf ? "✅ Sudah diunggah" : "⚠️ Belum ada"}
                </div>

                <div style={{ fontSize: 36, marginBottom: 12 }}>{m.emoji}</div>
                <div
                  style={{
                    fontFamily: "Nunito",
                    fontWeight: 800,
                    fontSize: 15,
                    color: "#1a2e22",
                    marginBottom: 6,
                    paddingRight: 100,
                  }}
                >
                  {m.title}
                </div>
                <div
                  style={{
                    fontSize: 13,
                    color: "#6B9E80",
                    lineHeight: 1.5,
                    marginBottom: 14,
                  }}
                >
                  {m.desc}
                </div>

                {/* Info PDF yang ada */}
                {hasPdf && (
                  <div
                    style={{
                      background: "#F0FAF4",
                      borderRadius: 12,
                      padding: "10px 12px",
                      marginBottom: 12,
                      fontSize: 11,
                      color: "#4A7060",
                    }}
                  >
                    📄 <strong>PDF aktif</strong>
                    <div style={{ marginTop: 2, opacity: 0.8 }}>
                      Diunggah:{" "}
                      {formatDate(dbMat.uploaded_at || dbMat.updated_at)}
                    </div>
                    <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                      <a
                        href={dbMat.pdf_url}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          padding: "4px 10px",
                          borderRadius: 8,
                          background: "white",
                          color: "#2AA168",
                          fontSize: 11,
                          fontWeight: 700,
                          textDecoration: "none",
                          fontFamily: "Nunito",
                        }}
                      >
                        👁️ Preview
                      </a>
                    </div>
                  </div>
                )}

                {/* Upload button */}
                <label
                  style={{
                    display: "block",
                    width: "100%",
                    padding: "10px",
                    borderRadius: 12,
                    border: `2px dashed ${isUploading ? "#9CA3AF" : m.color}`,
                    background: isUploading ? "#F3F4F6" : m.color + "10",
                    color: isUploading ? "#9CA3AF" : m.color,
                    cursor: isUploading ? "wait" : "pointer",
                    fontFamily: "Nunito",
                    fontWeight: 700,
                    fontSize: 13,
                    textAlign: "center",
                    boxSizing: "border-box",
                  }}
                >
                  {isUploading
                    ? "⏳ Mengunggah..."
                    : hasPdf
                      ? "🔄 Ganti PDF"
                      : "📤 Unggah PDF"}
                  <input
                    type="file"
                    accept="application/pdf"
                    style={{ display: "none" }}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleUpload(m.id, file);
                      e.target.value = ""; // reset supaya bisa upload file yang sama
                    }}
                    disabled={isUploading}
                  />
                </label>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Notifikasi */}
      <ModalNotification
        isOpen={modal.isOpen}
        onClose={closeModal}
        title={modal.title}
        message={modal.message}
        type={modal.type}
        confirmText={modal.confirmText}
      />
    </div>
  );
}
