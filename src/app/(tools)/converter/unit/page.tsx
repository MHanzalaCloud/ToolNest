'use client';

import { useState } from "react";
import { ArrowLeftRight, RefreshCw } from "lucide-react";

type UnitCategory = "length" | "weight" | "temperature" | "volume" | "area";

const UNITS: Record<UnitCategory, { label: string; ratioFromBase: Record<string, number | ((val: number) => number)> }> = {
  length: {
    label: "Length",
    ratioFromBase: {
      Meters: 1,
      Kilometers: 0.001,
      Centimeters: 100,
      Millimeters: 1000,
      Miles: 0.000621371,
      Yards: 1.09361,
      Feet: 3.28084,
      Inches: 39.3701,
    },
  },
  weight: {
    label: "Weight / Mass",
    ratioFromBase: {
      Kilograms: 1,
      Grams: 1000,
      Milligrams: 1000000,
      Pounds: 2.20462,
      Ounces: 35.274,
      Tons: 0.001,
    },
  },
  temperature: {
    label: "Temperature",
    ratioFromBase: {}, // Special handling
  },
  volume: {
    label: "Volume",
    ratioFromBase: {
      Liters: 1,
      Milliliters: 1000,
      "Cubic Meters": 0.001,
      Gallons: 0.264172,
      Quarts: 1.05669,
      Cups: 4.22675,
    },
  },
  area: {
    label: "Area",
    ratioFromBase: {
      "Square Meters": 1,
      "Square Kilometers": 0.000001,
      "Square Feet": 10.7639,
      "Square Miles": 3.861e-7,
      Acres: 0.000247105,
      Hectares: 0.0001,
    },
  },
};

export default function UnitConverterPage() {
  const [category, setCategory] = useState<UnitCategory>("length");
  const [fromUnit, setFromUnit] = useState<string>("Meters");
  const [toUnit, setToUnit] = useState<string>("Feet");
  const [amount, setAmount] = useState<number | "">(1);

  const handleCategoryChange = (cat: UnitCategory) => {
    setCategory(cat);
    if (cat === "temperature") {
      setFromUnit("Celsius");
      setToUnit("Fahrenheit");
    } else {
      const keys = Object.keys(UNITS[cat].ratioFromBase);
      setFromUnit(keys[0]);
      setToUnit(keys[1] || keys[0]);
    }
  };

  const convertTemperature = (val: number, from: string, to: string): number => {
    if (from === to) return val;
    let celsius = val;
    if (from === "Fahrenheit") celsius = (val - 32) * (5 / 9);
    if (from === "Kelvin") celsius = val - 273.15;

    if (to === "Celsius") return celsius;
    if (to === "Fahrenheit") return celsius * (9 / 5) + 32;
    if (to === "Kelvin") return celsius + 273.15;
    return val;
  };

  const calculateResult = (): number => {
    if (amount === "" || isNaN(Number(amount))) return 0;
    const val = Number(amount);

    if (category === "temperature") {
      return convertTemperature(val, fromUnit, toUnit);
    }

    const ratios = UNITS[category].ratioFromBase;
    const baseValue = val / (ratios[fromUnit] as number);
    return baseValue * (ratios[toUnit] as number);
  };

  const swapUnits = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  const unitOptions = category === "temperature" 
    ? ["Celsius", "Fahrenheit", "Kelvin"] 
    : Object.keys(UNITS[category].ratioFromBase);

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight text-white mb-3">Unit Converter</h1>
        <p className="text-gray-400">Convert length, weight, temperature, volume, and area instantly.</p>
      </div>

      <div className="glass-card rounded-2xl p-8 space-y-8">
        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-white/10 pb-4">
          {(Object.keys(UNITS) as UnitCategory[]).map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                category === cat ? "bg-[#FF5500] text-white brand-glow" : "bg-white/5 text-gray-400 hover:text-white"
              }`}
            >
              {UNITS[cat].label}
            </button>
          ))}
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-center">
          <div className="space-y-2">
            <label className="text-xs text-gray-400 block uppercase font-semibold">From</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value === "" ? "" : Number(e.target.value))}
              placeholder="Enter value"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-lg focus:outline-none focus:border-[#FF5500]"
            />
            <select
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
              className="w-full bg-[#12131A] border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#FF5500]"
            >
              {unitOptions.map((u) => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          </div>

          <button
            onClick={swapUnits}
            className="p-3 rounded-xl bg-white/5 border border-white/10 hover:border-[#FF5500] text-[#FF5500] hover:scale-105 transition-all self-center md:mt-6 mx-auto"
            title="Swap Units"
          >
            <ArrowLeftRight className="w-5 h-5" />
          </button>

          <div className="space-y-2">
            <label className="text-xs text-gray-400 block uppercase font-semibold">To</label>
            <div className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[#FF5500] font-bold text-lg overflow-hidden text-ellipsis">
              {calculateResult().toLocaleString(undefined, { maximumFractionDigits: 6 })}
            </div>
            <select
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value)}
              className="w-full bg-[#12131A] border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#FF5500]"
            >
              {unitOptions.map((u) => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
