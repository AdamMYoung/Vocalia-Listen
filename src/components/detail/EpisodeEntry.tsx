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
import { PodcastEpisode, Listen } from "../../utility/types";
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
  onUpdateEpisode: (listen: Listen) => void; //Updates the listen episode.
}

/**
 * State information for the episode entry.
 */
interface IEpisodeState {
  menuElement: any | null;
  timeLeft: string;
  releaseDate: string;
}

/**
 * Contains title, description and details for a specific episode item.
 */
class EpisodeEntry extends Component<IEpisodeProps, IEpisodeState> {
  constructor(props: IEpisodeProps) {
    super(props);

    const episode = props.episode;

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

    this.state = {
      menuElement: null,
      releaseDate: releaseDate,
      timeLeft: timeLeft
    };
  }

  /**
   * Called when an episode is selected, either setting the episode to null
   *  or the selected episode depending on what is currently playing.
   */
  private onEpisodeSelect = () => {
    const { episode, onEpisodeSelected, selectedEpisode } = this.props;

    let selectedItem =
      episode.content == (selectedEpisode != null && selectedEpisode.content)
        ? null
        : episode;
    onEpisodeSelected(selectedItem);
  };

  /**
   * Sets the episode as played in the database.
   */
  onSetPlayed = async () => {
    const {
      onUpdateEpisode,
      onEpisodeSelected,
      episode,
      selectedEpisode
    } = this.props;

    if (selectedEpisode) {
      if (episode.content == selectedEpisode.content) onEpisodeSelected(null);
    }

    await onUpdateEpisode({
      rssUrl: episode.rssUrl,
      episodeUrl: episode.content,
      episodeName: episode.title,
      isCompleted: true,
      time: episode.duration,
      duration: episode.duration
    } as Listen);

    this.handleClose();
  };

  /**
   * Sets the episode as unplayed in the database.
   */
  onSetUnplayed = async () => {
    const { onUpdateEpisode, episode } = this.props;

    await onUpdateEpisode({
      rssUrl: episode.rssUrl,
      episodeUrl: episode.content,
      episodeName: episode.title,
      isCompleted: false,
      time: 0,
      duration: 0
    } as Listen);

    this.handleClose();
  };

  /**
   * Handles the click of a menu item.
   */
  private handleClick = (event: any) => {
    this.setState({ menuElement: event.currentTarget });
  };

  /**
   * Handles the closing of a menu item.
   */
  private handleClose = () => {
    this.setState({ menuElement: null });
  };

  render() {
    const { episode, selectedEpisode } = this.props;
    const { menuElement, timeLeft, releaseDate } = this.state;

    //Toggles between a stop button or play button depending if the
    // current episode matches the object being represented.
    let icon =
      episode.content ==
      (selectedEpisode != null && selectedEpisode.content) ? (
        <Stop />
      ) : (
        <PlayArrow />
      );

    //Podcast description such as current playback time and played status.
    const description = (
      <span>
        {episode.isCompleted ? "Played" : ""}
        {episode.time != 0 && !episode.isCompleted
          ? timeLeft + " remaining"
          : ""}
      </span>
    );

    //Menu list for episode control.
    const menu = (
      <Menu
        open={Boolean(menuElement)}
        anchorEl={menuElement}
        onClose={this.handleClose}
      >
        {!episode.isCompleted ? (
          <MenuItem onClick={this.onSetPlayed}>Mark as Played</MenuItem>
        ) : (
          <MenuItem onClick={this.onSetUnplayed}>Mark as Unplayed</MenuItem>
        )}
      </Menu>
    );

    return (
      <ListItem divider>
        {!episode.isCompleted && (
          <IconButton
            style={styles.button}
            onClick={e => {
              this.onEpisodeSelect();
              e.stopPropagation();
            }}
          >
            {icon}
          </IconButton>
        )}

        <ListItemText
          primary={
            <React.Fragment>
              <Typography color="textSecondary">{releaseDate}</Typography>
              <Typography
                color={episode.isCompleted ? "textSecondary" : "textPrimary"}
              >
                {episode.title}
              </Typography>
            </React.Fragment>
          }
          secondary={description}
        />
        <ListItemSecondaryAction>
          <div>
            <IconButton onClick={this.handleClick}>
              <MoreVert />
            </IconButton>
            {menu}
          </div>
        </ListItemSecondaryAction>
      </ListItem>
    );
  }
}

export default EpisodeEntry;
