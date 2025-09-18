import React, { useState, useEffect } from "react";
import axios from "axios";
import { PlusCircle } from "lucide-react";
import { toast } from "react-toastify";

function AddRecipe() {
  const [dish, setDish] = useState("");
  const [servings, setServings] = useState("");
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    axios
      .get("https://mala-bakes-backend.onrender.com/api/recipes/")
      .then((res) => setRecipes(res.data))
      .catch(() => toast.error("Failed to load recipes"));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!dish || !servings) {
      toast.warning("Please fill in both fields");
      return;
    }

    axios
      .post("https://mala-bakes-backend.onrender.com/api/recipes/", {
        dish,
        servings: parseInt(servings),
      })
      .then(() => {
        toast.success("Recipe added!");
        setDish("");
        setServings("");
        axios
          .get("https://mala-bakes-backend.onrender.com/api/recipes/")
          .then((res) => setRecipes(res.data));
      })
      .catch(() => toast.error("Failed to add recipe"));
  };

  return (
    <div className="pt-16 px-6 md:pl-64 space-y-6">
      <h2 className="text-2xl font-semibold text-accent font-mono tracking-wide">
        Add Recipe
      </h2>
      <form
        onSubmit={handleSubmit}
        className="bg-base border border-muted/50 rounded-lg p-6 shadow-sm space-y-4"
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <input
            className="bg-white text-text border border-muted rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-1 focus:ring-accent"
            placeholder="Dish name"
            value={dish}
            onChange={(e) => setDish(e.target.value)}
          />
          <input
            className="bg-white text-text border border-muted rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-1 focus:ring-accent"
            placeholder="Servings"
            type="number"
            value={servings}
            onChange={(e) => setServings(e.target.value)}
          />
          <button
            type="submit"
            className="bg-accent text-base px-4 py-2 rounded-md flex items-center justify-center hover:opacity-90 transition"
          >
            <PlusCircle size={18} className="mr-2" /> Add Recipe
          </button>
        </div>
      </form>
      <div className="bg-base border border-muted/50 rounded-lg p-4 shadow-sm">
        <h3 className="text-lg font-semibold text-text mb-2">
          Existing Recipes
        </h3>
        <ul className="space-y-2 text-sm text-muted">
          {recipes.map((r) => (
            <li key={r.id} className="border-b border-muted/30 pb-2">
              <span className="text-text font-medium">{r.dish}</span> —{" "}
              <p className="text-text">{r.servings} servings</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default AddRecipe;
