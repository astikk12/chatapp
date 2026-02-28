import { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { FaComments, FaMoon, FaSun } from "react-icons/fa";
import "./home.css";

function Home() {

  const [dark, setDark] = useState(true);

  return (
    <div className={`home-container ${dark ? "dark" : "light"}`}>

      {/* Theme Toggle */}
      <button
        className="theme-btn"
        onClick={() => setDark(!dark)}
      >
        {dark ? <FaSun /> : <FaMoon />}
      </button>

      {/* Background Effects */}
      <div className="bg-blur one"></div>
      <div className="bg-blur two"></div>

      {/* Main Card */}
      <div className="home-card">

        <FaComments className="chat-icon" />

        <h1>PurpleChat</h1>

        <p>
          Experience real-time conversations with a modern,
          fast and secure messaging platform.
        </p>

        <div className="buttons">

          <Link to="/login" className="login-btn">
            Login
          </Link>

          <Link to="/register" className="register-btn">
            Register
          </Link>

        </div>

      </div>

      <Outlet />

    </div>
  );
}

export default Home;