import React from "react";
import { IMAGES } from "../lib/constants";

export default function Backgrounds({ activeIndex, prevIndex }) {
  return (
    <div
      id="background-container"
      className="absolute inset-0 -z-0 overflow-hidden bg-black"
    >
      {IMAGES.map((src, i) => (
        <img
          key={i}
          src={src}
          alt={`Background ${i + 1}`}
          className={[
            "absolute left-0 w-full object-cover",
            "top-[-10%] h-[120%]",
            "opacity-0",
            "brightness-[.8] will-change-transform", // << add: exact look match
            i === activeIndex
              ? "opacity-100 z-20"
              : i === prevIndex
              ? "opacity-100 z-10"
              : "",
          ].join(" ")}
        />
      ))}
    </div>
  );
}
