import React, { Component } from "react";
import DataManager from "../data/api/DataManager";
import LayoutView from "./LayoutView";
import Auth from "../data/auth/Auth";
import { PodcastEpisode } from "../models/PodcastEpisode";
import { Theme, createMuiTheme, MuiThemeProvider } from "@material-ui/core";
import { SettingsManager } from "../data/settings/SettingsManager";

interface IProps {
  isMobile: boolean;
  isAuthenticated: boolean;
  api: DataManager;
  auth: Auth;
  onAuth: () => void;
}

interface IState {
  currentEpisode: PodcastEpisode | null;
  isContinuation: boolean;
  theme: Theme;
}

export class LayoutViewModel extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      currentEpisode: null,
      isContinuation: false,
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

  componentDidUpdate(prevProps: IProps) {
    if (prevProps.isAuthenticated != this.props.isAuthenticated) {
      this.getCurrentPodcast();
    }
  }

  /**
   * Called when an episode has been selected.
   */
  private onEpisodeSelected = (currentEpisode: PodcastEpisode | null) => {
    const { api } = this.props;

    api.setCurrentPodcast(currentEpisode);
    this.setState({ currentEpisode, isContinuation: false });
  };

  /**
   * Gets the latest podcast from the API.
   */
  private getCurrentPodcast = async () => {
    const { api } = this.props;

    await api.getCurrentPodcast(currentEpisode => {
      this.setState({ currentEpisode, isContinuation: true });
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

    var isDarkMode = await options.getDarkMode();

    return createMuiTheme({
      typography: {
        useNextVariants: true
      },
      palette: {
        type: isDarkMode ? "dark" : "light"
      },
      overrides: {
        MuiButton: {
          root: {
            color: isDarkMode ? "white" : "black"
          }
        }
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
