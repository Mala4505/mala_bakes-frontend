import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.getElementById("password-input")?.focus();
  }, []);

  const handleLogin = async () => {
    if (!password) {
      toast.warning("Please enter the password");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("https://mala-bakes-backend.onrender.com/api/login/", {
        password,
      });

      if (res.data.success) {
        localStorage.setItem("auth", "true");
        localStorage.setItem("auth_expiry", Date.now() + 3600000); // 1 hour session
        toast.success("Login successful!");
        navigate("/dashboard");
      } else {
        toast.error("Invalid password. Please try again.");
      }
    } catch (err) {
      toast.error("Login failed. Server error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    // <div className="min-h-screen flex items-center justify-center bg-muted/10">
    //   <div className="bg-base p-6 rounded-lg shadow-md w-full max-w-sm space-y-4">
    //     <h2 className="text-xl font-semibold text-text">Login</h2>
    <div className="min-h-screen flex items-center justify-center bg-muted/10">
      <div className="bg-base p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-6 text-text">Login</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
        >
          <input
            id="password-input"
            type="password"
            className="w-full px-3 py-2 mb-5 border border-muted rounded-md focus:outline-none focus:ring-1 focus:ring-accent"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-accent text-white py-2 rounded-md transition ${
              loading ? "opacity-50 cursor-not-allowed" : "hover:opacity-90"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
