import React, { Component } from "react";
import { PodcastEpisode } from "../../../utility/types";
import {
  ListItem,
  IconButton,
  Typography,
  ListItemText,
  ListItemSecondaryAction,
  Menu,
  MenuItem
} from "@material-ui/core";
import { PlayArrow, Stop, MoreVert } from "@material-ui/icons";

const styles = {
  button: {
    width: 32,
    height: 32,
    padding: 0
  }
};

interface IProps {
  episode: PodcastEpisode;
  currentEpisode: PodcastEpisode | null;
  description: string;
  releaseDate: string;
  menuElement: any;
  onSelect: () => void;
  onSubscribe: () => void;
  onMenuOpen: (element: any) => void;
  onMenuClose: () => void;
  onListenStatusChanged: () => void;
}

export default class EpisodeEntryView extends Component<IProps> {
  /**
   * Called when an episode has been selected.
   */
  private onEpisodeSelect = (event: any) => {
    const { onSelect } = this.props;

    onSelect();
    event.stopPropagation();
  };

  render() {
    const {
      episode,
      currentEpisode,
      releaseDate,
      description,
      menuElement,
      onMenuOpen,
      onMenuClose,
      onListenStatusChanged
    } = this.props;

    //Indicates if this episode is the current episode.
    const isCurrentEpisode =
      episode.content == (currentEpisode && currentEpisode.content);

    //Play/Pause icon.
    const icon = isCurrentEpisode ? <Stop /> : <PlayArrow />;

    //Color of the episode title text.
    const tileColor = episode.isCompleted ? "textSecondary" : "textPrimary";

    //Title of the episode.
    const episodeName = (
      <React.Fragment>
        <Typography color="textSecondary">{releaseDate}</Typography>
        <Typography color={tileColor}>{episode.title}</Typography>
      </React.Fragment>
    );

    //Menu item text.
    const menuText = episode.isCompleted
      ? "Mark as Unplayed"
      : "Mark as Played";

    //Menu list for episode control.
    const menu = (
      <Menu
        open={Boolean(menuElement)}
        anchorEl={menuElement}
        onClose={onMenuClose}
      >
        <MenuItem onClick={onListenStatusChanged}>{menuText}</MenuItem>
      </Menu>
    );

    return (
      <ListItem>
        <IconButton style={styles.button} onClick={this.onEpisodeSelect}>
          {icon}
        </IconButton>
        <ListItemText primary={episodeName} secondary={description} />
        <ListItemSecondaryAction>
          <IconButton onClick={onMenuOpen}>
            <MoreVert />
          </IconButton>
        </ListItemSecondaryAction>
        {menu}
      </ListItem>
    );
  }
}
