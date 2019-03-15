import React, { Component } from "react";
import DataManager from "../../api/DataManager";
import { PodcastEpisode } from "../../utility/types";
import { Listen } from "../../models/Listen";

interface IProps {
  api: DataManager;
  currentEpisode: PodcastEpisode;
  isMobile: boolean;
  onPodcastFinished: () => void;
}

interface IState {
  audioElement: HTMLAudioElement;
  isPaused: boolean;
  isImageLoaded: boolean;
  progress: number;
  volume: number;
}

export default class PlayerViewModel extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    let volume = props.isMobile ? 1 : 0.3;

    let audioObject = document.createElement("audio");
    audioObject.loop = false;
    audioObject.volume = volume;
    audioObject.ontimeupdate = () => this.onHandleTimeUpdate();
    audioObject.onended = this.onPlaybackFinished;

    this.state = {
      audioElement: audioObject,
      isPaused: true,
      isImageLoaded: false,
      volume: volume,
      progress: 0
    };
  }

  /**
   * Called when playback is finished.
   */
  private onPlaybackFinished = async () => {
    const { onPodcastFinished } = this.props;

    await this.setListenInfo();
    onPodcastFinished();
  };

  /**
   * Sets the listen info of the current episode.
   */
  private setListenInfo = async () => {
    const { audioElement } = this.state;
    const { api, currentEpisode } = this.props;

    var currentTime = Math.round(audioElement.currentTime);
    var duration = Math.round(audioElement.duration);

    var info = Listen.fromPodcastEpisode(currentEpisode);
    info.time = currentTime;
    info.duration = duration;
    info.isCompleted = currentTime == duration;

    await api.setListenInfo(info);
  };

  /**
   * Sets the media metadata to the browser.
   */
  private setMediaMetadata = async () => {
    const { currentEpisode } = this.props;

    if ("mediaSession" in navigator) {
      // @ts-ignore
      navigator.mediaSession.metadata = new MediaMetadata({
        title: currentEpisode.title,
        artist: currentEpisode.author,
        artwork: [{ src: currentEpisode.imageUrl, type: "image/png" }]
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
    const { currentEpisode } = this.props;

    audioElement.src = currentEpisode.content;
    audioElement.onloadeddata = () => {
      if (currentEpisode.time) {
        audioElement.currentTime = currentEpisode.time;
        this.setState({ progress: currentEpisode.time });
      }
    };

    audioElement.load();
    if (autoplay) audioElement.play().then(this.setMediaMetadata);
    this.setState({ isPaused: !autoplay });
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

  private onRewind = () => {
    const { audioElement } = this.state;

    const progress = audioElement.currentTime - 10;
    audioElement.currentTime = progress;
    this.setState({ progress: Math.max(0, progress) });
  };
}
