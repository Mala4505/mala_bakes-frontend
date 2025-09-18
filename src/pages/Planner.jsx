import React, { useState, useEffect } from "react";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";

function Planner() {
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [masterIngredients, setMasterIngredients] = useState([]);
  const [plannedServings, setPlannedServings] = useState("");
  const [loadingRecipe, setLoadingRecipe] = useState(false);
  const [margin, setMargin] = useState("");
  const [finalPrice, setFinalPrice] = useState("");

  // Unit conversion map
  const unitConversion = {
    g: { kg: 0.001 },
    kg: { g: 1000 },
    ml: { l: 0.001 },
    l: { ml: 1000 },
  };

  useEffect(() => {
    axios
      .get("https://mala-bakes-backend.onrender.com/api/recipes/")
      .then((res) => setRecipes(res.data))
      .catch(() => toast.error("Failed to load recipes"));

    axios
      .get("https://mala-bakes-backend.onrender.com/api/master-ingredients/")
      .then((res) => setMasterIngredients(res.data))
      .catch(() => toast.error("Failed to load ingredients"));
  }, []);

  const loadRecipeDetails = async (id) => {
    setLoadingRecipe(true);
    try {
      const res = await axios.get(`https://mala-bakes-backend.onrender.com/api/recipes/${id}/`);
      setSelectedRecipe(res.data);
      setPlannedServings(res.data.servings);
      setMargin("");
      setFinalPrice("");
      toast.success("Recipe loaded!");
    } catch {
      toast.error("Failed to load recipe details");
    } finally {
      setLoadingRecipe(false);
    }
  };

const getIngredientDetails = (name, recipeUnit) => {
  const match = masterIngredients.find((i) => i.ingredient === name);
  if (!match || !match.price || !match.qty) return null;

  const masterUnit = match.unit_name;
  let convertedQty = match.qty;

  // Convert master quantity to recipe unit
  if (masterUnit !== recipeUnit) {
    const conversionFactor = unitConversion[masterUnit]?.[recipeUnit];
    if (conversionFactor) {
      convertedQty = match.qty * conversionFactor;
    } else {
      toast.warning(`No conversion from ${masterUnit} to ${recipeUnit}`);
    }
  }

  const unitCost = match.price / convertedQty;

  return {
    unit: recipeUnit,
    refQty: match.qty,
    refPrice: match.price,
    unitCost,
  };
};


  const getScaledIngredients = () => {
    if (!selectedRecipe || !Array.isArray(selectedRecipe.ingredients)) return [];

    const factor =
      plannedServings && plannedServings > 0
        ? plannedServings / selectedRecipe.servings
        : 1;

    return selectedRecipe.ingredients.map((i) => {
      const ref = getIngredientDetails(i.ingredient_name, i.unit_name);
      const scaledQty = i.qty * factor;
      const scaledCost = ref ? ref.unitCost * scaledQty : 0;

      return {
        name: i.ingredient_name,
        unit: i.unit_name,
        scaledQty,
        scaledCost,
        refQty: ref?.refQty,
        refPrice: ref?.refPrice,
        refUnit: ref?.unit,
      };
    });
  };

  const scaledIngredients = getScaledIngredients();
  const totalCost = scaledIngredients.reduce((sum, i) => sum + i.scaledCost, 0);
  const price = finalPrice
    ? parseFloat(finalPrice)
    : totalCost * (1 + (margin || 0) / 100);
  const profit = price - totalCost;
  const marginPercent = price ? ((profit / price) * 100).toFixed(2) : 0;

  return (
    <div className="pt-16 px-6 md:pl-64 space-y-6">
      <h2 className="text-2xl font-semibold text-accent font-mono tracking-wide">
        Order Planner
      </h2>

      {/* Recipe Selector */}
      <div className="bg-base border border-muted/50 rounded-lg p-4 shadow-sm space-y-4">
        <label className="block text-sm font-medium text-text">Select a recipe</label>
        <select
          className="bg-white text-text border border-muted rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-1 focus:ring-accent w-full"
          onChange={(e) => loadRecipeDetails(parseInt(e.target.value))}
          defaultValue=""
        >
          <option value="" disabled>Select recipe</option>
          {recipes.map((r) => (
            <option key={r.id} value={r.id}>{r.dish}</option>
          ))}
        </select>

        {loadingRecipe && (
          <div className="flex items-center space-x-2 text-muted text-sm">
            <Loader2 className="animate-spin" size={16} />
            <span>Loading recipe...</span>
          </div>
        )}

        {selectedRecipe && !loadingRecipe && (
          <div className="text-sm text-text">
            Original Servings: <span className="font-medium">{selectedRecipe.servings}</span>
          </div>
        )}
      </div>

      {/* Planned Servings */}
      {selectedRecipe && !loadingRecipe && (
        <div className="bg-base border border-muted/50 rounded-lg p-4 shadow-sm space-y-2">
          <label className="block text-sm font-medium text-text">Planned Servings</label>
          <input
            type="number"
            className="bg-white text-text border border-muted rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-1 focus:ring-accent w-full"
            value={plannedServings}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              if (val <= 0) {
                toast.warning("Servings must be greater than zero");
                return;
              }
              setPlannedServings(val);
            }}
            placeholder="Enter planned servings"
          />
          <p className="text-xs text-muted">Leave blank to use original servings</p>
        </div>
      )}

      {/* Ingredient Table */}
      {selectedRecipe && (
        <div className="overflow-x-auto border border-muted/50 rounded-lg shadow-sm">
          <table className="min-w-full text-sm text-text">
            <thead className="bg-muted/20 sticky top-0 z-10">
              <tr>
                <th className="px-4 py-2 text-left">Ingredient</th>
                <th className="px-4 py-2 text-right">Planned Qty</th>
                <th className="px-4 py-2 text-left">Unit</th>
                <th className="px-4 py-2 text-right">Planned Cost</th>
              </tr>
            </thead>
            <tbody>
              {scaledIngredients.map((i, idx) => (
                <tr key={idx} className="hover:bg-muted/10 transition">
                  <td
                    className="px-4 py-2"
                    title={`Master: ${i.refQty} ${i.refUnit} @ KSH${i.refPrice}`}
                  >
                    {i.name}
                  </td>
                  <td className="px-4 py-2 text-right">{i.scaledQty.toFixed(2)}</td>
                  <td className="px-4 py-2">{i.unit}</td>
                  <td className="px-4 py-2 text-right">KSH{i.scaledCost.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pricing Section */}
      {selectedRecipe && (
        <div className="bg-base border border-muted/50 rounded-lg p-4 shadow-sm space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text">Add Profit Margin (%)</label>
              <input
                type="number"
                className="bg-white text-text border border-muted rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-1 focus:ring-accent w-full"
                value={margin}
                onChange={(e) => {
                  setMargin(e.target.value);
                  setFinalPrice("");
                }}
                placeholder="e.g. 25"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text">Or Final Price (KSH)</label>
              <input
                type="number"
                className="bg-white text-text border border-muted rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-1 focus:ring-accent w-full"
                value={finalPrice}
                onChange={(e) => {
                  setFinalPrice(e.target.value);
                  setMargin("");
                }}
                placeholder="e.g. 350"
              />
            </div>
          </div>
          <div className="text-sm text-text mt-4 space-y-1">
            <div>
              🔹 Total Cost:{" "}
              <span className="font-semibold">KSH{totalCost.toFixed(2)}</span>
            </div>
            <div>
              🔹 Final Price:{" "}
              <span className="font-semibold">KSH{price.toFixed(2)}</span>
            </div>
            <div>
              🔹 Profit:{" "}
              <span className="font-semibold">KSH{profit.toFixed(2)}</span>
            </div>
            <div>
              🔹 Margin:{" "}
              <span className="font-semibold">{marginPercent}%</span>
            </div>
            <div>
              🔹 Price per piece:{" "}
              <span className="font-semibold">
                KSH{(price / plannedServings).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Planner;
