import axios from "../../utils/axios.js";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./login.css";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [credentials, setCredentials] = useState({
    username: undefined,
    password: undefined,
    email: undefined,
    country: undefined,
    city: undefined,
    phone: undefined,
    img: undefined,
  });

  const { loading, error, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    dispatch({ type: "LOGIN_START" });
    try {
      const res = await axios.post("/auth/login", credentials);
      dispatch({ type: "LOGIN_SUCCESS", payload: res.data.details });
      navigate("/")
    } catch (err) {
      dispatch({ type: "LOGIN_FAILURE", payload: err.response.data });
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    
    // Validate required fields for registration
    const requiredFields = ['username', 'email', 'password', 'country', 'city', 'phone'];
    const missingFields = requiredFields.filter(field => !credentials[field]);
    
    if (missingFields.length > 0) {
      dispatch({ 
        type: "LOGIN_FAILURE", 
        payload: { 
          message: `Please fill in all required fields: ${missingFields.join(', ')}` 
        } 
      });
      return;
    }

    dispatch({ type: "LOGIN_START" });
    try {
      // Remove undefined fields from credentials
      const registrationData = Object.fromEntries(
        Object.entries(credentials).filter(([_, value]) => value !== undefined)
      );
      
      await axios.post("/auth/register", registrationData);
      const res = await axios.post("/auth/login", {
        username: credentials.username,
        password: credentials.password,
      });
      dispatch({ type: "LOGIN_SUCCESS", payload: res.data.details });
      navigate("/")
    } catch (err) {
      dispatch({ 
        type: "LOGIN_FAILURE", 
        payload: err.response?.data || { message: "Registration failed" } 
      });
    }
  };

  return (
    <div className="login">
      <div className="login-container">
        <div className="login-header">
          <h1>{isLogin ? 'Welcome Back!' : 'Create Account'}</h1>
          <p>{isLogin ? 'Please login to your account' : 'Register for a new account'}</p>
        </div>
        
        <form className="login-form">
          {!isLogin ? (
            <>
              <div className="form-group">
                <label>Username</label>
                <input
                  type="text"
                  placeholder="Enter your username"
                  id="username"
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  id="email"
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  id="password"
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Country</label>
                  <input
                    type="text"
                    placeholder="Enter your country"
                    id="country"
                    onChange={handleChange}
                    required
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label>City</label>
                  <input
                    type="text"
                    placeholder="Enter your city"
                    id="city"
                    onChange={handleChange}
                    required
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  placeholder="Enter your phone number"
                  id="phone"
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Profile Image URL (Optional)</label>
                <input
                  type="text"
                  placeholder="Enter image URL"
                  id="img"
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
            </>
          ) : (
            <>
              <div className="form-group">
                <label>Username</label>
                <input
                  type="text"
                  placeholder="Enter your username"
                  id="username"
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  id="password"
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>
            </>
          )}

          {error && <div className="error-message">{error.message}</div>}

          <button 
            disabled={loading} 
            onClick={isLogin ? handleClick : handleSignup} 
            className="submit-button"
          >
            {loading ? "Please wait..." : (isLogin ? "Login" : "Sign Up")}
          </button>
        </form>

        <div className="login-footer">
          <p>
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button 
              onClick={() => setIsLogin(!isLogin)} 
              className="switch-button"
            >
              {isLogin ? "Sign Up" : "Login"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
