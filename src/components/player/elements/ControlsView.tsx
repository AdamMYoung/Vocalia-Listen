import { Fab, IconButton } from "@material-ui/core";
import { Forward30, Pause, PlayArrow, Replay10 } from "@material-ui/icons";
import React, { Component } from "react";
import "../PlayerView.css";

interface IProps {
  imageUrl: string;
  isMobile: boolean;
  isPaused: boolean;
  onForward: () => void;
  onRewind: () => void;
  onTogglePlaying: () => void;
}

export default class ControlsView extends Component<IProps> {
  render() {
    const {
      imageUrl,
      isMobile,
      isPaused,
      onForward,
      onRewind,
      onTogglePlaying
    } = this.props;

    const fabSize = isMobile ? "medium" : "small";

    const image = (
      <div className="image player-left">
        {imageUrl != null && !isMobile && (
          <img alt="podcast-logo" src={imageUrl} />
        )}
      </div>
    );

    const controls = (
      <div className="player-controls">
        <IconButton className="icon" onClick={onRewind}>
          <Replay10 />
        </IconButton>

        <Fab size={fabSize} onClick={onTogglePlaying} color="primary">
          {isPaused ? <PlayArrow /> : <Pause />}
        </Fab>

        <IconButton className="icon" onClick={onForward}>
          <Forward30 />
        </IconButton>
      </div>
    );

    return (
      <React.Fragment>
        {!isMobile && image}
        {controls}
      </React.Fragment>
    );
  }
}
