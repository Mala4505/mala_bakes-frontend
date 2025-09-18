import React, { useState, useEffect } from "react";
import axios from "axios";
import { Pencil, Trash2, Save } from "lucide-react";
import { toast } from "react-toastify";

function IngredientMaster() {
  const [ingredients, setIngredients] = useState([]);
  const [units, setUnits] = useState([]);
  const [newIngredient, setNewIngredient] = useState({
    ingredient: "",
    unit: "",
    price: "",
    qty: "",
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    axios
      .get("https://mala-bakes-backend.onrender.com/api/meta/")
      .then((res) => setUnits(res.data.units))
      .catch(() => toast.error("Failed to load units"));

    fetchIngredients();
  }, []);

  const fetchIngredients = () => {
    axios
      .get("https://mala-bakes-backend.onrender.com/api/master-ingredients/")
      .then((res) => setIngredients(res.data))
      .catch(() => toast.error("Failed to load ingredients"));
  };

  const handleAdd = () => {
    const { ingredient, unit, price, qty } = newIngredient;
    if (!ingredient || !unit || !price || !qty) {
      toast.warning("Please fill all fields before adding");
      return;
    }

    axios
      .post("https://mala-bakes-backend.onrender.com/api/master-ingredients/", newIngredient)
      .then(() => {
        toast.success("Ingredient added!");
        fetchIngredients();
        setNewIngredient({ ingredient: "", unit: "", price: "", qty: "" });
      })
      .catch(() => toast.error("Failed to add ingredient"));
  };

  const handleEdit = (id) => {
    const ing = ingredients.find((i) => i.id === id);
    setNewIngredient({
      ingredient: ing.ingredient,
      unit: ing.unit,
      price: ing.price,
      qty: ing.qty,
    });
    setEditingId(id);
  };

  const handleUpdate = () => {
    const { ingredient, unit, price, qty } = newIngredient;
    if (!ingredient || !unit || !price || !qty) {
      toast.warning("Please fill all fields before updating");
      return;
    }

    axios
      .put(
        `https://mala-bakes-backend.onrender.com/api/master-ingredients/${editingId}/`,
        newIngredient
      )
      .then(() => {
        toast.success("Ingredient updated!");
        fetchIngredients();
        setNewIngredient({ ingredient: "", unit: "", price: "", qty: "" });
        setEditingId(null);
      })
      .catch(() => toast.error("Failed to update ingredient"));
  };

  const handleDelete = (id) => {
    axios
      .delete(`https://mala-bakes-backend.onrender.com/api/master-ingredients/${id}/`)
      .then(() => {
        toast.success("Ingredient deleted");
        fetchIngredients();
      })
      .catch(() => toast.error("Failed to delete ingredient"));
  };

  return (
    <div className="pt-16 px-6 md:pl-64 space-y-6">
      <h2 className="text-2xl font-semibold text-accent font-mono tracking-wide">
        Master Ingredients
      </h2>

      <div className="bg-base border border-muted/50 rounded-lg p-6 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <input
            className="bg-white text-text border border-muted rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-1 focus:ring-accent"
            placeholder="Ingredient name"
            value={newIngredient.ingredient}
            onChange={(e) =>
              setNewIngredient({ ...newIngredient, ingredient: e.target.value })
            }
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
          <input
            type="number"
            className="bg-white text-text border border-muted rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-1 focus:ring-accent"
            placeholder="Price"
            value={newIngredient.price}
            onChange={(e) =>
              setNewIngredient({ ...newIngredient, price: e.target.value })
            }
          />
        </div>

        <button
          onClick={editingId ? handleUpdate : handleAdd}
          className="bg-accent text-base px-4 py-2 rounded-md flex items-center hover:opacity-90 transition"
        >
          <Save size={18} className="mr-2" />
          {editingId ? "Update Ingredient" : "Add Ingredient"}
        </button>
      </div>

      <div className="bg-base border border-muted/50 rounded-lg p-4 shadow-sm space-y-4">
        <h3 className="text-lg font-semibold text-text mb-2">
          Existing Ingredients
        </h3>
        <ul className="space-y-3 text-sm text-text">
          {ingredients.map((i) => (
            <li
              key={i.id}
              className="border border-muted/30 rounded-md px-4 py-3 flex justify-between items-center hover:bg-muted/10 transition"
            >
              <div>
                <span className="font-semibold">{i.ingredient}</span> —{" "}
                {i.price} for {i.qty} {units.find((u) => u.id === i.unit)?.name}
                <span className="text-muted ml-2">
                  ({(i.price / i.qty).toFixed(2)} per unit)
                </span>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => handleEdit(i.id)}
                  className="text-accent hover:text-muted transition"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => handleDelete(i.id)}
                  className="text-red-500 hover:text-muted transition"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default IngredientMaster;
