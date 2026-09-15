/**
 * Page-load curtain. Pure CSS with animation-fill-mode: forwards, so it
 * always clears itself — no JS required, and reduced motion hides it
 * outright. Rendering it server-side avoids a flash of content first.
 */
export function Curtain() {
  return <div className="curtain" aria-hidden="true" />;
}
