'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FlyingItem {
  id: number;
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
}

/**
 * Returns a `trigger(fromEl, toEl)` function you call on "Add to Cart" click.
 * Renders the flying dot animation; mount <>{portal}</> once near the root.
 */
export function useFlyToCart() {
  const [items, setItems] = useState<FlyingItem[]>([]);

  const trigger = useCallback((fromEl: HTMLElement, toEl: HTMLElement) => {
    const from = fromEl.getBoundingClientRect();
    const to = toEl.getBoundingClientRect();
    const id = Date.now();

    setItems((prev) => [
      ...prev,
      {
        id,
        fromX: from.left + from.width / 2,
        fromY: from.top + from.height / 2,
        toX: to.left + to.width / 2,
        toY: to.top + to.height / 2,
      },
    ]);

    setTimeout(() => {
      setItems((prev) => prev.filter((i) => i.id !== id));
    }, 700);
  }, []);

  const portal = (
    <AnimatePresence>
      {items.map((item) => (
        <motion.div
          key={item.id}
          className="pointer-events-none fixed z-[9999] h-3 w-3 rounded-full bg-brand-accent"
          initial={{ x: item.fromX, y: item.fromY, opacity: 1, scale: 1 }}
          animate={{ x: item.toX, y: item.toY, opacity: 0.3, scale: 0.4 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        />
      ))}
    </AnimatePresence>
  );

  return { trigger, portal };
}
