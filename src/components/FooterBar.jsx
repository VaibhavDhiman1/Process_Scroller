import React from "react";

export default function FooterBar({ current, total = 10 }) {
  return (
    <div id="footer" className="col-span-12 self-end pb-[5vh] text-center text-[10vw] leading-[0.8] text-[rgba(245,245,245,0.9)] transition-[filter,opacity] duration-500">
      <div className="block">Beyond</div>
      <div className="block">Thinking</div>
      <div className="w-40 h-px mx-auto mt-[2vh] relative bg-[rgba(245,245,245,0.3)]">
        <div id="progress-fill" className="absolute left-0 top-0 h-full w-0 bg-[rgba(245,245,245,0.9)]" />
        <div className="absolute inset-x-0 -translate-y-1/2 flex justify-between text-[0.7rem] font-normal text-[rgba(245,245,245,0.9)] mx-[-25px]">
          <span id="current-section">{String(current + 1).padStart(2, "0")}</span>
          <span id="total-sections">{String(total)}</span>
        </div>
      </div>
    </div>
  );
}
