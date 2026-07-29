import {
  createBrowserRouter
} from "react-router-dom";
import Login from "../pages/login/Login";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home";
import ProductDetails from "../pages/ProductDetails/ProductDetails";
import Cart from "../pages/cart/Cart";
import Register from "../pages/register/Register";
import Checkout from "../pages/Checkout";
import OrderSuccess from "../pages/orderSuccess/OrderSuccess";
import Admin from "../pages/Admin";
import OrderHistory from "../pages/OrderHistory";
import Profile from "../pages/Profile";
import Wishlist from "../pages/wishlist/Wishlist";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: "/product/:id",
        element: <ProductDetails />
      },
      {
        path: "/cart",
        element: <Cart />
      },
      {
        path: "/login",
        element: <Login />
      },
      {
        path: "/register",
        element: <Register />
      },
      {
        path: "/checkout",
        element: <Checkout />
      },
      {
        path: "/order-success",
        element: <OrderSuccess />
      },
      {
        path: "/admin",
        element: <Admin />
      },
      {
        path: "/orders",
        element: <OrderHistory />
      },
      {
        path: "/profile",
        element: <Profile />
      },
      {
        path: "/wishlist",
        element: <Wishlist />
      }
    ]
  }
]);

export default router;