import React from "react";

export default function SoundToggle({ enabled, onClick }) {
  return (
    <button
      aria-label="Toggle sound"
      onClick={onClick}
      className={[
        "fixed top-5 right-5 z-[1000] w-10 h-10 rounded-full",
        "backdrop-blur",
        "border transition duration-300",
        enabled
          ? "bg-white/10 border-white/20 hover:bg-white/15 hover:border-white/30"
          : "bg-white/5 border-white/10 hover:bg-white/10",
        "flex items-center justify-center",
      ].join(" ")}
    >
      <div className="relative w-1 h-1">
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className={[
              "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
              "block rounded-full bg-white",
              enabled ? "sound-dot-anim" : "opacity-30 w-1 h-1",
            ].join(" ")}
            style={{ animationDelay: enabled ? `${i * 0.5}s` : undefined }}
          />
        ))}
      </div>
    </button>
  );
}
