import React, { Component } from "react";
import OptionsView from "./OptionsView";
import { SettingsManager } from "../../data/settings/SettingsManager";
import { RouteComponentProps, withRouter } from "react-router";

interface IProps extends RouteComponentProps {
  onOptionsChanged: () => void;
}

interface IState {
  options: SettingsManager;
  isDarkMode: boolean;
}

class OptionsViewModel extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    var options = new SettingsManager();

    this.state = {
      options: options,
      isDarkMode: false
    };
  }

  /**
   * Loads the application options from memory.
   */
  componentDidMount = async () => {
    const { options } = this.state;

    var isDarkMode = await options.getDarkMode();
    this.setState({ isDarkMode });
  };

  /**
   * Toggles the dark mode setting.
   */
  private onToggleDarkMode = () => {
    const { options, isDarkMode } = this.state;

    options.setDarkMode(!isDarkMode);
    this.setState({ isDarkMode: !isDarkMode });
  };

  /**
   * Closes the current dialog.
   */
  private onClose = () => {
    this.props.onOptionsChanged();
    let history = this.props.history;
    let path = window.location.pathname;
    let newUri = path.substring(0, path.lastIndexOf("/"));
    history.push(newUri);
  };

  render() {
    return (
      <OptionsView
        onToggleDarkMode={this.onToggleDarkMode}
        onClose={this.onClose}
        {...this.state}
      />
    );
  }
}

export default withRouter(OptionsViewModel);
