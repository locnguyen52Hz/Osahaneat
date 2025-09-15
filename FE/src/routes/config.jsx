// routes/config.js
import Home from "../pages/Buyer/Home";
import Dashboard from "../pages/ShopManager/Dashboard";
import Favourites from "../pages/Buyer/Favourites";
import Explore from "../pages/Buyer/Explore";
import ShopDetail from "../pages/Buyer/ShopDetail";
import BuyerOrders from "../pages/Buyer/BuyerOrders";
import Login from "../pages/Common/Login";
import Register from "../pages/Common/Register";
import Forbidden from "../pages/Common/Forbidden";
import ShopOrders from "../pages/ShopManager/ShopOrders";

const routes = {
  public: [
    { path: "/login", element: <Login /> },
    { path: "/register", element: <Register /> },
    { path: "/403", element: <Forbidden /> },
  ],

  ROLE_BUYER: {
    layout: "main",
    children: [
      {
        path: "/buyer/home",
        element: <Home />,
        label: "home",
        icon: "bi bi-house-door-fill",
        showInSideBar: true,
      },
      {
        path: "/buyer/favourites",
        element: <Favourites />,
        label: "favourites",
        icon: "bi bi-bookmark-fill",
        showInSideBar: true,
      },
      {
        path: "/buyer/explore",
        element: <Explore />,
        label: "explore",
        icon: "bi bi-border-all",
        showInSideBar: true,
      },
      {
        path: "/buyer/orders",
        element: <BuyerOrders />,
        label: "orders",
        icon: "bi bi-bag-fill",
        showInSideBar: true,
      },
      {
        path: "/buyer/home/shop/:id",
        element: <ShopDetail />,
        showInSideBar: false,
      },
    ],
  },

  ROLE_SHOP_MANAGER: {
    layout: "main",
    children: [
      {
        path: "/manager/dashboard",
        element: <Dashboard />,
        label: "dashboard",
        icon: "bi bi-menu-button-wide",
        showInSideBar: true,
      },
      {
        path: "/manager/shop-orders",
        element: <ShopOrders />,
        label: "shop orders",
        icon: "bi bi-bag-fill",
        showInSideBar: true,
      },
    ],
  },
};

export default routes;
