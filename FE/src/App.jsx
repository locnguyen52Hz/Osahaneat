import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Suspense } from "react";
import AppProvider from "./contexts/AppProvider";
import PrivateRouter from "./components/PrivateRouter";
import MainLayout from "./components/MainLayout";
import routes from "./routes/config.jsx";
import { useAuth } from "./contexts/UseContext.jsx";
import Login from "./pages/Common/Login.jsx";
import { ToastContainer } from "react-toastify";
import useWebSocket from "./hooks/useWebSocket.js";
// Import Login thật sự

function App() {
  const { role, token } = useAuth();
  useWebSocket(token)
  return (
    <>
      <BrowserRouter>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            {/* Public routes */}
            {routes.public.map(({ path, element }) => (
              <Route key={path} path={path} element={element} />
            ))}

            {/* Trang login */}
            <Route path="/login" element={<Login />} />

            {/* Private routes theo role */}
            {role && token && routes[role] && (
              <Route
                element={
                  <PrivateRouter allowedRoles={[role]}>
                    <MainLayout />
                  </PrivateRouter>
                }
              >
                {routes[role].children.map(({ path, element }) => (
                  <Route key={path} path={path} element={element} />
                ))}
              </Route>
            )}

            {/* Redirect mặc định */}
            <Route
              path="/"
              element={
                role && token ? (
                  <Navigate
                    to={
                      role === "ROLE_BUYER"
                        ? "/buyer/home"
                        : "/manager/dashboard"
                    }
                  />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />

            {/* Catch all */}
            <Route
              path="*"
              element={
                token ? <Navigate to="/403" /> : <Navigate to="/login" />
              }
            />
          </Routes>
          <ToastContainer position="top-right" autoClose ={3000}/>
        </Suspense>
      </BrowserRouter>
    </>
  );
}

export default App;
