import React, { Component } from "react";
import DataManager from "../api/DataManager";
import LayoutView from "./LayoutView";
import Auth from "../auth/Auth";
import { PodcastEpisode } from "../models/PodcastEpisode";

interface IProps {
  isMobile: boolean;
  isAuthenticated: boolean;
  api: DataManager;
  auth: Auth;
  onAuth: () => void;
}

interface IState {
  currentEpisode: PodcastEpisode | null;
}

export class LayoutViewModel extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      currentEpisode: null
    };
  }

  /**
   * Loads the latest podcast if available.
   */
  componentDidMount() {
    this.getCurrentPodcast();
  }

  /**
   * Gets the latest podcast after auth status changes.
   * @param prevProps Previous props of the component.
   */
  componentWillReceiveProps(prevProps: IProps) {
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

  render() {
    return (
      <LayoutView
        onEpisodeSelected={this.onEpisodeSelected}
        {...this.props}
        {...this.state}
      />
    );
  }
}
