import React, { Component } from "react";
import DataManager from "../../data/api/DataManager";
import { Podcast } from "../../models/Podcast";
import BrowserView from "./BrowserView";

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
  }

  /**
   * Loads the podcasts belonging to the current category.
   */
  componentWillMount() {
    this.loadPodcasts();
  }

  /**
   * Called when props change.
   * @param oldProps Old props to laod.
   */
  componentDidUpdate(oldProps: IProps) {
    if (oldProps.category !== this.props.category) this.loadPodcasts();
  }

  /**
   * Loads podcasts from the passed category.
   */
  private loadPodcasts = async () => {
    const { api, category } = this.props;
    this.setState({ podcasts: null });

    var categoryId = parseInt(category);

    if (category == "top") {
      //Top
      await api.getTopPodcasts(this.onPodcastsLoaded);
    } else if (category == "subscribed") {
      //Subscriptions
      await api.getSubscriptions(this.onPodcastsLoaded);
    } else if (!isNaN(categoryId)) {
      //Genre
      await api.getPodcastByCategory(categoryId, this.onPodcastsLoaded);
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
    return <BrowserView podcasts={podcasts} />;
  }
}
