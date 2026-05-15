import React from "react";

export function renderMathText(text) {
  if (!text) return text;

  // kalau fraction (1/2)
  if (text.includes("/")) {
    const [num, den] = text.split("/");

    return (
      <span className="inline-flex flex-col items-center leading-none mx-1">
        <span className="text-sm">{num}</span>
        <span className="border-t border-black w-4"></span>
        <span className="text-sm">{den}</span>
      </span>
    );
  }

  return <span>{text}</span>;
}
