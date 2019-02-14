import React, { PureComponent } from "react";
import { IconButton, Fab, Card, Typography, Fade } from "@material-ui/core";
import {
  Forward30,
  Replay10,
  PlayArrow,
  Pause,
  VolumeUp
} from "@material-ui/icons";
import Slider from "@material-ui/lab/Slider";
import "./MediaPlayer.css";
import { Listen, MediaState } from "../../utility/types";
import { formatTime } from "../../utility/FormatUtils";
import { Link } from "react-router-dom";
import DataManager from "../../api/DataManager";

/**
 * Required properties for the player.
 */
interface IPlayerProps {
  media: MediaState; //The media to be played.
  isMobile: boolean; //Indicates if the current device is a mobile device.
  api: DataManager; //Manages the I/O of API calls.
}

/**
 * State information belonging to the player.
 */
interface IPlayerState {
  paused: boolean; //Indicates if playback has been paused.
  time: number; //The current progress of playback.
  volume: number; //Volume of playback.
  audioObject: HTMLAudioElement; //HTML Audio element for audio control.
  imageLoaded: boolean; //Indicates if the image has loaded in.
}

/**
 * Material-themed player for podcast episode objects.
 */
export default class MediaPlayer extends PureComponent<
  IPlayerProps,
  IPlayerState
> {
  /**
   * Initializes the audio object for playback.
   * @param props Required propeties.
   */
  constructor(props: IPlayerProps) {
    super(props);

    let audioObject = document.createElement("audio");
    audioObject.loop = false;
    audioObject.ontimeupdate = () => this.onHandleTimeUpdate();
    audioObject.onended = () => this.playbackFinished();

    this.state = {
      paused: true,
      time: 0,
      volume: 0.5,
      audioObject: audioObject,
      imageLoaded: false
    };
  }

  playbackFinished = () => {
    const { api } = this.props;

    api.setCurrentPodcast(null);
    this.setState({ paused: true });
  };

  /**
   * Saves the current playback position to memory.
   */
  savePlaybackPosition = () => {
    const { audioObject } = this.state;
    const { api } = this.props;
    const { episode } = this.props.media;

    let info = {
      rssUrl: episode.content,
      episodeName: episode.title,
      time: Math.round(audioObject.currentTime),
      isCompleted: false
    };

    api.setListenInfo(info);
  };

  /**
   * Loads the saved playback position from memory.
   */
  loadPlaybackPosition = async () => {
    const { audioObject } = this.state;
    const { episode } = this.props.media;

    audioObject.currentTime = episode.time;
  };

  /**
   * Called when a new episode has been selected.
   * @param props Passed properties.
   */
  componentWillReceiveProps(props: IPlayerProps) {
    const { audioObject } = this.state;
    const { episode } = this.props.media;

    if (episode.content !== audioObject.src) {
      this.initializePodcastFromProps(props);
    }
  }

  /**
   * Called before initial mounting, sets initial mobile volume state, and sets the media source.
   */
  componentWillMount() {
    const { isMobile } = this.props;
    this.setState({ imageLoaded: false });
    this.initializePodcastFromProps(this.props);

    this.setState({
      volume: isMobile ? 1 : this.state.volume
    });
  }

  /**
   * Called before unmounting, and stops the audio source from playing.
   */
  componentWillUnmount() {
    this.state.audioObject.pause();
  }

  /**
   * Loads a podacst from the props source into the player.
   */
  initializePodcastFromProps = (props: IPlayerProps) => {
    const { audioObject } = this.state;
    const { episode, autoplay } = this.props.media;

    audioObject.src = episode.content;
    audioObject.load();

    this.loadPlaybackPosition();
    if (autoplay) audioObject.play();

    this.setState({ paused: !autoplay });
  };

  /**
   * Called when a fast-forward event has occured.
   */
  onForward = () => {
    const { audioObject } = this.state;

    const currentTime = audioObject.currentTime + 30;
    audioObject.currentTime = currentTime;
    this.setState({ time: currentTime });
  };

  /**
   * Called when a rewind event has occured.
   */
  onRewind = () => {
    const { audioObject } = this.state;

    const currentTime = audioObject.currentTime - 10;
    audioObject.currentTime = currentTime;
    this.setState({ time: currentTime });
  };

  /**
   * Called when the play/pause button has been toggled.
   */
  onTogglePause = () => {
    const { audioObject } = this.state;

    if (this.state.paused) {
      audioObject.play();
      this.setState({ paused: false });
    } else {
      audioObject.pause();
      this.setState({ paused: true });
    }
  };

  /**
   * Called when a seek has occured.
   */
  onSeek = (e: any, v: number) => {
    const { audioObject } = this.state;

    if (v <= audioObject.duration) {
      this.setState({ time: v });
      audioObject.currentTime = v;
    }
  };

  /**
   * Called when the volume has changed.
   */
  onChangeVolume = (e: any, v: number) => {
    const { audioObject } = this.state;

    this.setState({ volume: v });
    audioObject.volume = v;
  };

  /**
   * Updates the current time in the component state.
   */
  onHandleTimeUpdate = () => {
    const { audioObject } = this.state;
    this.setState({ time: audioObject.currentTime });
    this.savePlaybackPosition();
  };

  render() {
    let icon = this.state.paused ? <PlayArrow /> : <Pause />;

    const { isMobile } = this.props;
    const { episode } = this.props.media;
    const { time, volume, audioObject, imageLoaded } = this.state;

    return (
      <Card
        className="player"
        style={{
          width: "100%",
          position: "sticky",
          bottom: 0
        }}
      >
        {/* Image & Playback */}
        <div className="player-left">
          {!isMobile && episode.imageUrl != null && (
            <div className="image">
              {episode.imageUrl != null}
              <Fade in={imageLoaded}>
                <img
                  alt="podcast-logo"
                  src={episode.imageUrl}
                  onLoad={() => this.setState({ imageLoaded: true })}
                />
              </Fade>
            </div>
          )}
        </div>

        <IconButton className="icon" onClick={this.onRewind}>
          <Replay10 />
        </IconButton>

        <Fab size="small" color="primary" onClick={this.onTogglePause}>
          {icon}
        </Fab>

        <IconButton className="icon" onClick={this.onForward}>
          <Forward30 />
        </IconButton>

        {/* Seek & Naming */}
        <div className="player-center">
          <div className="no-wrap">
            <div className="episode">
              <span className="episode-title">
                <Typography component="h6" variant="h6">
                  {episode.title}
                </Typography>
              </span>
            </div>

            <div className="title">
              <span className="podcast-title">
                <Link
                  to={"/detail/" + encodeURIComponent(episode.rssUrl)}
                  style={{ textDecoration: "none" }}
                >
                  <Typography component="p" color="textSecondary">
                    {episode.author}
                  </Typography>
                </Link>
              </span>
            </div>
          </div>

          <div className="seek-bar">
            <Slider
              min={0}
              max={audioObject.duration}
              value={time}
              onChange={this.onSeek}
            />
            <span className="time-text current-time">{formatTime(time)}</span>

            <span className="time-text time-remaining">
              {formatTime(
                isNaN(audioObject.duration) ? 0 : audioObject.duration
              )}
            </span>
          </div>
        </div>

        {/* Volume Control */}
        {!isMobile && (
          <div className="player-right">
            <VolumeUp className="icon" />
            <Slider
              min={0}
              max={1}
              value={volume}
              onChange={this.onChangeVolume}
            />
          </div>
        )}
      </Card>
    );
  }
}
