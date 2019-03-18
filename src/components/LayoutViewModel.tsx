import React, { Component } from "react";
import DataManager from "../data/api/DataManager";
import LayoutView from "./LayoutView";
import Auth from "../data/auth/Auth";
import { PodcastEpisode } from "../models/PodcastEpisode";
import { Theme, createMuiTheme, MuiThemeProvider } from "@material-ui/core";
import { SettingsManager } from "../data/settings/SettingsManager";

interface IProps {
  isMobile: boolean;
  api: DataManager;
  auth: Auth;
  onAuth: () => void;
}

interface IState {
  currentEpisode: PodcastEpisode | null;
  theme: Theme;
}

export class LayoutViewModel extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      currentEpisode: null,
      theme: createMuiTheme({
        typography: {
          useNextVariants: true
        }
      })
    };
  }

  componentWillMount() {
    this.onOptionsChanged();
    this.getCurrentPodcast();
  }

  /**
   * Gets the latest podcast after auth status changes.
   * @param prevProps Previous props of the component.
   */
  componentWillReceiveProps(prevProps: IProps) {
    if (prevProps.auth.isAuthenticated() != this.props.auth.isAuthenticated()) {
      this.getCurrentPodcast();
    }
  }

  /**
   * Called when an episode has been selected.
   */
  private onEpisodeSelected = (currentEpisode: PodcastEpisode | null) => {
    const { api } = this.props;

    api.setCurrentPodcast(currentEpisode);
    this.setState({ currentEpisode });
  };

  /**
   * Gets the latest podcast from the API.
   */
  private getCurrentPodcast = async () => {
    const { api } = this.props;

    await api.getCurrentPodcast(currentEpisode => {
      this.setState({ currentEpisode });
    });
  };

  /*
   * Called when the options have changed.
   */
  private onOptionsChanged = async () => {
    this.setState({ theme: await this.getTheme() });
  };

  /**
   * Returns the current theme.
   */
  private getTheme = async (): Promise<Theme> => {
    var options = new SettingsManager();

    return createMuiTheme({
      typography: {
        useNextVariants: true
      },
      palette: {
        type: (await options.getDarkMode()) ? "dark" : "light"
      }
    });
  };

  render() {
    const { theme } = this.state;

    return (
      <MuiThemeProvider theme={theme}>
        <LayoutView
          onEpisodeSelected={this.onEpisodeSelected}
          onOptionsChanged={this.onOptionsChanged}
          {...this.props}
          {...this.state}
        />
      </MuiThemeProvider>
    );
  }
}
