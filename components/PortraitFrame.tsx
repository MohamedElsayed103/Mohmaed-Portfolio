import Image from "next/image";
import { TechIcon } from "./TechIcon";
import { profile } from "@/data/content";

/* Satellites sit half-outside the portrait so they read as attached to
   it rather than floating loose. Percentage offsets keep them in place
   as the frame scales from 272px on a phone to 320px on desktop. */
const SATELLITES: {
  name: string;
  style: React.CSSProperties;
  dur: number;
  delay: number;
}[] = [
  { name: "Java", style: { top: "3%", left: "-10%" }, dur: 5.5, delay: 0 },
  { name: "Spring Boot", style: { top: "23%", right: "-11%" }, dur: 6.4, delay: 0.7 },
  { name: "Python", style: { top: "55%", left: "-12%" }, dur: 5.9, delay: 1.3 },
  { name: "Django", style: { top: "75%", right: "-10%" }, dur: 6.8, delay: 0.4 },
  { name: "Docker", style: { bottom: "-6%", left: "28%" }, dur: 6.1, delay: 1 },
];

export function PortraitFrame() {
  return (
    <div className="relative mx-auto w-[min(16rem,66vw)] lg:mx-0 lg:w-[19rem]">
      {/* Depth behind the frame — one soft pool of the brand colour */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-12 rounded-full opacity-55 blur-3xl"
        style={{
          background:
            "radial-gradient(circle at 50% 38%, var(--color-signal-deep), transparent 68%)",
        }}
      />

      {/* Offset frame with viewfinder ticks, echoing the schematic's
          line weight rather than decorating for its own sake */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-3.5 rounded-[1.125rem] border border-line-soft"
      >
        <span className="absolute -top-px -left-px h-4 w-4 rounded-tl-[1.125rem] border-t-2 border-l-2 border-signal" />
        <span className="absolute -top-px -right-px h-4 w-4 rounded-tr-[1.125rem] border-t-2 border-r-2 border-signal" />
        <span className="absolute -bottom-px -left-px h-4 w-4 rounded-bl-[1.125rem] border-b-2 border-l-2 border-signal" />
        <span className="absolute -right-px -bottom-px h-4 w-4 rounded-br-[1.125rem] border-r-2 border-b-2 border-signal" />
      </div>

      <div className="relative">
        <Image
          src={profile.avatar}
          alt={`${profile.name}, ${profile.role}, in Cairo`}
          width={profile.avatarWidth}
          height={profile.avatarHeight}
          sizes="(max-width: 1024px) 66vw, 304px"
          priority
          className="relative aspect-[4/5] w-full rounded-card border border-line object-cover"
        />

        {SATELLITES.map((s) => (
          <div key={s.name} className="absolute" style={s.style}>
            <div
              className="satellite group flex h-10 w-10 items-center justify-center rounded-card border border-line bg-bg-raised shadow-[0_2px_8px_rgba(0,0,0,0.55)] transition-colors duration-300 hover:border-signal lg:h-11 lg:w-11"
              style={{ animationDuration: `${s.dur}s`, animationDelay: `${s.delay}s` }}
              title={s.name}
            >
              <TechIcon
                name={s.name}
                size={20}
                className="h-[17px] w-[17px] text-ink transition-colors duration-300 group-hover:text-signal lg:h-5 lg:w-5"
              />
              <span className="sr-only">{s.name}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
