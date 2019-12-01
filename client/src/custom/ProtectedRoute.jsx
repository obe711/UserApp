import React from "react";
import { Route, Redirect } from "react-router-dom";
import auth from "../services/authService";

const ProtectedRoute = ({ route, index }) => {
  return (
    <Route
      key={index}
      path={route.path}
      exact={route.exact}
      render={props => {
        if (!auth.getCurrentUser()) return <Redirect to="/login" />;
        if (route.admin) {
          if (!auth.userIsAdmin()) return <Redirect to="/" />;
          return (
            <route.layout {...props}>
              <route.component {...props} />
            </route.layout>
          );
        }

        return (
          <route.layout {...props}>
            <route.component {...props} />
          </route.layout>
        );
      }}
    />
  );
};

export default ProtectedRoute;
