import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { ArweaveWalletKit } from "@arweave-wallet-kit/react";
import ArConnectStrategy from "@arweave-wallet-kit/arconnect-strategy";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Create from "./pages/Create.jsx";
import Discover from "./pages/Discover.jsx";
import Profile from "./pages/Profile.jsx";
import View from "./pages/View.jsx";
import ViewPost from "./pages/ViewPost.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/view",
    element: <View />,
  },
  {
    path: "/view/:postId",
    element: <ViewPost />,
  },
  {
    path: "/create",
    element: <Create />,
  },
  {
    path: "/discover",
    element: <Discover />,
  },
  {
    path: "/profile/:userId",
    element: <Profile />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ArweaveWalletKit
      config={{
        permissions: [
          "ACCESS_ADDRESS",
          "ACCESS_ALL_ADDRESSES",
          "SIGN_TRANSACTION",
          "DISPATCH",
        ],
        ensurePermissions: true,
        strategies: [new ArConnectStrategy()],
      }}
    >
      <RouterProvider router={router} />
    </ArweaveWalletKit>
  </React.StrictMode>
);
