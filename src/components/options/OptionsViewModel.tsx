import React, { Component } from "react";
import OptionsView from "./OptionsView";
import { SettingsManager } from "../../data/settings/SettingsManager";

interface IProps {}

interface IState {
  options: SettingsManager;
  isDarkMode: boolean;
}

export default class OptionsViewModel extends Component<IProps, IState> {
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
  private onToggleDarkMode = () => {};

  render() {
    return (
      <OptionsView onToggleDarkMode={this.onToggleDarkMode} {...this.state} />
    );
  }
}
