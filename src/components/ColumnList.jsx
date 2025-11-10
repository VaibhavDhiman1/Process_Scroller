import React from "react";

export default function ColumnList({ items, active, onClick, side, onHover }) {
  return (
    <div
      id={`${side}-column`}
      className={[
        side === "left" ? "text-left" : "text-right",
        "flex flex-col gap-[0.25rem] w-[40%] select-none",
        "transition-[filter,opacity] duration-500 will-change-[filter,opacity]",
        "text-[rgba(245,245,245,0.9)]",
      ].join(" ")}
    >
      {items.map((label, i) => (
        <button
          key={label}
          data-index={i}
          onClick={() => onClick(i)}
          onMouseEnter={() => onHover && onHover(i)}   // <- play hover sound only
          className={[
            "text-left",
            // base (loaded state lands you at 0.3 like original)
            "opacity-30 translate-y-5",
            // make hovered item look 'focused' like original CSS :hover
            "hover:opacity-100 focus-visible:opacity-100",
            "transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
            // active state = fully focused + nudge + dot (unchanged)
            i === active
              ? (side === "left"
                  ? "opacity-100 translate-x-[10px] pl-[15px]"
                  : "opacity-100 -translate-x-[10px] pr-[15px]")
              : "",
            "cursor-pointer relative",
          ].join(" ")}
        >
          {side === "left" && i === active && (
            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-[rgba(245,245,245,0.9)]" />
          )}
          <span className={side === "right" ? "block text-right" : "block"}>{label}</span>
          {side === "right" && i === active && (
            <span className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-[rgba(245,245,245,0.9)]" />
          )}
        </button>
      ))}
    </div>
  );
}
