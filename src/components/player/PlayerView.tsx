import React, { Component } from "react";
import { Card } from "@material-ui/core";
import "./PlayerView.css";
import ControlsView from "./elements/ControlsView";
import TitleView from "./elements/TitleView";
import VolumeView from "./elements/VolumeView";
import { PodcastEpisode } from "../../models/PodcastEpisode";

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
