import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Suspense, useEffect } from "react";
import PrivateRouter from "../components/PrivateRouter.jsx";
import MainLayout from "../components/MainLayout.jsx";
import routes from "../routes/config.jsx";
import { useAuth } from "./providers/UseContext.jsx";
import Login from "../features/auth/Common/Login.jsx";
import { ToastContainer } from "react-toastify";
import { useConversationStore } from "../stores/messages/useConversationStore.js";
import { useCartStore } from "../stores/Cart/useCartStore.js";
import { useLocationStore } from "../stores/location/useLocationStore.js";

// helper
function mapRoutes(routeTree) {
  let result = [];

  routeTree.forEach((item) => {
    if (item.type === "item" && item.path) {
      result.push({
        path: item.path,
        element: item.element,
      });
    }

    if (item.type === "group" && item.children) {
      result = result.concat(mapRoutes(item.children));
    }
  });

  return result;
}

function App() {
  const { role, token } = useAuth();

  const privateRoutes =
    role && routes[role] ? mapRoutes(routes[role].children) : [];

  const fetchUnreadMessage = useConversationStore((s) => s.fetchUnreadMessage);
  const fetchCart = useCartStore((s) => s.fetchCart);
  const detectCurrentLocation = useLocationStore(
    (s) => s.detectCurrentLocation,
  );
  useEffect(() => {
    if (token) {
      fetchUnreadMessage();
      fetchCart();
      detectCurrentLocation();
    }
  }, [token]);
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          {/* Public */}
          {routes.public.map(({ path, element }) => (
            <Route key={path} path={path} element={element} />
          ))}

          <Route path="/login" element={<Login />} />

          {/* Private */}
          {role && token && routes[role] && (
            <Route
              element={
                <PrivateRouter allowedRoles={[role]}>
                  <MainLayout />
                </PrivateRouter>
              }
            >
              {privateRoutes.map(({ path, element }) => (
                <Route key={path} path={path} element={element} />
              ))}
            </Route>
          )}

          {/* Default redirect */}
          <Route
            path="/"
            element={
              role && token ? (
                <Navigate
                  to={
                    role === "ROLE_BUYER" ? "/buyer/home" : "/manager/dashboard"
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
            element={token ? <Navigate to="/403" /> : <Navigate to="/login" />}
          />
        </Routes>

        <ToastContainer position="top-right" autoClose={3000} />
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
