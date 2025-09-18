import React from "react";
import { Menu, ChefHat, User, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Navbar = ({ toggleSidebar }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("auth");
    localStorage.removeItem("auth_expiry");
    toast.info("You’ve been logged out");
    navigate("/login");
  };

  return (
    <header className="bg-base/90 backdrop-blur-sm border-b border-muted fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left Section */}
          <div className="flex items-center">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-md text-muted hover:text-accent hover:bg-muted/30 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-accent md:hidden"
              aria-label="Toggle sidebar"
            >
              <Menu size={20} color="black" />
            </button>

            <div className="flex items-center ml-2 md:ml-0">
              <ChefHat className="h-7 w-7 text-accent drop-shadow-sm" />
              <h1 className="ml-2 text-lg font-mono font-semibold text-text tracking-wide">
                Mala Bakes
              </h1>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Profile Icon */}
            <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center">
              <User className="h-5 w-5 text-base" />
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-sm text-text hover:text-white hover:bg-accent px-3 py-1 rounded-md border border-accent transition duration-200"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
