import React, { useReducer } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import ProtectedRoute from "./custom/ProtectedRoute";
import routes from "./routes";
import "./App.css";
import { CSSTransition } from "react-transition-group";
import SignIn from "./views/SignIn/SignIn";
import { PageContext } from "./Context/SiteContext";
import { company, companyUrl } from "./config.json";

const reducer = (state, action) => {
  switch (action.type) {
    case "setSideMenuOpen":
      return { ...state, open: true };
    case "setSideMenuClosed":
      return { ...state, open: false };
    default:
      return state;
  }
};

const App = () => {
  const [{ siteName, siteUrl, open }, dispatch] = useReducer(reducer, {
    siteName: company,
    siteUrl: companyUrl,
    open: true
  });
  return (
    <React.Fragment>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/icon?family=Material+Icons"
      ></link>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
      />
      <Router basename={process.env.REACT_APP_BASENAME || ""}>
        <PageContext.Provider value={{ siteName, siteUrl, open, dispatch }}>
          <div>
            <Route
              path="/login"
              component={SignIn}
              site={process.env.REACT_APP_BASENAME}
            />
            <Route path="/xreset" component={SignIn} />
            {routes.map((route, index) => {
              return (
                <ProtectedRoute key={index} route={route} index={index}>
                  {({ match }) => (
                    <CSSTransition
                      in={match != null}
                      timeout={300}
                      classNames="page"
                      unmountOnExit
                    >
                      <div className="page">
                        <Route.Component />
                      </div>
                    </CSSTransition>
                  )}
                </ProtectedRoute>
              );
            })}
          </div>
        </PageContext.Provider>
      </Router>
    </React.Fragment>
  );
};

export default App;
