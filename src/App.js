import React, { useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Dashboard from "./pages/Dashboard";
import AddRecipe from "./pages/AddRecipe";
import IngredientMaster from "./pages/IngredientMaster";
import AddIngredients from "./pages/AddIngredients";
import Planner from "./pages/Planner";
import Converter from "./pages/Converter";
import Login from "./pages/Login";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import ErrorBoundary from "./components/ErrorBoundary";
import PageWrapper from "./components/PageWrapper"; // Wraps pages with animation

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const expiry = Number(localStorage.getItem("auth_expiry"));
  const isAuthenticated =
    localStorage.getItem("auth") === "true" && Date.now() < expiry;

  const location = useLocation();

  return (
      <div
        className={`bg-base text-text min-h-screen flex flex-col ${
          sidebarOpen ? "overflow-hidden" : ""
        }`}
      >
        {isAuthenticated && <Navbar toggleSidebar={toggleSidebar} />}

        <div className="flex flex-1">
          {isAuthenticated && (
            <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
          )}

          <main className="pt-16 px-6 flex-1 overflow-y-auto md:pl-64">
            <ErrorBoundary>
              <AnimatePresence mode="wait">
                <Routes location={location} key={location.pathname}>
                  <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
                  <Route
                    path="/dashboard"
                    element={
                      isAuthenticated ? (
                        <PageWrapper><Dashboard /></PageWrapper>
                      ) : (
                        <Navigate to="/login" />
                      )
                    }
                  />
                  <Route
                    path="/add-recipe"
                    element={
                      isAuthenticated ? (
                        <PageWrapper><AddRecipe /></PageWrapper>
                      ) : (
                        <Navigate to="/login" />
                      )
                    }
                  />
                  <Route
                    path="/master-ingredients"
                    element={
                      isAuthenticated ? (
                        <PageWrapper><IngredientMaster /></PageWrapper>
                      ) : (
                        <Navigate to="/login" />
                      )
                    }
                  />
                  <Route
                    path="/add-ingredients"
                    element={
                      isAuthenticated ? (
                        <PageWrapper><AddIngredients /></PageWrapper>
                      ) : (
                        <Navigate to="/login" />
                      )
                    }
                  />
                  <Route
                    path="/planner"
                    element={
                      isAuthenticated ? (
                        <PageWrapper><Planner /></PageWrapper>
                      ) : (
                        <Navigate to="/login" />
                      )
                    }
                  />
                  <Route
                    path="/converter"
                    element={
                      isAuthenticated ? (
                        <PageWrapper><Converter /></PageWrapper>
                      ) : (
                        <Navigate to="/login" />
                      )
                    }
                  />
                  <Route
                    path="/"
                    element={
                      isAuthenticated ? (
                        <Navigate to="/dashboard" />
                      ) : (
                        <Navigate to="/login" />
                      )
                    }
                  />
                </Routes>
              </AnimatePresence>
            </ErrorBoundary>
          </main>
        </div>

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          pauseOnHover
          draggable
          theme="light"
        />
      </div>
  );
}

export default App;
