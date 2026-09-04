import { Suspense, useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import PrivateRouter from "../components/PrivateRouter.jsx";
import Login from "../features/pages/common/Login.jsx";
import MainLayout from "../layouts/MainLayout.jsx";
import routes from "../routes/config.jsx";
import { useAuthStore } from "../stores/Auth/useAuthStore.js";
import { useLocationStore } from "../stores/location/useLocationStore.js";
import { useConversationStore } from "../stores/messages/useConversationStore.js";

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
  // const { role, token } = useAuth();
  const setAuth = useAuthStore((s) => s.setAuth);
  const isInitializing = useAuthStore((s) => s.isInitializing);
  const accessToken = useAuthStore((s) => s.accessToken);
  const refresh = useAuthStore((s) => s.refresh);
  const role = useAuthStore((s) => s.role);
  // console.log(accessToken)

  const Initializer = role ? routes[role]?.initializer : null;

  const privateRoutes =
    role && routes[role] ? mapRoutes(routes[role].children) : [];

  const fetchUnreadMessage = useConversationStore((s) => s.fetchUnreadMessage);

  const detectCurrentLocation = useLocationStore(
    (s) => s.detectCurrentLocation,
  );

  useEffect(() => {
    const initializeAuth = async () => {
      const success = await refresh();

      if (!success) {
        console.log("redirect login");
      }
    };

    initializeAuth();
  }, []);

  useEffect(() => {
    if (accessToken) {
      fetchUnreadMessage();

      detectCurrentLocation();
    }
  }, [accessToken]);

  if (isInitializing) {
    return <div>Đang xác thực người dùng....</div>;
  }
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
          {role && accessToken && routes[role] && Initializer && (
            <Route
              element={
                <PrivateRouter allowedRoles={[role]}>
                  <MainLayout />
                </PrivateRouter>
              }
            >
              <Route element={<Initializer />}>
                {privateRoutes.map(({ path, element }) => (
                  <Route key={path} path={path} element={element} />
                ))}
              </Route>
            </Route>
          )}

          {/* Default redirect */}
          <Route
            path="/"
            element={
              role && accessToken ? (
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
            element={
              accessToken ? <Navigate to="/403" /> : <Navigate to="/login" />
            }
          />
        </Routes>

        <ToastContainer position="top-right" autoClose={3000} />
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
