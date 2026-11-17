"use client";

import { useEffect, useRef } from "react";
import { whileVisible } from "@/lib/motion";
import styles from "./contact.module.css";

/** A status lamp. Pulses only while on screen and the tab is visible; static under reduced motion. */
export function Lamp({ color = "var(--s-signal)" }: { color?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    return whileVisible(el, (on) => {
      if (el) el.dataset.live = String(on);
    });
  }, []);
  return (
    <span
      ref={ref}
      aria-hidden="true"
      className={styles.lamp}
      style={{ "--lamp": color } as React.CSSProperties}
    />
  );
}
