import React, { Component } from "react";
import { isMobile } from "./utility/DeviceUtils";
import DataManager from "./data/api/DataManager";
import Auth from "./data/auth/Auth";
import { LayoutViewModel } from "./components/LayoutViewModel";
import { RouteComponentProps, withRouter } from "react-router";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core";
import { ThemeOptions, Theme } from "@material-ui/core/styles/createMuiTheme";
import { SettingsManager } from "./data/settings/SettingsManager";
import { PaletteOptions } from "@material-ui/core/styles/createPalette";

interface IProps extends RouteComponentProps {}

interface IState {
  isMobile: boolean;
  isAuthenticated: boolean;
  api: DataManager;
  auth: Auth;
}

/**
 * UI entry point into the application, handles routing and player interaction.
 */
class App extends Component<IProps, IState> {
  displayName = App.name;

  constructor(props: IProps) {
    super(props);

    this.state = {
      isMobile: false,
      isAuthenticated: false,
      auth: new Auth(props, this.onTokenChanged),
      api: new DataManager()
    };
  }

  /**
   * Called after the component has mounted, and sets a resize event listener for state updates.
   */
  componentDidMount() {
    this.onResize();
    window.addEventListener("resize", this.onResize);
  }

  /**
   * Called when the component is unloaded, and removes a resize event listener for state updates.
   */
  componentWillUnmount() {
    window.removeEventListener("resize", this.onResize);
  }

  /**
   * Checks the screen state of the current device for UI management.
   */
  private onResize = () => {
    this.setState({ isMobile: isMobile() });
  };

  /**
   * Called when the auth token has changed.
   */
  private onTokenChanged = (token: string | null) => {
    const { api } = this.state;
    api.accessToken = token;

    this.setState({ api, isAuthenticated: Boolean(token) });
  };

  /**
   * Called when the auth selection has been toggled.
   */
  private onAuth = () => {
    const { auth } = this.state;

    if (auth.getAccessToken()) auth.logout();
    else auth.login();
  };

  render() {
    return <LayoutViewModel onAuth={this.onAuth} {...this.state} />;
  }
}

export default withRouter(App);
