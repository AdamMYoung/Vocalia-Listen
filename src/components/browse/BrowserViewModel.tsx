import React, { Component } from "react";
import BrowserView from "./BrowserView";
import { Podcast } from "../../utility/types";
import DataManager from "../../api/DataManager";

interface IProps {
  api: DataManager;
  category: string;
}

interface IState {
  podcasts: Podcast[] | null;
}

export default class BrowserViewModel extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = { podcasts: null };
    this.loadPodcasts();
  }

  /**
   * Loads podcasts from the passed category.
   */
  private loadPodcasts = async () => {
    const { api, category } = this.props;
    var categoryId = parseInt(category);

    if (categoryId != NaN) {
      //Genre
      await api.getPodcastByCategory(categoryId, this.onPodcastsLoaded);
    } else if (category == "top") {
      //Top
      await api.getTopPodcasts(this.onPodcastsLoaded);
    } else if (category == "subscriptions") {
      //Subscriptions
      await api.getSubscriptions(this.onPodcastsLoaded);
    }
  };

  /**
   * Assigns the recieved podcasts to the state.
   */
  private onPodcastsLoaded = (podcasts: Podcast[] | null) => {
    this.setState({ podcasts });
  };

  render() {
    const { podcasts } = this.state;
    return podcasts && <BrowserView podcasts={podcasts} />;
  }
}
