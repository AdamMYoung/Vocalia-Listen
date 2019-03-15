import React, { Component } from "react";
import { Card, IconButton, Fab } from "@material-ui/core";
import "./PlayerView.css";
import { PodcastEpisode } from "../../utility/types";
import { Replay10, Forward30, PlayArrow, Pause } from "@material-ui/icons";
import ControlsView from "./elements/ControlsView";
import TitleView from "./elements/TitleView";
import VolumeView from "./elements/VolumeView";

interface IProps {
  isMobile: boolean;
  episode: PodcastEpisode;
  volume: number;
  progress: number;
  isPaused: boolean;
  onPlaybackFinished: () => void;
  onForward: () => void;
  onRewind: () => void;
  onTogglePlaying: () => void;
  onSeek: (e: any, v: any) => void;
  onVolumeChanged: (e: any, v: any) => void;
}

export default class PlayerView extends Component<IProps> {
  render() {
    const { episode } = this.props;

    return (
      <Card className="player">
        <ControlsView imageUrl={episode.imageUrl} {...this.props} />
        <TitleView {...this.props.episode} {...this.props} />
        <VolumeView {...this.props} />
      </Card>
    );
  }
}
