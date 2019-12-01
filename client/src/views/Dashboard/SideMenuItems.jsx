import React from "react";
import DashboardIcon from "@material-ui/icons/Dashboard";
import ListIcon from "@material-ui/icons/List";
import PeopleIcon from "@material-ui/icons/People";
import BarChartIcon from "@material-ui/icons/BarChart";
import LayersIcon from "@material-ui/icons/Layers";

const MenuItems = [
  {
    icon: <DashboardIcon />,
    text: "Home",
    path: "/dashboard"
  },
  {
    icon: <ListIcon />,
    text: "Reports",
    path: "/reports"
  },
  {
    icon: <PeopleIcon />,
    text: "Users",
    path: "/users"
  },
  {
    icon: <BarChartIcon />,
    text: "Charts",
    path: "/charts"
  },
  {
    icon: <LayersIcon />,
    text: "Files",
    path: "/files"
  }
];

export default MenuItems;
