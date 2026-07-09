import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { toPng } from "html-to-image";
import IDCard, { type CardData } from "@/components/IDCard";
import { getCard, getEditingId, newId, setEditingId, upsertCard } from "@/lib/saved-cards";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Dragon Atlete ID Card Maker" },
      {
        name: "description",
        content: "Buat kartu ID pemain basket bergaya neon dan unduh sebagai PNG 1024x1536.",
      },
    ],
  }),
});

const defaultData: CardData = {
  logo: null,
  teamName: "DRAGON BASKETBALL ACADEMY",
  tagline: "TRAIN. DEVELOP. DOMINATE.",
  photo: null,
  playerName: "KIARA ARSYVANIA ARRASYD",
  age: "10 TAHUN",
  quote: "Disiplin hari ini, Juara esok hari.",
  stats: [
    { label: "POINTS", value: "128", icon: "🏀" },
    { label: "ASSISTS", value: "45", icon: "🎯" },
    { label: "STEALS", value: "32", icon: "👟" },
    { label: "GAMES", value: "24", icon: "★" },
  ],
  highlightPhoto: null,
  highlights: ["Fast Handles", "Sharp Focus", "Fearless Heart"],
  skills: [
    { label: "Ball Handling", value: 90 },
    { label: "Shooting", value: 85 },
    { label: "Speed", value: 88 },
    { label: "Court Vision", value: 82 },
    { label: "Defense", value: 86 },
  ],
  footerText: "One Team. One Dream. We Are Dragons.",
  hashtag: "#Play With Heart",
  actionPhoto: null,
};

