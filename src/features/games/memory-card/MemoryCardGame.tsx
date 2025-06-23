"use client";
import { useEffect, useState } from "react";

interface Card {
  id: number;
  symbol: string;
  flipped: boolean;
  matched: boolean;
}

const SYMBOLS = [
  "🎂",
  "🎉",
  "🎁",
  "🎈",
  "🧁",
  "🍰",
  "🥳",
  "🎊",
];

function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function MemoryCardGame() {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState(0);

  // Initialize game
  useEffect(() => {
    const doubled = SYMBOLS.flatMap((s, idx) => [
      { id: idx * 2, symbol: s, flipped: false, matched: false },
      { id: idx * 2 + 1, symbol: s, flipped: false, matched: false },
    ]);
    setCards(shuffle(doubled));
  }, []);

  // Handle card click
  function handleFlip(index: number) {
    if (cards[index].flipped || cards[index].matched) return;
    if (flippedIndices.length === 2) return;

    const newCards = [...cards];
    newCards[index] = { ...newCards[index], flipped: true };
    setCards(newCards);
    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      const [i1, i2] = newFlipped;
      if (newCards[i1].symbol === newCards[i2].symbol) {
        // match
        setTimeout(() => {
          setCards((prev) => {
            const updated = [...prev];
            updated[i1] = { ...updated[i1], matched: true };
            updated[i2] = { ...updated[i2], matched: true };
            return updated;
          });
          setMatchedPairs((p) => p + 1);
          setFlippedIndices([]);
        }, 400);
      } else {
        // not match
        setTimeout(() => {
          setCards((prev) => {
            const updated = [...prev];
            updated[i1] = { ...updated[i1], flipped: false };
            updated[i2] = { ...updated[i2], flipped: false };
            return updated;
          });
          setFlippedIndices([]);
        }, 800);
      }
    }
  }

  // Restart game when all matched
  useEffect(() => {
    if (matchedPairs === SYMBOLS.length) {
      // delay alert to allow last card animation
      setTimeout(() => {
        alert("Chúc mừng! Bạn đã tìm hết các cặp!");
        // reset game
        const doubled = SYMBOLS.flatMap((s, idx) => [
          { id: idx * 2, symbol: s, flipped: false, matched: false },
          { id: idx * 2 + 1, symbol: s, flipped: false, matched: false },
        ]);
        setCards(shuffle(doubled));
        setMatchedPairs(0);
        setFlippedIndices([]);
      }, 300);
    }
  }, [matchedPairs]);

  return (
    <div className="flex flex-col items-center gap-4 select-none">
      <h2 className="text-xl font-semibold">Memory Card Game</h2>
      <div
        className="grid gap-2"
        style={{ gridTemplateColumns: "repeat(4, minmax(60px, 1fr))" }}
      >
        {cards.map((card, idx) => (
          <button
            key={card.id}
            className={`w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded cursor-pointer flex items-center justify-center text-3xl transition-all duration-300 border-2 border-b-4 border-r-4 border-b-neutral-400 border-r-neutral-400 shadow-sm ${
              card.flipped || card.matched ? "bg-amber-50" : "bg-amber-700"
            } ${card.matched ? "opacity-60" : ""}`}
            onClick={() => handleFlip(idx)}
          >
            {(card.flipped || card.matched) && card.symbol}
          </button>
        ))}
      </div>
      <p className="text-sm text-neutral-500">
        Đã ghép: {matchedPairs}/{SYMBOLS.length}
      </p>
    </div>
  );
}
