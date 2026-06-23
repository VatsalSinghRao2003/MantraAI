import { useState } from "react";
import { loginUser } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { User, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError("Please fill out all fields.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const data = await loginUser(username, password);
      login(data.token, data.username, data.role);
      navigate("/");
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid credentials or backend offline.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-fullpage login-theme">
      {/* Full-screen blurred background */}
      <div className="auth-bg-blur login-bg-blur" />

      {/* Centered card */}
      <div className="auth-card">
        {/* Top mandala image strip */}
        <div className="auth-card-art login-art" />

        {/* Form section */}
        <div className="auth-card-body">
          <h1 className="auth-card-title">MANTRA AI</h1>
          <p className="auth-card-subtitle">ACCESS SECURE NETWORK</p>

          {error && (
            <div className="auth-error">
              <AlertCircle size={14} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="auth-form">
            <div className="auth-field">
              <User size={16} className="auth-field-icon" />
              <input
                id="login-username"
                type="text"
                placeholder="Enter Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                className="auth-field-input"
              />
            </div>

            <div className="auth-field">
              <Lock size={16} className="auth-field-icon" />
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                className="auth-field-input"
              />
              <button
                type="button"
                className="auth-eye-btn"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>

            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? (
                <span className="auth-spinner" />
              ) : (
                "SIGN IN"
              )}
            </button>
          </form>

          <p className="auth-footer-text">
            Don't have an account?{" "}
            <Link to="/register" className="auth-footer-link">Create account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
