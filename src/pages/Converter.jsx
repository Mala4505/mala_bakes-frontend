import React, { useState } from "react";
import Select from "react-select";
import conversions from "../data/ingredientConversions.json";
import { toast } from "react-toastify";

function Converter() {
  const [selectedIngredient, setSelectedIngredient] = useState(null);
  const [inputQty, setInputQty] = useState("");
  const [fromUnit, setFromUnit] = useState("");
  const [toUnit, setToUnit] = useState("");
  const [result, setResult] = useState(null);

  const ingredientOptions = conversions.map((i) => ({
    value: i.ingredient,
    label: i.ingredient,
    density: i.density,
    units: i.units,
  }));

  const convert = () => {
    if (!selectedIngredient || !inputQty || !fromUnit || !toUnit) {
      toast.warning("Please fill all fields before converting");
      return;
    }

    const qty = parseFloat(inputQty);
    if (isNaN(qty) || qty <= 0) {
      toast.error("Please enter a valid quantity");
      return;
    }

    const density = selectedIngredient.density;

    let grams;
    switch (fromUnit) {
      case "grams":
        grams = qty;
        break;
      case "ml":
        grams = qty * density;
        break;
      case "cups":
        grams = qty * 240 * density;
        break;
      case "tbsp":
        grams = qty * 15 * density;
        break;
      case "tsp":
        grams = qty * 5 * density;
        break;
      case "oz":
        grams = qty * 28.35;
        break;
      default:
        grams = qty;
    }

    let converted;
    switch (toUnit) {
      case "grams":
        converted = grams;
        break;
      case "ml":
        converted = grams / density;
        break;
      case "cups":
        converted = grams / (240 * density);
        break;
      case "tbsp":
        converted = grams / (15 * density);
        break;
      case "tsp":
        converted = grams / (5 * density);
        break;
      case "oz":
        converted = grams / 28.35;
        break;
      default:
        converted = grams;
    }

    setResult(converted.toFixed(2));
    toast.success("Conversion successful!");
  };

  return (
    <div className="pt-16 px-6 md:pl-64 space-y-6">
      <h2 className="text-2xl font-semibold text-accent font-mono tracking-wide">
        Ingredient Converter
      </h2>

      {/* Ingredient Selector */}
      <div className="bg-base border border-muted/50 rounded-lg p-4 shadow-sm space-y-4">
        <label className="block text-sm font-medium text-text">
          Select Ingredient
        </label>
        <Select
          options={ingredientOptions}
          value={selectedIngredient}
          onChange={setSelectedIngredient}
          placeholder="Search ingredient..."
          className="react-select-container"
          classNamePrefix="react-select"
          styles={{
            control: (base, state) => ({
              ...base,
              backgroundColor: "white",
              borderColor: state.isFocused ? "#ec5246" : "#d0d8da",
              boxShadow: state.isFocused ? "0 0 0 1px #ec5246" : "none",
              "&:hover": { borderColor: "#ec5246" },
              padding: "2px",
            }),
            menu: (base) => ({ ...base, zIndex: 20 }),
          }}
        />
      </div>

      {/* Conversion Inputs */}
      {selectedIngredient && (
        <div className="bg-base border border-muted/50 rounded-lg p-4 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-4">
          <input
            type="number"
            className="bg-white text-text border border-muted rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-1 focus:ring-accent"
            placeholder="Quantity"
            value={inputQty}
            onChange={(e) => setInputQty(e.target.value)}
          />
          <select
            className="bg-white text-text border border-muted rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-1 focus:ring-accent"
            value={fromUnit}
            onChange={(e) => setFromUnit(e.target.value)}
          >
            <option value="">From Unit</option>
            {selectedIngredient.units.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
          <select
            className="bg-white text-text border border-muted rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-1 focus:ring-accent"
            value={toUnit}
            onChange={(e) => setToUnit(e.target.value)}
          >
            <option value="">To Unit</option>
            {selectedIngredient.units.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Convert Button */}
      {selectedIngredient && (
        <button
          onClick={convert}
          className="bg-accent text-base px-6 py-2 rounded-md hover:opacity-90 transition"
        >
          Convert
        </button>
      )}

      {/* Result */}
      {result && (
        <div className="bg-base border border-muted/50 rounded-lg p-4 shadow-sm text-text text-lg font-semibold">
          Result: {result} {toUnit}
        </div>
      )}
    </div>
  );
}

export default Converter;
