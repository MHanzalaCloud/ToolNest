'use client';

import { useState } from "react";

export default function BasicCalcPage() {
  const [display, setDisplay] = useState("0");

  const handleClick = (val: string) => {
    if (val === "C") {
      setDisplay("0");
    } else if (val === "=") {
      try {
        setDisplay(eval(display).toString());
      } catch {
        setDisplay("Error");
      }
    } else {
      setDisplay(display === "0" ? val : display + val);
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-white mb-6 text-center">Basic Calculator</h1>
      <div className="glass-card p-6 rounded-2xl space-y-4">
        <input
          type="text"
          readOnly
          value={display}
          className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-4 text-right text-3xl font-mono text-white"
        />
        <div className="grid grid-cols-4 gap-3">
          {["C", "/", "*", "-", "7", "8", "9", "+", "4", "5", "6", "=", "1", "2", "3", "0"].map((btn) => (
            <button
              key={btn}
              onClick={() => handleClick(btn)}
              className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-[#FF5500]/50 text-white font-bold text-lg"
            >
              {btn}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
