import type { CardData } from "@/components/IDCard";
import localforage from "localforage";

export interface SavedCard {
  id: string;
  data: CardData;
  updatedAt: number;
  createdAt: number;
}

const CARDS_STORE_KEY = "dragon-id-cards-store";

export async function loadCards(): Promise<SavedCard[]> {
  if (typeof window === "undefined") return [];
  try {
    const raw = await localforage.getItem<SavedCard[]>(CARDS_STORE_KEY);
    const arr = Array.isArray(raw) ? raw : [];
    return arr.sort((a, b) => b.updatedAt - a.updatedAt);
  } catch (error) {
    console.error("Error loading cards from localforage:", error);
    return [];
  }
}

export async function saveCards(cards: SavedCard[]) {
  try {
    await localforage.setItem(CARDS_STORE_KEY, cards);
  } catch (error) {
    console.error("Error saving cards to localforage:", error);
  }
}

export async function upsertCard(card: SavedCard) {
  const cards = await loadCards();
  const i = cards.findIndex((c) => c.id === card.id);
  if (i >= 0) {
    cards[i] = card;
  } else {
    cards.unshift(card);
  }
  await saveCards(cards);
}

export async function deleteCard(id: string) {
  const cards = await loadCards();
  await saveCards(cards.filter((c) => c.id !== id));
}

export async function getCard(id: string): Promise<SavedCard | undefined> {
  const cards = await loadCards();
  return cards.find((c) => c.id === id);
}

export function newId() {
  return `card_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

// Draft (for edit hand-off between routes without URL bloat)
const DRAFT_KEY = "dragon-id-editing-id";
export function setEditingId(id: string | null) {
  if (id) localStorage.setItem(DRAFT_KEY, id);
  else localStorage.removeItem(DRAFT_KEY);
}
export function getEditingId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(DRAFT_KEY);
}
