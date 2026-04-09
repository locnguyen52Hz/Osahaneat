// routes/config.js
import Home from "../pages/Buyer/Home";
import Dashboard from "../pages/ShopManager/Dashboard";
import Favourites from "../pages/Buyer/Favourites";
import Explore from "../pages/Buyer/Explore";
import ShopDetail from "../pages/Buyer/ShopDetail";
import Orders from "../pages/Common/Orders";
import Login from "../pages/Common/Login";
import Register from "../pages/Common/Register";
import Forbidden from "../pages/Common/Forbidden";

import Map from "../components/Map";
import RegisterShop from "../pages/ShopManager/RegisterShop";
import Categories from "../pages/ShopManager/Categories";
import SearchResults from "../pages/Buyer/SearchResults";
import MessagesPage from "../pages/Common/MessagesPage";
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
        notify: 'orders',
      },
      {
        path: "/buyer/detail/shop/:id",
        element: <ShopDetail />,
        showInSideBar: false,
      },
      {
        path: "/buyer/map",
        element: <Map />,
        showInSideBar: true,
        label: "map",
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
        notify: 'message',
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
        notify: 'orders',
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
        notify: 'message',
        showInSideBar: true,
      },
    ],
  },
};

export default routes;