function resizeImage(file: File, maxWidth = 600, maxHeight = 600, quality = 0.7, removeBlack = false): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        
        if (removeBlack) {
          try {
            const imageData = ctx.getImageData(0, 0, width, height);
            const data = imageData.data;
            for (let i = 0; i < data.length; i += 4) {
              const r = data[i];
              const g = data[i + 1];
              const b = data[i + 2];
              // If it's a very dark pixel (near black), make it fully transparent
              if (r < 20 && g < 20 && b < 20) {
                data[i + 3] = 0;
              } else if (r < 40 && g < 40 && b < 40) {
                 // Soft blend for anti-aliased dark edges
                data[i + 3] = Math.floor((r / 40) * 255);
              }
            }
            ctx.putImageData(imageData, 0, 0);
            resolve(canvas.toDataURL("image/png"));
          } catch (err) {
            console.error("Canvas error removing black", err);
            resolve(canvas.toDataURL("image/jpeg", quality));
          }
        } else {
          resolve(canvas.toDataURL("image/jpeg", quality));
        }
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function Index() {
  const [data, setData] = useState<CardData>(defaultData);
  const [busy, setBusy] = useState(false);
  const [editingId, setEditingIdState] = useState<string | null>(null);
  const [savedFlash, setSavedFlash] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Load card in edit mode if a saved id was flagged
  useEffect(() => {
    const id = getEditingId();
    if (id) {
      getCard(id).then((found) => {
        if (found) {
          setData(found.data);
          setEditingIdState(id);
        }
      });
      setEditingId(null);
    }
  }, []);

  const handleSave = async () => {
    const id = editingId ?? newId();
    let createdAt = Date.now();
    let updatedAt = createdAt;
    if (editingId) {
      const existing = await getCard(id);
      if (existing) {
        createdAt = existing.createdAt;
        updatedAt = Date.now();
      }
    }
    await upsertCard({ id, data, updatedAt, createdAt });
    setEditingIdState(id);
    setSavedFlash(true);
    navigate({ to: "/athletes" });
  };

  const set = <K extends keyof CardData>(k: K, v: CardData[K]) =>
    setData((d) => ({ ...d, [k]: v }));

  const uploadTo =
    (k: "logo" | "photo" | "highlightPhoto" | "actionPhoto") =>
    async (e: ChangeEvent<HTMLInputElement>) => {
      const f = e.target.files?.[0];
      if (!f) return;
      set(k, await resizeImage(f, 600, 600, 0.7, k === "logo"));
    };

  const download = async () => {
    if (!cardRef.current) return;
    setBusy(true);
    try {
      const dataUrl = await toPng(cardRef.current, {
        width: 1024,
        height: 1536,
        pixelRatio: 1,
        cacheBust: true,
        backgroundColor: "#0a0410",
      });
      const a = document.createElement("a");
      a.download = `${(data.playerName || "id-card").toLowerCase().replace(/\s+/g, "-")}.png`;
      a.href = dataUrl;
      a.click();
    } catch (err) {
      console.error(err);
      alert("Gagal export. Coba lagi.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen pb-24">
      <header className="sticky top-0 z-20 backdrop-blur-md bg-bg/80 border-b border-border">
        <div className="px-4 py-3 max-w-md mx-auto flex items-center justify-between gap-3">
          <div>
            <h1 className="font-display text-3xl tracking-wide text-neon-orange leading-none">
              DRAGON ID
            </h1>
            <p className="text-xs text-muted-ink font-heading tracking-widest">
              {editingId ? "MENGEDIT KARTU" : "CARD MAKER · 1024×1536"}
            </p>
          </div>
          <Link
            to="/athletes"
            className="text-xs font-heading tracking-widest text-neon-purple border border-border rounded-lg px-3 py-2"
          >
            ATLET
          </Link>
        </div>
      </header>

      <main className="px-4 py-5 max-w-md mx-auto space-y-6">
        {/* Preview */}
        <section>
          <SectionLabel>Preview</SectionLabel>
          <div className="rounded-2xl overflow-hidden border border-border neon-purple-glow bg-panel">
            <div className="overflow-hidden">
              {/* Scaled preview */}
              <div style={{ width: "100%", aspectRatio: "1024 / 1536", position: "relative" }}>
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    transformOrigin: "top left",
                    transform: "scale(var(--s))",
                    width: 1024,
                    height: 1536,
                    // dynamic scale via CSS var set below
                  }}
                  ref={(el) => {
                    if (!el) return;
                    const parent = el.parentElement!;
                    const setScale = () => {
                      const s = parent.clientWidth / 1024;
                      el.style.setProperty("--s", s.toString());
                    };
                    setScale();
                    const ro = new ResizeObserver(setScale);
                    ro.observe(parent);
                  }}
                >
                  <IDCard ref={cardRef} data={data} />
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <button
              onClick={handleSave}
              className="py-4 rounded-xl font-display text-xl tracking-widest text-white neon-purple-glow"
              style={{ background: "linear-gradient(135deg,#8b5cf6,#c026d3)" }}
            >
              {savedFlash ? "✓ TERSIMPAN" : editingId ? "💾 UPDATE" : "💾 SAVE"}
            </button>
            <button
              onClick={download}
              disabled={busy}
              className="py-4 rounded-xl font-display text-xl tracking-widest text-white neon-orange-glow disabled:opacity-60"
              style={{ background: "linear-gradient(135deg,#ff9640,#ff5b8a)" }}
            >
              {busy ? "..." : "⬇ PNG"}
            </button>
          </div>
        </section>

        {/* Form */}
        <section className="space-y-5">
          <SectionLabel>Media</SectionLabel>
          <FileField
            label="Logo Tim"
            onChange={uploadTo("logo")}
            preview={data.logo}
            onClear={() => set("logo", null)}
          />
          <FileField
            label="Foto Aksi (background kiri)"
            onChange={uploadTo("actionPhoto")}
            preview={data.actionPhoto}
            onClear={() => set("actionPhoto", null)}
          />
          <FileField
            label="Foto Profil Pemain"
            onChange={uploadTo("photo")}
            preview={data.photo}
            onClear={() => set("photo", null)}
          />
          <FileField
            label="Foto Highlight"
            onChange={uploadTo("highlightPhoto")}
            preview={data.highlightPhoto}
            onClear={() => set("highlightPhoto", null)}
          />

          <SectionLabel>Identitas Tim</SectionLabel>
          <TextField label="Nama Tim" value={data.teamName} onChange={(v) => set("teamName", v)} />
          <TextField label="Tagline" value={data.tagline} onChange={(v) => set("tagline", v)} />

          <SectionLabel>Data Pemain</SectionLabel>
          <TextField
            label="Nama Pemain"
            value={data.playerName}
            onChange={(v) => set("playerName", v)}
          />
          <TextField
            label="Usia"
            value={data.age}
            onChange={(v) => set("age", v)}
            placeholder="cth: 10 TAHUN"
          />
          <TextArea label="Quote / Motto" value={data.quote} onChange={(v) => set("quote", v)} />

          <SectionLabel>Player Stats</SectionLabel>
          {data.stats.map((s, i) => (
            <div key={i} className="grid grid-cols-[60px_1fr_90px] gap-2 items-end">
              <TextField
                label="Icon"
                value={s.icon}
                onChange={(v) =>
                  set(
                    "stats",
                    data.stats.map((x, j) => (j === i ? { ...x, icon: v } : x)),
                  )
                }
              />
              <TextField
                label="Label"
                value={s.label}
                onChange={(v) =>
                  set(
                    "stats",
                    data.stats.map((x, j) => (j === i ? { ...x, label: v } : x)),
                  )
                }
              />
              <TextField
                label="Nilai"
                value={s.value}
                onChange={(v) =>
                  set(
                    "stats",
                    data.stats.map((x, j) => (j === i ? { ...x, value: v } : x)),
                  )
                }
              />
            </div>
          ))}

          <SectionLabel>Highlights</SectionLabel>
          {data.highlights.map((h, i) => (
            <TextField
              key={i}
              label={`Highlight ${i + 1}`}
              value={h}
              onChange={(v) =>
                set(
                  "highlights",
                  data.highlights.map((x, j) => (j === i ? v : x)),
                )
              }
            />
          ))}

          <SectionLabel>Skills & Attributes</SectionLabel>
          {data.skills.map((s, i) => (
            <div key={i} className="space-y-1">
              <div className="flex justify-between text-xs text-muted-ink font-heading tracking-widest">
                <span>{s.label.toUpperCase()}</span>
                <span className="text-neon-orange">{s.value}</span>
              </div>
              <div className="grid grid-cols-[1fr_80px] gap-2">
                <TextField
                  label=""
                  value={s.label}
                  onChange={(v) =>
                    set(
                      "skills",
                      data.skills.map((x, j) => (j === i ? { ...x, label: v } : x)),
                    )
                  }
                />
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={s.value}
                  onChange={(e) =>
                    set(
                      "skills",
                      data.skills.map((x, j) =>
                        j === i ? { ...x, value: Number(e.target.value) } : x,
                      ),
                    )
                  }
                  className="px-3 py-2.5 rounded-lg bg-input border border-border text-ink"
                />
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={s.value}
                onChange={(e) =>
                  set(
                    "skills",
                    data.skills.map((x, j) =>
                      j === i ? { ...x, value: Number(e.target.value) } : x,
                    ),
                  )
                }
                className="w-full accent-primary"
              />
            </div>
          ))}

          <SectionLabel>Footer</SectionLabel>
          <TextField
            label="Teks Footer"
            value={data.footerText}
            onChange={(v) => set("footerText", v)}
          />
          <TextField label="Hashtag" value={data.hashtag} onChange={(v) => set("hashtag", v)} />
        </section>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleSave}
            className="py-4 rounded-xl font-display text-xl tracking-widest text-white neon-purple-glow"
            style={{ background: "linear-gradient(135deg,#8b5cf6,#c026d3)" }}
          >
            {savedFlash ? "✓ TERSIMPAN" : editingId ? "💾 UPDATE" : "💾 SAVE"}
          </button>
          <button
            onClick={download}
            disabled={busy}
            className="py-4 rounded-xl font-display text-xl tracking-widest text-white neon-orange-glow disabled:opacity-60"
            style={{ background: "linear-gradient(135deg,#ff9640,#ff5b8a)" }}
          >
            {busy ? "..." : "⬇ PNG"}
          </button>
        </div>
      </main>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 pt-2">
      <div className="h-px flex-1 bg-border" />
      <h2 className="font-heading font-semibold tracking-[0.25em] text-xs text-neon-purple">
        {String(children).toUpperCase()}
      </h2>
      <div className="h-px flex-1 bg-border" />
    </div>
  );
}

