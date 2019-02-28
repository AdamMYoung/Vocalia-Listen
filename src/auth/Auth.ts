import auth0 from "auth0-js";
import { RouteComponentProps } from "react-router";
import DataManager from "../api/DataManager";

export default class Auth {
  accessToken: string | null = null;
  idToken: string | null = null;
  expiresAt: number | null = null;
  tokenRenewalTimeout: NodeJS.Timeout | null = null;
  routeProps: RouteComponentProps;
  tokenUpdatedCallback: (token: string) => void;

  constructor(
    routeProps: RouteComponentProps,
    callback: (token: string) => void
  ) {
    this.routeProps = routeProps;
    this.tokenUpdatedCallback = callback;

    this.renewSession();
    this.scheduleRenewal();
  }

  /**
   * Object to be used for service
   */
  auth0 = new auth0.WebAuth({
    domain: "vocalia.eu.auth0.com",
    audience: "https://api.vocalia.co.uk",
    clientID: "uHe5eYe5imVEsBTnzcJciIHtj45N2px1",
    redirectUri: process.env.REACT_APP_AUTH_CALLBACK,
    responseType: "token id_token",
    scope: "openid offline_access"
  });

  /**
   * Parses the JWT from the current URL.
   */
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

  /**
   * Returns the stored access code.
   */
  getAccessToken = () => {
    return this.accessToken;
  };

  /**
   * Returns the stored ID token.
   */
  getIdToken = () => {
    return this.idToken;
  };

  /**
   * Sets the session information from the decoded hash.
   */
  setSession = (authResult: auth0.Auth0DecodedHash) => {
    // Set the time that the access token will expire at
    let expiresAt =
      (authResult.expiresIn as number) * 1000 + new Date().getTime();
    this.accessToken = authResult.accessToken as string;
    this.idToken = authResult.idToken as string;
    this.expiresAt = expiresAt;

    this.tokenUpdatedCallback(this.accessToken);
    this.scheduleRenewal();

    // navigate to the home route
    this.routeProps.history.replace("/top");
  };

  /**
   * Silently renews the session information from the Auth0 portal.
   */
  renewSession = () => {
    this.auth0.checkSession({}, (err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult);
      } else if (err) {
        this.clearSignIn();
        console.log(err);
        if (process.env.NODE_ENV == "development")
          alert(
            `Could not get a new token (${err.error}: ${err.errorDescription}).`
          );
      }
    });
  };

  /**
   * Schedules a renewal for every 15 minutes to renew the access token.
   */
  scheduleRenewal() {
    let expiresAt = this.expiresAt;
    if (expiresAt != null) {
      const timeout = expiresAt - Date.now();
      if (timeout > 0) {
        this.tokenRenewalTimeout = setTimeout(() => {
          this.renewSession();
        }, timeout);
      }
    }
  }

  /**
   * Clears the current signed in information.
   */
  clearSignIn = () => {
    // Remove tokens and expiry time
    this.accessToken = null;
    this.idToken = null;
    this.expiresAt = 0;

    if (this.tokenRenewalTimeout != null)
      clearTimeout(this.tokenRenewalTimeout);

    // Remove isLoggedIn flag from localStorage
    localStorage.removeItem("isLoggedIn");
  };

  /**
   * Logs the user out locally and server side.
   */
  logout = () => {
    this.clearSignIn();
    this.auth0.logout({ returnTo: process.env.REACT_APP_AUTH_HOME });
  };

  /**
   * Logs the user in, starting the Auth0 flow.
   */
  login = () => {
    this.auth0.authorize();
  };

  /**
   * Checks if the current user is authenticated.
   */
  isAuthenticated = () => {
    // Check whether the current time is past the
    // access token's expiry time.
    let expiresAt = this.expiresAt as number;
    return new Date().getTime() < expiresAt;
  };
}
