import "./navbar.css";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const Navbar = () => {
  const { user, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    navigate("/login");
  };

  return (
    <div className="navbar">
      <div className="navContainer">
        <Link to="/" style={{ color: "inherit", textDecoration: "none" }}>
          <span className="logo">BookMyStay</span>
        </Link>
        {user ? (
          <div className="navItems">
            <span className="navUsername">Hello, {user.username}</span>
            <button className="navButton" onClick={handleLogout}>
              Logout
            </button>
          </div>
        ) : (
          <div className="navItems">
            {/* <button className="navButton" >Register</button> */}
            <Link to="/login" style={{ color: "inherit", textDecoration: "none" }}>
               <button className="navButton" >Register</button>
            </Link>
             <Link to="/login" style={{ color: "inherit", textDecoration: "none" }}>
            <button className="navButton">Login</button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
