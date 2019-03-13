import React, { Component } from "react";
import {
  Typography,
  IconButton,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Menu,
  MenuItem
} from "@material-ui/core";
import { PlayArrow, Stop, MoreVert } from "@material-ui/icons";
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
  isArchive: boolean; //Indicates if the episode is archived (Greater than 5 episodes old)
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
    const { episode, selectedEpisode, isArchive } = this.props;

    //Toggles between a stop button or play button depending if the
    // current episode matches the object being represented.
    let icon =
      episode.content ==
      (selectedEpisode != null && selectedEpisode.content) ? (
        <Stop />
      ) : (
        <PlayArrow />
      );

    //Time left of the podcast
    const timeLeft = moment("2015-01-01")
      .startOf("day")
      .seconds(episode.duration - episode.time)
      .format("H:mm:ss");

    //Parsed date of the episode.
    const date = moment(episode.publishingDate);

    //String formatted release date of the episode.
    const releaseDate =
      moment().year() != date.year()
        ? date.format("DD MMMM YYYY")
        : date.format("DD MMMM");

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

        <ListItemText
          primary={
            <React.Fragment>
              <Typography color="textSecondary">{releaseDate}</Typography>
              <Typography color={isArchive ? "textSecondary" : "textPrimary"}>
                {episode.title}
              </Typography>
            </React.Fragment>
          }
          secondary={description}
        />
      </ListItem>
    );
  }
}

export default EpisodeEntry;
