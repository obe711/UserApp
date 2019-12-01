import React from "react";
import { Redirect } from "react-router-dom";

// Layout Types
import { DashboardLayout } from "./layouts";

// Route Views
import Home from "./views/Home/Home";
import Users from "./views/Users/Users";

export default [
  {
    path: "/",
    exact: true,
    layout: DashboardLayout,
    component: () => <Redirect to="/dashboard" />
  },
  {
    path: "/dashboard",
    layout: DashboardLayout,
    component: Home
  },
  {
    path: "/reports",
    layout: DashboardLayout,
    component: Home
  },
  {
    path: "/users",
    layout: DashboardLayout,
    component: Users
  },
  {
    path: "/charts",
    layout: DashboardLayout,
    component: Users
  },
  {
    path: "/files",
    layout: DashboardLayout,
    component: Home
  }
];
