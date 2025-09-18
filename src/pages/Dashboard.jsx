import React, { useState } from 'react';
import { ChevronDown, Plus, BookOpen, ChefHat } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [openSection, setOpenSection] = useState(null);
  const toggleAccordion = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <div className="pt-16 px-6 md:pl-64 space-y-6">
      <h1 className="text-2xl font-semibold text-accent font-mono tracking-wide">Welcome to Mala Bakes!</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link to="/add-recipe" className="bg-base border border-muted/60 rounded-lg p-4 shadow-sm hover:shadow-md hover:border-accent hover:scale-[1.02] transition duration-200">
          <div className="flex items-center space-x-3">
            <ChefHat className="text-accent" />
            <h2 className="text-lg font-semibold text-text tracking-wide">Add New Recipe</h2>
          </div>
          <p className="text-sm text-text mt-2">Start building your next creation</p>
        </Link>

        <Link to="/master-ingredients" className="bg-base border border-muted/60 rounded-lg p-4 shadow-sm hover:shadow-md hover:border-accent hover:scale-[1.02] transition duration-200">
          <div className="flex items-center space-x-3">
            <BookOpen className="text-accent" />
            <h2 className="text-lg font-semibold text-text tracking-wide">Manage Ingredients</h2>
          </div>
          <p className="text-sm text-text mt-2">Edit costs and units globally</p>
        </Link>

        <Link to="/add-ingredients" className="bg-base border border-muted/60 rounded-lg p-4 shadow-sm hover:shadow-md hover:border-accent hover:scale-[1.02] transition duration-200">
          <div className="flex items-center space-x-3">
            <Plus className="text-accent" />
            <h2 className="text-lg font-semibold text-text tracking-wide">Add Ingredients</h2>
          </div>
          <p className="text-sm text-text mt-2">Populate recipes with ingredients</p>
        </Link>
      </div>

      <div className="space-y-4">
        <div className="border border-muted/60 rounded-lg shadow-sm">
          <button onClick={() => toggleAccordion('recipes')} className="w-full flex justify-between items-center px-4 py-3 bg-base hover:bg-muted/10 transition">
            <span className="text-accent font-semibold tracking-wide">Recent Recipes</span>
            <ChevronDown className={`transform transition ${openSection === 'recipes' ? 'rotate-180' : ''}`} />
          </button>
          {openSection === 'recipes' && (
            <div className="px-4 py-2 text-sm text-text space-y-2">
              <p>• Chocolate Ganache Tart</p>
              <p>• Lemon Zest Muffins</p>
              <p>• Spiced Apple Crumble</p>
            </div>
          )}
        </div>

        <div className="border border-muted/60 rounded-lg shadow-sm">
          <button onClick={() => toggleAccordion('ingredients')} className="w-full flex justify-between items-center px-4 py-3 bg-base hover:bg-muted/10 transition">
            <span className="text-accent font-semibold tracking-wide">Ingredient Summary</span>
            <ChevronDown className={`transform transition ${openSection === 'ingredients' ? 'rotate-180' : ''}`} />
          </button>
          {openSection === 'ingredients' && (
            <div className="px-4 py-2 text-sm text-text space-y-2">
              <p>• 12 ingredients in use</p>
              <p>• 3 units defined</p>
              <p>• Last updated: 2 days ago</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
