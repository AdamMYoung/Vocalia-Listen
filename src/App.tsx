import React, { Component } from "react";
import { isMobile } from "./utility/DeviceUtils";
import Layout from "./components/Layout";
import Auth from "./auth/Auth";

/**
 * State information for the application.
 */
interface IAppState {
  isMobile: boolean;
}

/**
 * Required properties for the application.
 */
interface IAppProps {}

/**
 * UI entry point into the application, handles routing and player interaction.
 */
export default class App extends Component<IAppProps, IAppState> {
  displayName = App.name;

  constructor(props: IAppProps) {
    super(props);

    this.state = {
      isMobile: false
    };
  }

  /**
   * Called after the component has mounted, and sets a resize event listener for state updates.
   */
  componentDidMount() {
    this.updatePredicate();
    window.addEventListener("resize", this.updatePredicate);
  }

  /**
   * Called when the component is unloaded, and removes a resize event listener for state updates.
   */
  componentWillUnmount() {
    window.removeEventListener("resize", this.updatePredicate);
  }

  /**
   * Checks the screen state of the current device for UI management.
   */
  updatePredicate = () => {
    this.setState({ isMobile: isMobile() });
  };

  render() {
    return <Layout {...this.state} />;
  }
}
