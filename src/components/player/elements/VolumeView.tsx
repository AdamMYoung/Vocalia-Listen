import { VolumeUp } from "@material-ui/icons";
import Slider from "@material-ui/lab/Slider";
import React, { Component } from "react";
import "../PlayerView.css";

interface IProps {
  volume: number;
  onVolumeChanged: (e: any, v: number) => void;
}

export default class VolumeView extends Component<IProps> {
  render() {
    const { volume, onVolumeChanged } = this.props;

    return (
      <div className="player-right">
        <VolumeUp color="action" className="icon" />

        <Slider min={0} max={1} value={volume} onChange={onVolumeChanged} />
      </div>
    );
  }
}
