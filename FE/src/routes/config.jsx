// routes/config.js
import PreviousOrders from "../features/orders/components/PreviousOrders";
import UpcomingOrders from "../features/orders/components/UpcomingOrders";
import Explore from "../features/pages/buyer/Explore";
import Favourites from "../features/pages/buyer/Favourites";
import Home from "../features/pages/buyer/Home";
import MyCartPage from "../features/pages/buyer/MyCartPage";
import Nearest from "../features/pages/buyer/Nearest";

import SearchResults from "../features/pages/buyer/SearchResults";
import Forbidden from "../features/pages/common/Forbidden";
import Login from "../features/pages/common/Login";
import MessagesPage from "../features/pages/common/MessagesPage";
import Dashboard from "../features/pages/shop-manager/Dashboard";

import CategoriesPage from "../features/shop-manager/CategoriesPage";
import ShopDetail from "../features/shops/ShopDetail";

import BuyerInitializer from "../features/buyer/components/BuyerInitializer";
import ManagerOrderDetails from "../features/pages/shop-manager/ManagerOrderDetails";
import ManagerInitializer from "../features/shop-manager/components/ManagerInitializer";
import RegisterShop from "../features/pages/shop-manager/RegisterShop";
import Register from "../features/pages/buyer/Register";

const routes = {
  public: [
    { path: "/login", element: <Login /> },
    { path: "/register", element: <Register /> },
    { path: "/403", element: <Forbidden /> },
    { path: "/register-shop", element: <RegisterShop /> },
  ],

  ROLE_BUYER: {
    layout: "main",
    initializer: BuyerInitializer,
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
    initializer: ManagerInitializer,
    children: [
      {
        type: "item",
        path: "/manager/dashboard",
        element: <Dashboard />,
        label: "dashboard",
        icon: <i className="bi bi-table"></i>,

        showInSideBar: true,
      },
      // {
      //   type: "item",
      //   path: "/manager/shop-orders",
      //   element: <Orders />,
      //   label: "shop orders",
      //   icon: <i className="bi bi-minecart"></i>,

      //   showInSideBar: true,
      //   notify: "orders",
      // },
      {
        type: "item",
        path: "/manager/categories",
        element: <CategoriesPage />,
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
      {
        type: "item",
        path: "/order-details/:id",
        element: <ManagerOrderDetails />,
        showInSideBar: false,
      },
    ],
  },
};

export default routes;
