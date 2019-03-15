import React, { Component } from "react";
import { IconButton, Fab } from "@material-ui/core";
import { Replay10, Forward30, PlayArrow, Pause } from "@material-ui/icons";
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

    return (
      <React.Fragment>
        <div className="image player-left">
          {imageUrl != null && !isMobile && (
            <img alt="podcast-logo" src={imageUrl} />
          )}
        </div>
        )}
        <div className="player-controls">
          <IconButton className="icon" onClick={onRewind}>
            <Replay10 />
          </IconButton>

          <Fab size={fabSize} color="primary" onClick={onTogglePlaying}>
            {isPaused ? <PlayArrow /> : <Pause />}
          </Fab>

          <IconButton className="icon" onClick={onForward}>
            <Forward30 />
          </IconButton>
        </div>
      </React.Fragment>
    );
  }
}
