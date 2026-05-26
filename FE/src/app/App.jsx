// import "../App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Suspense } from "react";
import PrivateRouter from "../components/PrivateRouter.jsx";
import MainLayout from "../components/MainLayout.jsx";
import routes from "../routes/config.jsx";
import { useAuth } from "./providers/UseContext.jsx";
import Login from "../features/auth/Common/Login.jsx";
import { ToastContainer } from "react-toastify";
import { WebSocketProvider } from "../contexts/WebSocketContext.jsx";

// Import Login thật sự

function App() {
  const { role, token } = useAuth();

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
