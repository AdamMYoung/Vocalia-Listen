import React, { Component } from "react";
import { Card } from "@material-ui/core";
import ControlsView from "./elements/ControlsView";
import TitleView from "./elements/TitleView";
import VolumeView from "./elements/VolumeView";
import { PodcastEpisode } from "../../models/PodcastEpisode";
import "./PlayerView.css";

interface IProps {
  isMobile: boolean;
  episode: PodcastEpisode | null;
  volume: number;
  progress: number;
  duration: number;
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
    const { episode, isMobile, duration } = this.props;

    return episode ? (
      <Card className="player">
        <React.Fragment>
          <ControlsView imageUrl={episode.imageUrl} {...this.props} />
          <TitleView
            duration={duration}
            title={episode.title}
            author={episode.author}
            rssUrl={episode.rssUrl}
            {...this.props}
          />
        </React.Fragment>

        {!isMobile && <VolumeView {...this.props} />}
      </Card>
    ) : (
      <div />
    );
  }
}
