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
import UpcomingOrders from "../features/orders/components/UpcomingOrders";
import PreviousOrders from "../features/orders/components/PreviousOrders";
import MyCartPage from "../features/buyer/pages/MyCartPage";

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
        type: "item",
        path: "/buyer/home",
        element: <Home />,
        label: "home",
        icon: <i className="bi bi-house-door-fill" />,
        showInSideBar: true,
      },
      {
        type: "item",
        path: "/buyer/mycart",
        element: <MyCartPage />,
        label: "my cart",
        icon: <i className="bi bi-cart-fill"></i>,
        badge: "cart",

        showInSideBar: true,
      },
      {
        type: "item",
        path: "/buyer/favourites",
        element: <Favourites />,
        label: "favourites",
        icon: <i className="bi bi-bookmark-fill"></i>,

        showInSideBar: true,
      },
      {
        type: "item",
        path: "/buyer/explore",
        element: <Explore />,
        label: "explore",
        icon: <i className="bi bi-microsoft"></i>,

        showInSideBar: true,
      },
      {
        type: "group",
        path: "/buyer/orders",
        label: "orders",
        icon: <i className="bi bi-cart-fill"></i>,

        showInSideBar: true,
        notify: "orders",
        children: [
          {
            type: "item",
            path: "buyer/orders/upcoming",
            label: "UpComing",
            element: <UpcomingOrders />,
            icon: <i className="bi bi-truck"></i>,
          },
          {
            type: "item",
            path: "buyer/orders/previous",
            label: "Previous",
            element: <PreviousOrders />,
            icon: <i className="bi bi-truck"></i>,
          },
        ],
      },
      {
        type: "item",
        path: "/buyer/detail/shop/:id",
        element: <ShopDetail />,
        showInSideBar: false,
      },
      {
        type: "item",
        path: "/buyer/nearest",
        element: <Nearest />,
        showInSideBar: true,
        label: "nearest",
        icon: <i className="bi bi-radar"></i>,
      },
      {
        type: "item",
        path: "/search",
        element: <SearchResults />,
        showInSideBar: false,
      },
      {
        type: "item",
        path: "/buyer/messages",
        element: <MessagesPage />,
        label: "messages",
        icon: <i className="bi bi-envelope-fill"></i>,

        notify: "message",
        showInSideBar: true,
        badge: "message",
      },
    ],
  },

  ROLE_SHOP_MANAGER: {
    layout: "main",
    children: [
      {
        type: "item",
        path: "/manager/dashboard",
        element: <Dashboard />,
        label: "dashboard",
        icon: <i className="bi bi-table"></i>,

        showInSideBar: true,
      },
      {
        type: "item",
        path: "/manager/shop-orders",
        element: <Orders />,
        label: "shop orders",
        icon: <i class="bi bi-minecart"></i>,

        showInSideBar: true,
        notify: "orders",
      },
      {
        type: "item",
        path: "/manager/categories",
        element: <Categories />,
        label: "categories",
        icon: <i className="bi bi-menu-button-wide-fill"></i>,

        showInSideBar: true,
      },
      {
        type: "item",
        path: "/manager/messages",
        element: <MessagesPage />,
        label: "messages",
        icon: <i className="bi bi-envelope-fill"></i>,
        badge: "message",

        notify: "message",
        showInSideBar: true,
      },
    ],
  },
};

export default routes;
