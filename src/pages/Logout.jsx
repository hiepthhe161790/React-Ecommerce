import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    sessionStorage.removeItem("user");
    navigate("/");
  }, [navigate]);

  return null; // or any UI component if necessary
};

export default Logout;