function TextField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      {label && (
        <span className="block text-xs font-heading tracking-widest text-muted-ink mb-1">
          {label.toUpperCase()}
        </span>
      )}
      <input
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2.5 rounded-lg bg-input border border-border text-ink placeholder:text-muted-ink/60 focus:outline-none focus:ring-2 focus:ring-primary/60"
      />
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="block text-xs font-heading tracking-widest text-muted-ink mb-1">
        {label.toUpperCase()}
      </span>
      <textarea
        value={value}
        rows={2}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2.5 rounded-lg bg-input border border-border text-ink placeholder:text-muted-ink/60 focus:outline-none focus:ring-2 focus:ring-primary/60 resize-none"
      />
    </label>
  );
}

function FileField({
  label,
  onChange,
  preview,
  onClear,
}: {
  label: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  preview: string | null;
  onClear: () => void;
}) {
  return (
    <div>
      <span className="block text-xs font-heading tracking-widest text-muted-ink mb-1">
        {label.toUpperCase()}
      </span>
      <div className="flex items-center gap-3">
        <div className="w-16 h-16 rounded-lg bg-input border border-border overflow-hidden flex items-center justify-center text-muted-ink text-xs">
          {preview ? <img src={preview} alt="" className="w-full h-full object-cover" /> : "—"}
        </div>
        <label className="flex-1 cursor-pointer">
          <div className="w-full py-2.5 px-3 rounded-lg border border-dashed border-primary/60 text-center text-sm text-neon-purple font-heading tracking-widest">
            {preview ? "GANTI FILE" : "UPLOAD"}
          </div>
          <input type="file" accept="image/*" className="hidden" onChange={onChange} />
        </label>
        {preview && (
          <button
            onClick={onClear}
            className="px-3 py-2 text-xs rounded-lg border border-border text-muted-ink"
          >
            Hapus
          </button>
        )}
      </div>
    </div>
  );
}
