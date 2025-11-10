import React from "react";

export default function LoadingOverlay({ progress }) {
  return (
    <div id="loading-overlay" className="fixed inset-0 z-[9999] bg-white text-black uppercase tracking-[-0.02em] flex items-center justify-center text-[1.5rem]">
      Loading <span id="loading-counter" className="ml-2">[{String(progress).padStart(2, "0")}]</span>
    </div>
  );
}
