import "./navbar.css";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const Navbar = () => {
  const { user, dispatch } = useContext(AuthContext);

  const handleClick = (e) => {
    e.preventDefault();
    dispatch({ type: "LOGOUT" });
  };

  return (
    <div className="navbar">
      <div className="navContainer">
        <Link to="/" style={{ color: "inherit", textDecoration: "none" }}>
          <span className="logo">Booking App</span>
        </Link>
        {user ? (
          <div className="navItems">
            {user.username}
            <button className="navButton">
              <a href="/transaction">Transaction</a>
            </button>
            <button className="navButton" onClick={handleClick}>
              <a href="/">Log Out</a>
            </button>
          </div>
        ) : (
          <div className="navItems">
            <button className="navButton">
              <a href="/register">Register</a>
            </button>
            <button className="navButton">
              <a href="/login">Login</a>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
