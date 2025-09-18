import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import { Plus, Save, Trash2, Loader2 } from "lucide-react";
import { toast } from "react-toastify";

  
const AddIngredients = () => {
  const [recipes, setRecipes] = useState([]);
  const [units, setUnits] = useState([]);
  const [masterIngredients, setMasterIngredients] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(false);

  const [newIngredient, setNewIngredient] = useState({
    ingredient_name: "",
    qty: "",
    unit: "",
  });

  const ingredientOptions = masterIngredients.map((i) => ({
    value: i.ingredient,
    label: i.ingredient,
  }));


  useEffect(() => {
    axios
      .get("https://mala-bakes-backend.onrender.com/api/meta/")
      .then((res) => setUnits(res.data.units))
      .catch(() => toast.error("Failed to load units"));

    axios
      .get("https://mala-bakes-backend.onrender.com/api/recipes/")
      .then((res) => setRecipes(res.data))
      .catch(() => toast.error("Failed to load recipes"));

    axios
      .get("https://mala-bakes-backend.onrender.com/api/master-ingredients/")
      .then((res) => setMasterIngredients(res.data))
      .catch(() => toast.error("Failed to load ingredients"));
  }, []);

  const loadIngredients = (recipe) => {
    setSelectedRecipe(recipe);
    setLoading(true);
    axios
      .get(`https://mala-bakes-backend.onrender.com/api/recipes/${recipe.id}/ingredients/`)
      .then((res) => {
        const loaded = res.data.map((i, idx) => ({
          id: `loaded-${idx}`,
          ingredient_name: i.ingredient_name,
          qty: i.qty,
          unit: i.unit,
          status: undefined,
        }));
        setIngredients(loaded);
        setLoading(false);
      })
      .catch(() => {
        toast.error("Failed to load recipe ingredients");
        setLoading(false);
      });
  };

  const handleAdd = () => {
    if (
      !newIngredient.ingredient_name ||
      !newIngredient.qty ||
      !newIngredient.unit
    ) {
      toast.warning("Please fill all fields before adding");
      return;
    }

    setIngredients([
      ...ingredients,
      {
        id: Date.now().toString(),
        ingredient_name: newIngredient.ingredient_name,
        qty: parseFloat(newIngredient.qty),
        unit: newIngredient.unit,
        status: "new",
      },
    ]);

    setNewIngredient({ ingredient_name: "", qty: "", unit: "" });
    toast.success("Ingredient added");
  };

  const handleChange = (id, field, value) => {
    setIngredients((prev) =>
      prev.map((i) =>
        i.id === id
          ? {
              ...i,
              [field]: field === "qty" ? parseFloat(value) : value,
              status: i.status === "new" ? "new" : "edited",
            }
          : i
      )
    );
  };

  const handleDelete = (id, name) => {
    axios
      .delete(
        `https://mala-bakes-backend.onrender.com/api/recipes/${selectedRecipe.id}/ingredients/${name}/delete/`
      )
      .then(() => {
        setIngredients((prev) => prev.filter((i) => i.id !== id));
        toast.success("Ingredient deleted");
      })
      .catch(() => toast.error("Failed to delete ingredient"));
  };

  const handleSave = () => {
    const changed = ingredients.filter(
      (i) => i.status === "new" || i.status === "edited"
    );
    if (changed.length === 0) {
      toast.info("No changes to save");
      return;
    }

    axios
      .post(
        `https://mala-bakes-backend.onrender.com/api/recipes/${selectedRecipe.id}/ingredients/save/`,
        {
          ingredients: changed,
        }
      )
      .then(() => {
        toast.success("Ingredients saved!");
        setIngredients((prev) =>
          prev.map((i) => ({ ...i, status: undefined }))
        );
      })
      .catch(() => toast.error("Failed to save ingredients"));
  };

  return (
    <div className="pt-16 px-6 md:pl-64 space-y-6">
      <h2 className="text-2xl font-semibold text-accent font-mono tracking-wide">
        Add Ingredients
      </h2>

      {/* Recipe Selector */}
      <div className="bg-base border border-muted/50 rounded-lg p-4 shadow-sm">
        <label className="block text-sm font-medium text-text mb-2">
          Select a recipe
        </label>
        <select
          className="bg-white text-text border border-muted rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-1 focus:ring-accent w-full"
          onChange={(e) => {
            const recipe = recipes.find(
              (r) => r.id === parseInt(e.target.value)
            );
            if (recipe) loadIngredients(recipe);
          }}
          defaultValue=""
        >
          <option value="" disabled>
            Select a recipe
          </option>
          {recipes.map((r) => (
            <option key={r.id} value={r.id}>
              {r.dish} ({r.servings} servings)
            </option>
          ))}
        </select>
      </div>

      {/* Placeholder or Loader */}
      {!selectedRecipe && (
        <div className="text-muted text-sm italic">
          Please select a recipe to begin.
        </div>
      )}
      {loading && (
        <div className="flex items-center space-x-2 text-muted text-sm">
          <Loader2 className="animate-spin" size={16} />
          <span>Loading ingredients...</span>
        </div>
      )}

      {/* Ingredient Editor */}
      {selectedRecipe && !loading && (
        <>
          {/* Add Ingredient Form */}
          <div className="bg-base border border-muted/50 rounded-lg p-4 shadow-sm space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <Select
                options={ingredientOptions}
                value={ingredientOptions.find(
                  (opt) => opt.value === newIngredient.ingredient_name
                )}
                onChange={(selected) =>
                  setNewIngredient({
                    ...newIngredient,
                    ingredient_name: selected.value,
                  })
                }
                placeholder="Select ingredient..."
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
              <input
                type="number"
                className="bg-white text-text border border-muted rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-1 focus:ring-accent"
                placeholder="Quantity"
                value={newIngredient.qty}
                onChange={(e) =>
                  setNewIngredient({ ...newIngredient, qty: e.target.value })
                }
              />
              <select
                className="bg-white text-text border border-muted rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-1 focus:ring-accent"
                value={newIngredient.unit}
                onChange={(e) =>
                  setNewIngredient({ ...newIngredient, unit: e.target.value })
                }
              >
                <option value="">Select unit</option>
                {units.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </select>
              <button
                onClick={handleAdd}
                className="bg-accent text-base px-4 py-2 rounded-md flex items-center justify-center hover:opacity-90 transition"
              >
                <Plus size={16} className="mr-2" /> Add
              </button>
            </div>
          </div>

          {/* Ingredient Table */}
          <div className="bg-base border border-muted/50 rounded-lg shadow-sm overflow-x-auto">
            <table className="min-w-full text-sm text-text">
              <thead className="bg-muted/20 text-left">
                <tr>
                  <th className="px-4 py-2">Ingredient</th>
                  <th className="px-4 py-2">Quantity</th>
                  <th className="px-4 py-2">Unit</th>
                  <th className="px-4 py-2">Delete</th>
                </tr>
              </thead>
              <tbody>
                {ingredients.map((i) => (
                  <tr
                    key={i.id}
                    className={i.status === "edited" ? "bg-muted/10" : ""}
                  >
                    <td className="px-4 py-2">
                      <input
                        className="bg-white text-text border border-muted rounded-md px-2 py-1 w-full shadow-sm focus:outline-none focus:ring-1 focus:ring-accent"
                        value={i.ingredient_name}
                        onChange={(e) =>
                          handleChange(i.id, "ingredient_name", e.target.value)
                        }
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        className="bg-white text-text border border-muted rounded-md px-2 py-1 w-full shadow-sm focus:outline-none focus:ring-1 focus:ring-accent"
                        value={i.qty}
                        onChange={(e) =>
                          handleChange(i.id, "qty", e.target.value)
                        }
                      />
                    </td>
                    <td className="px-4 py-2">
                      <select
                        className="bg-white text-text border border-muted rounded-md px-2 py-1 w-full shadow-sm focus:outline-none focus:ring-1 focus:ring-accent"
                        value={i.unit}
                        onChange={(e) =>
                          handleChange(i.id, "unit", e.target.value)
                        }
                      >
                        {units.map((u) => (
                          <option key={u.id} value={u.id}>
                            {u.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => handleDelete(i.id, i.ingredient_name)}
                        className="text-red-500 hover:text-muted transition"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            className="bg-accent text-base px-6 py-2 rounded-md flex items-center hover:opacity-90 transition mt-4"
          >
            <Save size={18} className="mr-2" /> Save Ingredients
          </button>
        </>
      )}
    </div>
  );
};

export default AddIngredients;
