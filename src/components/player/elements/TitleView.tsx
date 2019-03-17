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

    const info = (
      <React.Fragment>
        <span className="episode episode-title">{podcastName}</span>

        <div className="title">
          <span className="podcast-title">
            <Link
              to={Podcast.getDetailUrl(rssUrl)}
              style={{ textDecoration: "none" }}
            >
              <Typography color="textSecondary">{author}</Typography>
            </Link>
          </span>
        </div>
      </React.Fragment>
    );

    const seek = (
      <div className="seek-bar">
        <Slider min={0} max={duration} value={progress} onChange={onSeek} />
        <Typography style={{ fontSize: 12, float: "left", left: 0 }}>
          {formatTime(progress)}
        </Typography>

        <Typography style={{ fontSize: 12, float: "right", right: 0 }}>
          {formatTime(isNaN(duration) ? 0 : duration)}
        </Typography>
      </div>
    );

    return (
      <div className="player-center no-wrap">
        {info}
        {seek}
      </div>
    );
  }
}
