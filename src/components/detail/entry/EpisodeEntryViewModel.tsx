import React, { Component } from "react";
import EpisodeEntryView from "./EpisodeEntryView";
import moment from "moment";
import { PodcastEpisode } from "../../../models/PodcastEpisode";
import EpisodeInfoDialog from "../EpisodeInfoDialog";

interface IProps {
  episode: PodcastEpisode;
  currentEpisode: PodcastEpisode | null;
  onSubscribe: () => void;
  onEpisodeSelected: (episode: PodcastEpisode | null) => void;
  onListenStatusChanged: (episode: PodcastEpisode) => void;
}

interface IState {
  menuElement: any;
  infoDialogOpen: boolean;
}

export default class EpisodeEntryViewModel extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      menuElement: null,
      infoDialogOpen: false
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

    console.log("Setting is listened: " + !episode.isCompleted);

    episode.isCompleted = !episode.isCompleted;
    episode.time = episode.isCompleted ? episode.duration : 0;
    onListenStatusChanged(episode);
    this.onMenuClose();
  };

  /**
   * Called when the more menu has been opened.
   */
  private onMenuOpen = (event: any) => {
    this.setState({ menuElement: event.currentTarget });
  };

  /**
   * Called when the more menu has been closed
   */
  private onMenuClose = () => {
    this.setState({ menuElement: null });
  };

  /**
   * Called when the info pane is opened.
   */
  private onOpenInfo = () => {
    this.setState({ infoDialogOpen: true });
  };

  /**
   * Called when the info pane is closed.
   */
  private onCloseInfo = () => {
    this.setState({ infoDialogOpen: false });
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
    const { infoDialogOpen } = this.state;

    return (
      <div>
        <EpisodeEntryView
          {...this.props}
          {...this.state}
          description={this.getDescriptionText()}
          releaseDate={this.getReleaseDateText()}
          onSelect={this.onSelectedEpisode}
          onListenStatusChanged={this.onListenStatusChanged}
          onMenuOpen={this.onMenuOpen}
          onMenuClose={this.onMenuClose}
          onOpenInfo={this.onOpenInfo}
        />

        {infoDialogOpen && (
          <EpisodeInfoDialog {...this.props} onClose={this.onCloseInfo} />
        )}
      </div>
    );
  }
}
