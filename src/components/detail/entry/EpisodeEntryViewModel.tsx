import React, { Component } from "react";
import EpisodeEntryView from "./EpisodeEntryView";
import { PodcastEpisode } from "../../../utility/types";
import moment from "moment";

interface IProps {
  episode: PodcastEpisode;
  currentEpisode: PodcastEpisode | null;
  onSubscribe: () => void;
  onEpisodeSelected: (episode: PodcastEpisode | null) => void;
  onListenStatusChanged: (episode: PodcastEpisode) => void;
}

interface IState {
  menuTarget: any;
}

export default class EpisodeEntryViewModel extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      menuTarget: null
    };
  }

  /**
   * Called when the episode has been selected.
   */
  private onSelectedEpisode = () => {
    const { onEpisodeSelected, currentEpisode, episode } = this.props;

    var selected = currentEpisode == episode ? null : episode;
    onEpisodeSelected(selected);
  };

  /**
   * Called when the listen status has changed.
   */
  private onListenStatusChanged = () => {
    const { episode, onListenStatusChanged } = this.props;

    episode.isCompleted = !episode.isCompleted;
    episode.time = episode.isCompleted ? episode.duration : 0;
    onListenStatusChanged(episode);
  };

  /**
   * Called when the more menu has been opened.
   */
  private onMenuOpen = (menuTarget: any) => {
    this.setState({ menuTarget });
  };

  /**
   * Called when the more menu has been closed
   */
  private onMenuClose = () => {
    this.setState({ menuTarget: null });
  };

  /**
   * Gets the description text for the episode.
   */
  private getDescriptionText = (): string => {
    const { episode } = this.props;

    const timeLeft = moment("2015-01-01")
      .startOf("day")
      .seconds(episode.duration - episode.time)
      .format("H:mm:ss");

    var description = "";

    if (episode.isCompleted) {
      description = "Played";
    } else if (episode.time != 0 && !episode.isCompleted) {
      description = timeLeft + " remaining";
    }

    return description;
  };

  /**
   * Returns a text formatted date for the current podcast.
   */
  private getReleaseDateText = (): string => {
    const { episode } = this.props;

    const date = moment(episode.publishingDate);

    return moment().year() != date.year()
      ? date.format("DD MMMM YYYY")
      : date.format("DD MMMM");
  };

  render() {
    const { episode, currentEpisode, onSubscribe } = this.props;
    const { menuTarget } = this.state;

    return (
      <EpisodeEntryView
        episode={episode}
        description={this.getDescriptionText()}
        releaseDate={this.getReleaseDateText()}
        menuElement={menuTarget}
        currentEpisode={currentEpisode}
        onSelect={this.onSelectedEpisode}
        onSubscribe={onSubscribe}
        onListenStatusChanged={this.onListenStatusChanged}
        onMenuOpen={this.onMenuOpen}
        onMenuClose={this.onMenuClose}
      />
    );
  }
}
