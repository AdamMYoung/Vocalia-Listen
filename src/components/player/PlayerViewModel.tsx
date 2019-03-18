import React, { Component } from "react";
import DataManager from "../../data/api/DataManager";
import { Listen } from "../../models/Listen";
import PlayerView from "./PlayerView";
import { PodcastEpisode } from "../../models/PodcastEpisode";

interface IProps {
  api: DataManager;
  episode: PodcastEpisode | null;
  isMobile: boolean;
  isAuthenticated: boolean;
  onEpisodeSelected: (episode: PodcastEpisode | null) => void;
}

interface IState {
  audioElement: HTMLAudioElement;
  isPaused: boolean;
  progress: number;
  volume: number;
  duration: number;
}

const UPDATE_FREQUENCY_SECONDS = 2;

export default class PlayerViewModel extends Component<IProps, IState> {
  lastUpdateTime: number = 0;

  constructor(props: IProps) {
    super(props);

    let volume = props.isMobile ? 1 : 0.3;

    let audioObject = document.createElement("audio");
    audioObject.loop = false;
    audioObject.volume = volume;
    audioObject.onended = this.onPlaybackFinished;
    audioObject.ontimeupdate = this.onProgressChanged;

    this.state = {
      audioElement: audioObject,
      isPaused: true,
      volume: volume,
      progress: 0,
      duration: 0
    };
  }

  /**
   * Player loaded for the first time.
   */
  componentWillMount() {
    this.setupPodcast(false);
  }

  /**
   * Called when the player episode or duration changes.
   * @param oldProps Old properties of the player
   */
  componentDidUpdate(oldProps: IProps) {
    const { audioElement } = this.state;
    var newEpisode = this.props.episode;
    var oldEpisode = oldProps.episode;

    if (!oldEpisode) {
      this.setupPodcast(false);
    } else if (!newEpisode) {
      audioElement.pause();
    } else if (newEpisode.content != oldEpisode.content) {
      this.setupPodcast(true);
    }
  }

  /**
   * Called when playback is finished.
   */
  private onPlaybackFinished = async () => {
    const { onEpisodeSelected } = this.props;

    await this.setListenInfo();
    onEpisodeSelected(null);
  };

  /**
   * Sets the listen info of the current episode.
   */
  private setListenInfo = async () => {
    const { audioElement } = this.state;
    const { api, episode } = this.props;

    var currentTime = Math.round(audioElement.currentTime);
    var duration = Math.round(audioElement.duration);

    if (
      episode &&
      currentTime > this.lastUpdateTime + UPDATE_FREQUENCY_SECONDS
    ) {
      this.lastUpdateTime = currentTime;
      var info = Listen.fromPodcastEpisode(episode);
      info.time = currentTime;
      info.duration = duration;
      info.isCompleted = currentTime == duration;

      await api.setListenInfo(info);
    }
  };

  /**
   * Sets the media metadata to the browser.
   */
  private setMediaMetadata = async () => {
    const { episode } = this.props;

    if ("mediaSession" in navigator && episode) {
      // @ts-ignore
      navigator.mediaSession.metadata = new MediaMetadata({
        title: episode.title,
        artist: episode.author,
        artwork: [{ src: episode.imageUrl, type: "image/png" }]
      });

      // @ts-ignore
      navigator.mediaSession.setActionHandler("play", this.onTogglePause);
      // @ts-ignore
      navigator.mediaSession.setActionHandler("pause", this.onTogglePause);
      // @ts-ignore
      navigator.mediaSession.setActionHandler("previoustrack", this.onRewind);
      // @ts-ignore
      navigator.mediaSession.setActionHandler("nexttrack", this.onForward);
    }
  };

  /**
   * Loads the current podcast into memory.
   */
  private setupPodcast = (autoplay: boolean) => {
    const { audioElement } = this.state;
    const { episode } = this.props;

    if (episode) {
      audioElement.src = episode.content;

      audioElement.onloadeddata = this.onLoadedData;
      audioElement.load();

      if (autoplay) audioElement.play().then(this.setMediaMetadata);
      this.setState({ isPaused: !autoplay });
    }
  };

  /**
   * Sets the start position of the media player.
   */
  private onLoadedData = async () => {
    const { audioElement } = this.state;
    const { episode, api } = this.props;

    if (episode) {
      await api.getListenInfo(episode.content, info => {
        if (info && info.time)
          this.setState({ progress: audioElement.currentTime = info.time });
        else this.setState({ progress: audioElement.currentTime = 0 });
      });
    }

    this.setState({ duration: audioElement.duration });
  };

  /**
   * Called on a fast forward selection.
   */
  private onForward = () => {
    const { audioElement } = this.state;

    const progress = audioElement.currentTime + 30;
    audioElement.currentTime = progress;
    this.setState({ progress });
  };

  /**
   * Calld on a rewind selection.
   */
  private onRewind = () => {
    const { audioElement } = this.state;

    const progress = audioElement.currentTime - 10;
    audioElement.currentTime = progress;
    this.setState({ progress: Math.max(0, progress) });
  };

  /**
   * Called when play/pause is toggled.
   */
  private onTogglePlaying = () => {
    const { audioElement, isPaused } = this.state;

    if (isPaused) audioElement.play().then(this.setMediaMetadata);
    else audioElement.pause();

    this.setState({ isPaused: !isPaused });
  };

  /**
   * Called when a seek has occured.
   */
  private onSeek = (e: any, progress: number) => {
    const { audioElement } = this.state;

    if (progress <= audioElement.duration) {
      this.setState({ progress });
      audioElement.currentTime = progress;
    }
  };

  /**
   * Called when the volume changes.
   */
  private onVolumeChanged = (e: any, volume: number) => {
    const { audioElement } = this.state;

    this.setState({ volume });
    audioElement.volume = volume;
  };

  /**
   * Called when the playback progress changes.
   */
  private onProgressChanged = () => {
    const { audioElement } = this.state;

    if (audioElement.currentTime < this.lastUpdateTime) {
      this.lastUpdateTime = audioElement.currentTime;
    }

    this.setState({ progress: audioElement.currentTime });
    this.setListenInfo();
  };

  render() {
    return (
      <PlayerView
        onPlaybackFinished={this.onPlaybackFinished}
        onForward={this.onForward}
        onRewind={this.onRewind}
        onTogglePlaying={this.onTogglePlaying}
        onSeek={this.onSeek}
        onVolumeChanged={this.onVolumeChanged}
        {...this.props}
        {...this.state}
      />
    );
  }
}
