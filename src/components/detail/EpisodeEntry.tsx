import React, { Component } from "react";
import {
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Typography,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText
} from "@material-ui/core";
import { PlayArrow, Stop, VerticalAlignBottom } from "@material-ui/icons";
import { PodcastEpisode } from "../../utility/types";
import moment from "moment";

/**
 * CSS styles for the entry.
 */
const styles = {
  button: {
    width: 32,
    height: 32,
    padding: 0
  }
};

/**
 * Required properties for the episode entry.
 */
interface IEpisodeProps {
  episode: PodcastEpisode; //Episode the component represents.
  selectedEpisode: PodcastEpisode | null; //The currently playing episode.
  onEpisodeSelected: (episode: PodcastEpisode | null) => void; //Called when the entry has been selected.
}

/**
 * State information for the episode entry.
 */
interface IEpisodeState {}

/**
 * Contains title, description and details for a specific episode item.
 */
class EpisodeEntry extends Component<IEpisodeProps, IEpisodeState> {
  /**
   * Called when an episode is selected, either setting the episode to null
   *  or the selected episode depending on what is currently playing.
   */
  onEpisodeSelect = () => {
    const { episode, onEpisodeSelected, selectedEpisode } = this.props;

    let selectedItem =
      episode.content == (selectedEpisode != null && selectedEpisode.content)
        ? null
        : episode;
    onEpisodeSelected(selectedItem);
  };

  render() {
    const { episode, selectedEpisode } = this.props;

    //Toggles between a stop button or play button depending if the
    // current episode matches the object being represented.
    let icon =
      episode.content ==
      (selectedEpisode != null && selectedEpisode.content) ? (
        <Stop />
      ) : (
        <PlayArrow />
      );

    const timeLeft = moment("2015-01-01")
      .startOf("day")
      .seconds(episode.duration - episode.time)
      .format("H:mm:ss");

    const description = (
      <span>
        {episode.storeLocally ? "Local" : ""}
        {episode.storeLocally && episode.time ? " • " : ""}
        {episode.time != 0 ? timeLeft + " remaining" : ""}
      </span>
    );

    return (
      <ListItem divider>
        <IconButton
          style={styles.button}
          onClick={e => {
            this.onEpisodeSelect();
            e.stopPropagation();
          }}
        >
          {icon}
        </IconButton>
        <ListItemText primary={episode.title} secondary={description} />
      </ListItem>
    );
  }
}

export default EpisodeEntry;
