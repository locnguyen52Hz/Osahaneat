// routes/config.js
import Home from "../features/buyer/pages/Home";
import Dashboard from "../features/shop-manager/Dashboard";
import Favourites from "../features/buyer/pages/Favourites";
import Explore from "../features/buyer/pages/Explore";
import ShopDetail from "../features/shops/ShopDetail";
import Orders from "../features/orders/pages/Orders";
import Login from "../features/auth/Common/Login";
import Register from "../features/auth/Register";
import Forbidden from "../features/auth/Common/Forbidden";

import Nearest from "../features/buyer/pages/Nearest";
import RegisterShop from "../features/auth/RegisterShop";
import Categories from "../features/shop-manager/Categories";
import SearchResults from "../features/search/SearchResults";
import MessagesPage from "../features/messages/pages/MessagesPage";
import { icon } from "leaflet";

const routes = {
  public: [
    { path: "/login", element: <Login /> },
    { path: "/register", element: <Register /> },
    { path: "/403", element: <Forbidden /> },
    { path: "/register-shop", element: <RegisterShop /> },
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
        element: <Orders />,
        label: "orders",
        icon: "bi bi-bag-fill",
        showInSideBar: true,
        notify: "orders",
      },
      {
        path: "/buyer/detail/shop/:id",
        element: <ShopDetail />,
        showInSideBar: false,
      },
      {
        path: "/buyer/nearest",
        element: <Nearest />,
        showInSideBar: true,
        label: "nearest",
      },
      {
        path: "/search",
        element: <SearchResults />,
        showInSideBar: false,
      },
      {
        path: "/buyer/messages",
        element: <MessagesPage />,
        label: "messages",
        icon: '"bi bi-chat-dots-fill"',
        notify: "message",
        showInSideBar: true,
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
        element: <Orders />,
        label: "shop orders",
        icon: "bi bi-bag-fill",
        showInSideBar: true,
        notify: "orders",
      },
      {
        path: "/manager/categories",
        element: <Categories />,
        label: "categories",
        icon: "bi bi-bag-fill",
        showInSideBar: true,
      },
      {
        path: "/manager/messages",
        element: <MessagesPage />,
        label: "messages",
        icon: '"bi bi-chat-dots-fill"',
        notify: "message",
        showInSideBar: true,
      },
    ],
  },
};

export default routes;
