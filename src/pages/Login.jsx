import React, { useState, useEffect } from "react";
import "./login.css";
import { useNavigate } from "react-router-dom";
import { Footer, Navbar } from "../components";
const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:9999/user")
      .then((response) => response.json())
      .then((data) => setUsers(data));
  }, []);

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let indexUser = users.findIndex(
      (user) => user.account == username && user.password == password
    );
    if (indexUser === -1 || users[indexUser].status == 0) {
      alert("User or password not found");
    } else {
      sessionStorage.setItem("user", JSON.stringify(users[indexUser]));
      if (users[indexUser].roll == 0) {
        navigate("/");
      }
      if (users[indexUser].roll == 1) {
        navigate("/dashboard");
      }
    }

    // Reset the form
    setUsername("");
    setPassword("");
  };

  return (
    <>
    <Navbar />
    <div className="login-container">
         <h1 className="text-center">Login</h1>
        <hr />
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={handleUsernameChange}
            required
          />
        </div>
        <div className="form-group mb-0">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={handlePasswordChange}
            required
          />
        </div>
        <div className="d-flex float-right pb-3 mr-2">
          <a href="/register">Register </a>
        </div>
        <div className="form-group">
          <button type="submit" className="login-button">
            Login
          </button>
        </div>
      </form>
    
    </div>
    <Footer />
    </>
  );
};

export default Login;
