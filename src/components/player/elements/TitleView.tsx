import React, { Component } from "react";
import { Podcast } from "../../../models/Podcast";
import { Typography } from "@material-ui/core";
import { formatTime } from "../../../utility/FormatUtils";
import Slider from "@material-ui/lab/Slider";
import { Link } from "react-router-dom";
import "../PlayerView.css";

interface IProps {
  isMobile: boolean;
  title: string;
  author: string;
  rssUrl: string;
  duration: number;
  progress: number;
  onSeek: (e: any, v: number) => void;
}

export default class TitleView extends Component<IProps> {
  render() {
    const {
      isMobile,
      title,
      author,
      rssUrl,
      duration,
      progress,
      onSeek
    } = this.props;

    const podcastName = isMobile ? (
      <Typography component="p" style={{ fontWeight: 550 }}>
        {title}
      </Typography>
    ) : (
      <Typography component="h6" variant="h6" style={{ fontSize: 18 }}>
        {title}
      </Typography>
    );

    return (
      <div className="player-center no-wrap">
        <div className="episode">
          <span className="episode-title">{podcastName}</span>
        </div>

        <div className="title">
          <span className="podcast-title">
            <Link
              to={Podcast.getDetailUrl(rssUrl)}
              style={{ textDecoration: "none" }}
            >
              <Typography component="p" color="textSecondary">
                {author}
              </Typography>
            </Link>
          </span>
        </div>

        <div className="seek-bar">
          <Slider min={0} max={duration} value={progress} onChange={onSeek} />
          <span className="time-text current-time">{formatTime(progress)}</span>

          <span className="time-text time-remaining">
            {formatTime(isNaN(duration) ? 0 : duration)}
          </span>
        </div>
      </div>
    );
  }
}
