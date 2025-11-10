import React, { useMemo } from "react";
import { CENTER } from "../lib/constants";
import { splitWordsToMasks } from "../lib/textUtils";

export default function Featured({ index }) {
  const text = CENTER[index];
  const words = useMemo(() => splitWordsToMasks(text), [text]);

  return (
    <div id="featured" className="w-[20%] h-[10vh] relative overflow-hidden flex items-center justify-center text-center text-[1.5vw] transition-[filter,opacity] duration-500 will-change-[filter,opacity]">
      <h3 className="absolute inset-0 m-0 font-medium text-[rgba(245,245,245,0.9)] flex items-center justify-center">
        {words.map(({ word, key }) => (
          <span key={key} className="inline-block overflow-hidden align-middle">
            <span className="inline-block align-middle featured-word">{word}</span>
          </span>
        ))}
      </h3>
    </div>
  );
}
