import React, { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../app/providers/UseContext";

function PrivateRouter({ children, allowedRoles }) {
  const { role, token, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      alert('login')
      navigate("/login");

    }
  }, [token, loading, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!token) {
    alert("login");
    return <Navigate to="/login" />;
  }

  // if (role && !allowedRoles.includes(role)) {
  //   alert("chạy 403");
  //   return <Navigate to="/403" />;
  // }

  return children;
}

export default PrivateRouter;
