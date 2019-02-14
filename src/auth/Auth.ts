import auth0 from "auth0-js";
import { RouteComponentProps } from "react-router";

export default class Auth {
  accessToken: string | null = null;
  idToken: string | null = null;
  expiresAt: number | null = null;
  routeProps: RouteComponentProps;
  accessTokenCallback: (accessToken: string) => void;

  constructor(
    routeProps: RouteComponentProps,
    accessTokenCallback: (accessToken: string) => void
  ) {
    this.routeProps = routeProps;
    this.accessTokenCallback = accessTokenCallback;
  }

  auth0 = new auth0.WebAuth({
    domain: "vocalia.eu.auth0.com",
    audience: "https://api.vocalia.co.uk/podcast",
    clientID: "uHe5eYe5imVEsBTnzcJciIHtj45N2px1",
    redirectUri: "http://localhost:3000/callback",
    responseType: "token id_token",
    scope: "openid"
  });

  handleAuthentication = () => {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult);
      } else if (err) {
        console.log(err);
        this.routeProps.history.replace("/top");
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
    // Set isLoggedIn flag in localStorage
    localStorage.setItem("isLoggedIn", "true");

    // Set the time that the access token will expire at
    let expiresAt =
      (authResult.expiresIn as number) * 1000 + new Date().getTime();
    this.accessToken = authResult.accessToken as string;
    this.idToken = authResult.idToken as string;
    this.expiresAt = expiresAt;

    this.accessTokenCallback(this.accessToken);

    // navigate to the home route
    this.routeProps.history.replace("/top");
  };

  renewSession = () => {
    this.auth0.checkSession({}, (err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult);
      } else if (err) {
        this.logout();
        console.log(err);
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
