"use client";

import { useEffect } from "react";
import { initSmoothScroll } from "@/lib/motion";

export function SmoothScroll() {
  useEffect(() => {
    initSmoothScroll();
  }, []);
  return null;
}
