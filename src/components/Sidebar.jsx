import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  BookOpen,
  Plus,
  ChefHat,
  Settings,
  List,
  ListChecks,
  Weight,
  LogOut,
} from "lucide-react";
import { toast } from "react-toastify";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("auth");
    localStorage.removeItem("auth_expiry");
    toast.info("You’ve been logged out");
    navigate("/login");
  };

  const links = [
    { name: "Dashboard", path: "/dashboard", icon: <ChefHat size={18} /> },
    { name: "Add Recipe", path: "/add-recipe", icon: <Plus size={18} /> },
    { name: "Add Ingredients", path: "/add-ingredients", icon: <List size={18} /> },
    { name: "Ingredients", path: "/master-ingredients", icon: <BookOpen size={18} /> },
    { name: "Planner", path: "/planner", icon: <ListChecks size={18} /> },
    { name: "Convert", path: "/converter", icon: <Weight size={18} /> },
    { name: "Settings", path: "/settings", icon: <Settings size={18} /> },
  ];

  return (
    <aside
      className={`fixed top-16 left-0 h-full w-64 z-50 bg-base border-r border-muted text-text transition-transform duration-200 ease-in-out ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0`}
    >
      <nav className="flex flex-col p-4 space-y-2 h-full justify-between">
        <div className="space-y-2">
          {links.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3 py-2 rounded-md hover:text-accent hover:bg-muted/20 ${
                  isActive ? "text-accent font-semibold bg-muted/10" : "text-text"
                }`
              }
              onClick={toggleSidebar}
            >
              {link.icon}
              <span>{link.name}</span>
            </NavLink>
          ))}
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm text-text hover:text-white hover:bg-accent border border-accent transition"
        >
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;
