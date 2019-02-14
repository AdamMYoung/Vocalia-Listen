import React, { Component } from "react";
import {
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Typography,
  IconButton
} from "@material-ui/core";
import { ExpandMore, PlayArrow, Stop } from "@material-ui/icons";
import { removeTags } from "../../utility/FormatUtils";
import { PodcastEpisode } from "../../utility/types";

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
  onEpisodeSelected: (episode: PodcastEpisode) => void; //Called when the entry has been selected.
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
        ? ({ time: 0 } as PodcastEpisode)
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

    return (
      <ExpansionPanel>
        <ExpansionPanelSummary expandIcon={<ExpandMore />}>
          <IconButton
            style={styles.button}
            onClick={e => {
              this.onEpisodeSelect();
              e.stopPropagation();
            }}
          >
            {icon}
          </IconButton>
          <Typography style={{ marginTop: "7px", marginLeft: "3px" }}>
            {episode.title}
          </Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Typography>{removeTags(episode.description)}</Typography>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    );
  }
}

export default EpisodeEntry;
