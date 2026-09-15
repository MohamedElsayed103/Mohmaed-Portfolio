type IconProps = { className?: string; size?: number };

const base = (size: number) => ({
  width: size,
  height: size,
  viewBox: "0 0 16 16",
  fill: "none" as const,
  "aria-hidden": true,
  focusable: "false" as const,
});

export function ArrowDown({ className, size = 14 }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path
        d="M8 3v10M4 9.5 8 13.5l4-4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ArrowRight({ className, size = 14 }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path
        d="M3 8h10M9.5 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ArrowUpRight({ className, size = 13 }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path
        d="M5 11 11 5M5.5 5H11v5.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function GitHub({ className, size = 15 }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path
        d="M8 .5a7.5 7.5 0 0 0-2.37 14.62c.37.07.51-.16.51-.36l-.01-1.26c-2.09.45-2.53-1-2.53-1-.34-.87-.83-1.1-.83-1.1-.68-.47.05-.46.05-.46.75.05 1.15.78 1.15.78.67 1.15 1.76.82 2.19.63.07-.49.26-.82.48-1.01-1.67-.19-3.42-.84-3.42-3.72 0-.82.29-1.5.78-2.02-.08-.19-.34-.96.07-2 0 0 .63-.2 2.07.77a7.2 7.2 0 0 1 3.77 0c1.44-.97 2.07-.77 2.07-.77.41 1.04.15 1.81.07 2 .49.52.78 1.2.78 2.02 0 2.89-1.76 3.53-3.43 3.71.27.23.51.69.51 1.4l-.01 2.07c0 .2.14.44.52.36A7.5 7.5 0 0 0 8 .5Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function LinkedIn({ className, size = 15 }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path
        d="M3.4 5.6H1V15h2.4V5.6ZM2.2 1a1.4 1.4 0 1 0 0 2.8 1.4 1.4 0 0 0 0-2.8ZM15 9.6c0-2.6-1.4-3.8-3.2-3.8-1.5 0-2.2.82-2.55 1.4V5.6H6.9c.03.68 0 9.4 0 9.4h2.35V9.75c0-.21.02-.42.08-.57.16-.42.55-.86 1.2-.86.85 0 1.19.65 1.19 1.6V15H15V9.6Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function Mail({ className, size = 15 }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <rect x="1.25" y="3.25" width="13.5" height="9.5" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="m2 4.75 5.19 3.67c.49.34 1.13.34 1.62 0L14 4.75"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Phone({ className, size = 15 }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path
        d="M5.3 1.8 6.6 4.5c.14.3.08.66-.16.89l-1.1 1.05a9.6 9.6 0 0 0 4.22 4.22l1.05-1.1c.23-.24.59-.3.89-.16l2.7 1.3c.31.15.49.49.43.83l-.35 1.94a1 1 0 0 1-1.1.81C6.97 13.7 2.3 9.03 1.72 2.82a1 1 0 0 1 .81-1.1l1.94-.35c.34-.06.68.12.83.43Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Copy({ className, size = 14 }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <rect x="5.25" y="5.25" width="9" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M11 3.5v-.25A1.5 1.5 0 0 0 9.5 1.75h-6.25A1.5 1.5 0 0 0 1.75 3.25V9.5A1.5 1.5 0 0 0 3.25 11h.25"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Check({ className, size = 14 }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path
        d="m3 8.5 3.2 3.2L13 5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function MapPin({ className, size = 15 }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path
        d="M13 6.83C13 10.2 8 15 8 15S3 10.2 3 6.83a5 5 0 0 1 10 0Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <circle cx="8" cy="6.75" r="1.75" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}
