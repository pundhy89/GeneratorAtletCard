import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import IDCard from "@/components/IDCard";
import {
  loadCards,
  deleteCard as removeCard,
  setEditingId,
  type SavedCard,
} from "@/lib/saved-cards";
import { toPng } from "html-to-image";

export const Route = createFileRoute("/saved")({
  component: SavedPage,
  head: () => ({
    meta: [
      { title: "Saved ID Cards — Dragon ID" },
      { name: "description", content: "Semua ID card yang sudah kamu simpan." },
    ],
  }),
});

function SavedPage() {
  const [cards, setCards] = useState<SavedCard[]>([]);
  const navigate = useNavigate();

  const refresh = useCallback(() => {
    loadCards().then(setCards);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const handleEdit = (id: string) => {
    setEditingId(id);
    navigate({ to: "/" });
  };

  const handleAdd = () => {
    setEditingId(null);
    navigate({ to: "/" });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus kartu ini?")) return;
    await removeCard(id);
    refresh();
  };

  return (
    <div className="min-h-screen pb-32">
      <header className="sticky top-0 z-20 backdrop-blur-md bg-bg/80 border-b border-border">
        <div className="px-4 py-3 max-w-md mx-auto flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl tracking-wide text-neon-orange leading-none">
              SAVED
            </h1>
            <p className="text-xs text-muted-ink font-heading tracking-widest">KOLEKSI ID CARD</p>
          </div>
          <Link
            to="/"
            className="text-xs font-heading tracking-widest text-neon-purple border border-border rounded-lg px-3 py-2"
          >
            ← HOME
          </Link>
        </div>
      </header>

      <main className="px-4 py-5 max-w-md mx-auto space-y-4">
        {cards.length === 0 && (
          <div className="text-center py-16 text-muted-ink">
            <p className="font-heading tracking-widest text-sm">BELUM ADA KARTU DISIMPAN</p>
            <p className="text-xs mt-2 opacity-70">Buat kartu baru, lalu tekan tombol SAVE.</p>
          </div>
        )}

        {cards.map((c) => (
          <CardRow
            key={c.id}
            card={c}
            onEdit={() => handleEdit(c.id)}
            onDelete={() => handleDelete(c.id)}
          />
        ))}
      </main>

      <button
        onClick={handleAdd}
        className="fixed bottom-6 right-1/2 translate-x-1/2 max-w-md w-[calc(100%-2rem)] py-4 rounded-xl font-display text-2xl tracking-widest text-white neon-orange-glow"
        style={{ background: "linear-gradient(135deg,#ff9640,#ff5b8a)" }}
      >
        ＋ TAMBAH KARTU
      </button>
    </div>
  );
}

function CardRow({
  card,
  onEdit,
  onDelete,
}: {
  card: SavedCard;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  const download = async () => {
    if (!cardRef.current) return;
    try {
      const dataUrl = await toPng(cardRef.current, {
        width: 1024,
        height: 1536,
        pixelRatio: 1,
        cacheBust: true,
        backgroundColor: "#0a0410",
      });
      const a = document.createElement("a");
      a.download = `${(card.data.playerName || "id-card").toLowerCase().replace(/\s+/g, "-")}.png`;
      a.href = dataUrl;
      a.click();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-panel overflow-hidden neon-purple-glow">
      <div className="p-3">
        <div className="text-xs font-heading tracking-widest text-muted-ink flex justify-between items-center mb-2">
          <span className="text-neon-purple truncate max-w-[60%]">
            {card.data.playerName || "TANPA NAMA"}
          </span>
          <span>{new Date(card.updatedAt).toLocaleDateString()}</span>
        </div>

        {/* Full thumbnail (scaled) */}
        <div className="rounded-xl overflow-hidden bg-black">
          <div style={{ width: "100%", aspectRatio: "1024 / 1536", position: "relative" }}>
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                transformOrigin: "top left",
                width: 1024,
                height: 1536,
              }}
              ref={(el) => {
                if (!el) return;
                const parent = el.parentElement!;
                const apply = () => {
                  const s = parent.clientWidth / 1024;
                  el.style.transform = `scale(${s})`;
                };
                apply();
                const ro = new ResizeObserver(apply);
                ro.observe(parent);
              }}
            >
              <IDCard ref={cardRef} data={card.data} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 border-t border-border">
        <button
          onClick={onEdit}
          className="py-3 text-sm font-heading tracking-widest text-neon-purple hover:bg-input"
        >
          ✎ EDIT
        </button>
        <button
          onClick={download}
          className="py-3 text-sm font-heading tracking-widest text-neon-orange border-x border-border hover:bg-input"
        >
          ⬇ PNG
        </button>
        <button
          onClick={onDelete}
          className="py-3 text-sm font-heading tracking-widest text-red-400 hover:bg-input"
        >
          🗑 HAPUS
        </button>
      </div>
    </div>
  );
}
