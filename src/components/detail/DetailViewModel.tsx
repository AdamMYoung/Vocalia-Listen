import React, { Component } from "react";
import DataManager from "../../api/DataManager";
import { PodcastEpisode, PodcastFeed } from "../../utility/types";
import { Podcast } from "../../models/Podcast";
import { Listen } from "../../models/Listen";
import { withRouter, RouteComponentProps } from "react-router";
import DetailView from "./DetailView";

interface IProps extends RouteComponentProps {
  api: DataManager;
  feedUrl: string;
  isMobile: boolean;
  currentEpisode: PodcastEpisode | null;
  onEpisodeSelected: (episode: PodcastEpisode | null) => void;
}

interface IState {
  feed: PodcastFeed | null;
  visibleEpisodeCount: number;
  isImageLoaded: boolean;
}

export class DetailViewModel extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      feed: null,
      visibleEpisodeCount: 5,
      isImageLoaded: false
    };
  }

  /**
   * Loads the initial RSS feed.
   */
  componentWillMount() {
    this.getFeed();
  }

  /**
   * Called when the user's auth token has been updated, updating the feed.
   */
  componentDidUpdate(prevProps: IProps) {
    if (prevProps.api.accessToken !== prevProps.api.accessToken) {
      this.getFeed();
    }
  }

  /**
   * Loads the current feed URL.
   */
  private getFeed = async () => {
    const { feedUrl, api } = this.props;
    await api.parsePodcastFeed(feedUrl, feed => {
      this.setState({ feed });
    });
  };

  /**
   * Toggles the subscribed status of the podcast.
   */
  private onSubscribe = async () => {
    const { feed } = this.state;
    const { api } = this.props;

    if (feed) {
      if (feed.isSubscribed) {
        await api.deleteSubscription(feed.link);
      } else {
        await api.addSubscription(Podcast.fromFeed(feed));
      }

      feed.isSubscribed = !feed.isSubscribed;
      this.setState({ feed });
    }
  };

  /**
   * Sets the listen status information for the provided episode.
   */
  private onListenStatusChanged = async (episode: PodcastEpisode) => {
    const { feed } = this.state;
    const { api } = this.props;

    await api.setListenInfo(Listen.fromPodcastEpisode(episode));
    if (feed) {
      var index = feed.items.findIndex(e => e.content == episode.content);
      feed.items[index] = episode;
      this.setState({ feed });
    }
  };

  /**
   * Closes the current dialog.
   */
  private onClose = () => {
    let history = this.props.history;
    let path = window.location.pathname;
    let newUri = path.substring(0, path.lastIndexOf("/"));
    history.push(newUri);
  };

  /**
   * Called when the image has loaded.
   */
  private onImageLoad = () => {
    this.setState({ isImageLoaded: true });
  };

  /**
   * Loads more episodes from the current podcast.
   */
  private onLoadMoreEpisodes = () => {
    const { visibleEpisodeCount } = this.state;
    this.setState({ visibleEpisodeCount: visibleEpisodeCount + 20 });
  };

  render() {
    const { api } = this.props;

    return (
      <DetailView
        isAuthenticated={Boolean(api.accessToken)}
        onClose={this.onClose}
        onListenStatusChanged={this.onListenStatusChanged}
        onSubscribe={this.onSubscribe}
        onImageLoad={this.onImageLoad}
        onLoadMoreEpisodes={this.onLoadMoreEpisodes}
        {...this.props}
        {...this.state}
      />
    );
  }
}

export default withRouter(DetailViewModel);
