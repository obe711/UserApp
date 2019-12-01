import React from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ListSubheader from "@material-ui/core/ListSubheader";
import AssignmentIcon from "@material-ui/icons/Assignment";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import MenuItems from "./SideMenuItems";
import { logout } from "../../services/authService";
import { Link, useLocation } from "react-router-dom";

function ListItemLink(props) {
  const { icon, primary, to } = props;
  const renderLink = React.useMemo(
    () =>
      React.forwardRef((linkProps, ref) => (
        <Link to={to} {...linkProps} innerRef={ref} />
      )),
    [to]
  );

  return (
    <li>
      <ListItem
        button
        component={renderLink}
        selected={to === useLocation().pathname}
      >
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText primary={primary} />
      </ListItem>
    </li>
  );
}

const Logout = (
  <ListItem button onClick={() => logout()}>
    <ListItemIcon>
      <ExitToAppIcon />
    </ListItemIcon>
    <ListItemText primary="Logout" />
  </ListItem>
);

const items = MenuItems.map((item, index) => {
  return (
    <ListItemLink
      key={index}
      icon={item.icon}
      primary={item.text}
      to={item.path}
    />
  );
});

export const mainListItems = (
  <div>
    {items}
    {Logout}
  </div>
);

export const secondaryListItems = (
  <div>
    <ListSubheader inset>Saved reports</ListSubheader>
    <ListItem button>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Current month" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Last quarter" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Year-end sale" />
    </ListItem>
  </div>
);
