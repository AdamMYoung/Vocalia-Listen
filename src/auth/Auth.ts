import auth0 from "auth0-js";
import { RouteComponentProps } from "react-router";
import Cookies from "universal-cookie";
import DataManager from "../api/DataManager";

export default class Auth {
  cookies = new Cookies();
  accessToken: string | null = null;
  idToken: string | null = null;
  expiresAt: number | null = null;
  routeProps: RouteComponentProps;
  apiManager: DataManager;

  constructor(routeProps: RouteComponentProps, apiManager: DataManager) {
    this.routeProps = routeProps;
    this.apiManager = apiManager;

    var authResult = localStorage.getItem("authResult");
    if (authResult != null) {
      this.assignSessionVariables(JSON.parse(authResult));
      this.renewSession();
    }
  }

  auth0 = new auth0.WebAuth({
    domain: "vocalia.eu.auth0.com",
    audience: "https://api.vocalia.co.uk/podcast",
    clientID: "uHe5eYe5imVEsBTnzcJciIHtj45N2px1",
    redirectUri: process.env.REACT_APP_AUTH_CALLBACK,
    responseType: "token id_token",
    scope: "openid%20offline_access"
  });

  handleAuthentication = () => {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult);
      } else if (err) {
        console.log(err);
        this.routeProps.history.replace("/top");
        if (process.env.NODE_ENV == "development")
          alert(`Error: ${err.error}. Check the console for further details.`);
      }
    });
  };

  getAccessToken = () => {
    return this.accessToken;
  };

  getIdToken = () => {
    return this.idToken;
  };

  setSession = (authResult: auth0.Auth0DecodedHash) => {
    localStorage.setItem("authResult", JSON.stringify(authResult));

    this.assignSessionVariables(authResult);

    // navigate to the home route
    this.routeProps.history.replace("/top");
  };

  assignSessionVariables = (authResult: auth0.Auth0DecodedHash) => {
    // Set the time that the access token will expire at
    let expiresAt =
      (authResult.expiresIn as number) * 1000 + new Date().getTime();
    this.accessToken = authResult.accessToken as string;
    this.idToken = authResult.idToken as string;
    this.expiresAt = expiresAt;

    this.apiManager.accessToken = this.accessToken;
  };

  renewSession = () => {
    this.auth0.checkSession({}, (err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult);
      } else if (err) {
        this.logout();
        console.log(err);
        if (process.env.NODE_ENV == "development")
          alert(
            `Could not get a new token (${err.error}: ${err.errorDescription}).`
          );
      }
    });
  };

  logout = () => {
    // Remove tokens and expiry time
    this.accessToken = null;
    this.idToken = null;
    this.expiresAt = 0;

    // Remove isLoggedIn flag from localStorage
    localStorage.removeItem("isLoggedIn");

    // navigate to the home route
    this.routeProps.history.replace("/top");
  };

  login = () => {
    this.auth0.authorize();
  };

  isAuthenticated = () => {
    // Check whether the current time is past the
    // access token's expiry time.
    let expiresAt = this.expiresAt as number;
    return new Date().getTime() < expiresAt;
  };
}
