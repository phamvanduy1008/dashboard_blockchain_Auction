import React, { useState, useMemo } from "react";
import { RouterProvider, createBrowserRouter, Navigate } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import OverviewPage from "../pages/OverviewPage";
import SettingsPage from "../pages/SettingsPage";
import UsersPage from "../pages/UsersPage";
import MainLayout from "../layout/MainLayout";
import { authService } from "../services/authService";
import AuctionsPage from "../pages/AuctionsPage";
import EventsPage from "../pages/EventsPage";

const AppRouter = () => {
  const [token, setToken] = useState(localStorage.getItem("token"));

  const handleLoginSuccess = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  };

  const handleLogout = () => {
    authService.logout();
    setToken(null);
    localStorage.removeItem("token");
  };

  const isAuthenticated = !!token;

  const router = useMemo(() => {
    return createBrowserRouter(
      isAuthenticated
        ? [
            {
              path: "/",
              element: <MainLayout onLogout={handleLogout} />,
              errorElement: <p>ERROR</p>,
              children: [
                {
                  index: true,
                  element: <OverviewPage />,
                },
                {
                  path: "auctions",
                  element: <AuctionsPage />,
                },
                {
                  path: "users",
                  element: <UsersPage />,
                },
                {
                  path: "events",
                  element: <EventsPage />,
                },
                {
                  path: "settings",
                  element: (
                    <SettingsPage
                      onLogout={handleLogout}
                      onUpdateToken={() => setToken(localStorage.getItem("token"))}
                    />
                  ),
                },
                {
                  path: "login",
                  element: <Navigate to="/" replace />,
                },
              ],
            },
          ]
        : [
            {
              path: "/login",
              element: <LoginPage onLoginSuccess={handleLoginSuccess} />,
            },
            {
              path: "*",
              element: <Navigate to="/login" replace />,
            },
          ]
    );
  }, [isAuthenticated]);

  return <RouterProvider router={router} />;
};

export default AppRouter;