import { useState, useEffect } from "react";
import SectionHeader from "../components/SectionHeader";
import ModalNotification from "../components/ModalNotification";
import { useAuth } from "../contexts/AuthContext";
import { MATERIALS } from "../data/constants";
import { getMaterials, upsertMaterial, uploadMaterialPdf } from "../lib/db";

export default function ZoneLiterasiGuru() {
  const { user } = useAuth();
  const [materialsMap, setMaterialsMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState({}); // { key: true/false }
  const [modeByKey, setModeByKey] = useState({}); // { key: 'pdf' | 'link' }
  const [linkInput, setLinkInput] = useState({}); // { key: url string }

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

  // ═══ Set Mode Awal per card sesuai data yang ada ═════════════════
  useEffect(() => {
    const initialModes = {};
    MATERIALS.forEach((m) => {
      const dbMat = materialsMap[m.id];
      if (dbMat?.resource_type) {
        initialModes[m.id] = dbMat.resource_type;
      } else {
        initialModes[m.id] = "pdf"; // default
      }
    });
    setModeByKey(initialModes);
  }, [materialsMap]);

  // ═══ Validasi URL ════════════════════════════════════════════════
  const isValidUrl = (url) => {
    try {
      const u = new URL(url);
      return u.protocol === "http:" || u.protocol === "https:";
    } catch {
      return false;
    }
  };

  // ═══ Upload PDF handler ══════════════════════════════════════════
  const handleUploadPdf = async (materialKey, file) => {
    if (!file || !user) return;

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

      const pdfUrl = await uploadMaterialPdf(file, materialKey);

      await upsertMaterial({
        materialKey,
        title: materialInfo?.title || materialKey,
        description: materialInfo?.desc || "",
        pdfUrl,
        externalUrl: null,
        resourceType: "pdf",
        uploadedBy: user.id,
      });

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

  // ═══ Simpan Link handler ═════════════════════════════════════════
  const handleSaveLink = async (materialKey) => {
    const url = (linkInput[materialKey] || "").trim();

    if (!url) {
      showModal({
        title: "Link Kosong",
        message: "Masukkan URL terlebih dahulu.",
        type: "warning",
      });
      return;
    }

    if (!isValidUrl(url)) {
      showModal({
        title: "URL Tidak Valid",
        message:
          "Pastikan URL dimulai dengan http:// atau https:// (contoh: https://drive.google.com/...)",
        type: "warning",
      });
      return;
    }

    setUploading((p) => ({ ...p, [materialKey]: true }));
    try {
      const materialInfo = MATERIALS.find((m) => m.id === materialKey);

      await upsertMaterial({
        materialKey,
        title: materialInfo?.title || materialKey,
        description: materialInfo?.desc || "",
        pdfUrl: null,
        externalUrl: url,
        resourceType: "link",
        uploadedBy: user.id,
      });

      await loadMaterials();
      setLinkInput((p) => ({ ...p, [materialKey]: "" }));
      showModal({
        title: "Link Tersimpan! ✅",
        message: "Link modul berhasil disimpan. Siswa bisa membukanya dari Pojok Literasi.",
        type: "success",
      });
    } catch (err) {
      console.error(err);
      showModal({
        title: "Gagal Simpan",
        message: err.message || "Terjadi kesalahan saat menyimpan link.",
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
        subtitle="Unggah PDF atau tautkan link untuk siswa"
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
          <strong>Info:</strong> Setiap topik bisa diisi dengan salah satu:{" "}
          <strong>PDF</strong> (preview langsung) atau <strong>Link Eksternal</strong>{" "}
          (Google Drive, YouTube, website, dll.). Pilih mode di setiap card.
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
            gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
            gap: 16,
          }}
        >
          {MATERIALS.map((m) => {
            const dbMat = materialsMap[m.id];
            const hasPdf = !!dbMat?.pdf_url && dbMat?.resource_type === "pdf";
            const hasLink = !!dbMat?.external_url && dbMat?.resource_type === "link";
            const isUploading = uploading[m.id];
            const mode = modeByKey[m.id] || "pdf";

            // Status badge logic
            const hasContent = hasPdf || hasLink;
            const statusText = hasContent
              ? hasPdf
                ? "✅ PDF Aktif"
                : "✅ Link Aktif"
              : "⚠️ Belum ada";

            return (
              <div
                key={m.id}
                style={{
                  background: "white",
                  borderRadius: 18,
                  padding: 20,
                  border: `2px solid ${hasContent ? m.color : "#E6F5EC"}`,
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
                    background: hasContent ? "#D4F0E3" : "#FEF9E0",
                    color: hasContent ? "#166534" : "#854D0E",
                    padding: "3px 10px",
                    borderRadius: 20,
                    fontSize: 10,
                    fontWeight: 700,
                    fontFamily: "Nunito",
                  }}
                >
                  {statusText}
                </div>

                <div style={{ fontSize: 36, marginBottom: 12 }}>{m.emoji}</div>
                <div
                  style={{
                    fontFamily: "Nunito",
                    fontWeight: 800,
                    fontSize: 15,
                    color: "#1a2e22",
                    marginBottom: 6,
                    paddingRight: 110,
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

                {/* Info konten aktif */}
                {hasContent && (
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
                    {hasPdf ? (
                      <>
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
                      </>
                    ) : (
                      <>
                        🔗 <strong>Link aktif</strong>
                        <div
                          style={{
                            marginTop: 4,
                            fontSize: 10,
                            color: "#4A7060",
                            wordBreak: "break-all",
                            background: "white",
                            padding: "6px 8px",
                            borderRadius: 8,
                            lineHeight: 1.4,
                            maxHeight: 60,
                            overflow: "hidden",
                          }}
                        >
                          {dbMat.external_url}
                        </div>
                        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                          <a
                            href={dbMat.external_url}
                            target="_blank"
                            rel="noreferrer"
                            style={{
                              padding: "4px 10px",
                              borderRadius: 8,
                              background: "white",
                              color: "#3B8FD4",
                              fontSize: 11,
                              fontWeight: 700,
                              textDecoration: "none",
                              fontFamily: "Nunito",
                            }}
                          >
                            🔗 Cek Link
                          </a>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* ── Toggle Mode ───────────────────────────── */}
                <div
                  style={{
                    display: "flex",
                    background: "#F0FAF4",
                    borderRadius: 10,
                    padding: 3,
                    marginBottom: 12,
                  }}
                >
                  {[
                    { id: "pdf", label: "📄 PDF" },
                    { id: "link", label: "🔗 Link" },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() =>
                        setModeByKey((p) => ({ ...p, [m.id]: opt.id }))
                      }
                      disabled={isUploading}
                      style={{
                        flex: 1,
                        padding: "6px 0",
                        borderRadius: 8,
                        border: "none",
                        cursor: isUploading ? "wait" : "pointer",
                        fontFamily: "Nunito",
                        fontWeight: 700,
                        fontSize: 12,
                        background: mode === opt.id ? m.color : "transparent",
                        color: mode === opt.id ? "white" : "#6B9E80",
                        transition: "all 0.18s",
                      }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>

                {/* ── Mode PDF: Upload file ─────────────────── */}
                {mode === "pdf" && (
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
                        if (file) handleUploadPdf(m.id, file);
                        e.target.value = "";
                      }}
                      disabled={isUploading}
                    />
                  </label>
                )}

                {/* ── Mode Link: Input URL ──────────────────── */}
                {mode === "link" && (
                  <div>
                    <input
                      className="field-input"
                      type="url"
                      placeholder="https://drive.google.com/..."
                      value={linkInput[m.id] || ""}
                      onChange={(e) =>
                        setLinkInput((p) => ({ ...p, [m.id]: e.target.value }))
                      }
                      disabled={isUploading}
                      style={{ fontSize: 13, marginBottom: 8 }}
                    />
                    <button
                      onClick={() => handleSaveLink(m.id)}
                      disabled={isUploading || !(linkInput[m.id] || "").trim()}
                      style={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: 12,
                        border: "none",
                        background:
                          isUploading || !(linkInput[m.id] || "").trim()
                            ? "#E5E7EB"
                            : m.color,
                        color:
                          isUploading || !(linkInput[m.id] || "").trim()
                            ? "#9CA3AF"
                            : "white",
                        cursor:
                          isUploading || !(linkInput[m.id] || "").trim()
                            ? "not-allowed"
                            : "pointer",
                        fontFamily: "Nunito",
                        fontWeight: 700,
                        fontSize: 13,
                        transition: "all 0.18s",
                      }}
                    >
                      {isUploading ? "⏳ Menyimpan..." : "💾 Simpan Link"}
                    </button>
                    <div
                      style={{
                        marginTop: 6,
                        fontSize: 10,
                        color: "#9CA3AF",
                        lineHeight: 1.5,
                      }}
                    >
                      💡 Contoh: Google Drive, YouTube, Blogger, atau website lain
                    </div>
                  </div>
                )}
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