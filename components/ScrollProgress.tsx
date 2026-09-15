"use client";

import { motion, useScroll, useSpring } from "motion/react";

/**
 * Hairline reading-progress bar along the bottom edge of the nav.
 * Scales from the left on a single transform, so it never triggers layout.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const width = useSpring(scrollYProgress, {
    stiffness: 260,
    damping: 40,
    restDelta: 0.0005,
  });

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX: width }}
      className="absolute inset-x-0 bottom-0 h-px origin-left bg-signal"
    />
  );
}
