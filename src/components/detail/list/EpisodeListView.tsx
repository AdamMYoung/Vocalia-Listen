import React, { Component } from "react";
import "./EpisodeListView.css";
import { Typography, List } from "@material-ui/core";
import EpisodeEntryViewModel from "../entry/EpisodeEntryViewModel";
import { PodcastEpisode } from "../../../models/PodcastEpisode";

interface IProps {
  title: string;
  episodes: PodcastEpisode[];
  currentEpisode: PodcastEpisode | null;
  onSubscribe: () => void;
  onEpisodeSelected: (episode: PodcastEpisode | null) => void;
  onListenStatusChanged: (episode: PodcastEpisode) => void;
}

export default class EpisodeListView extends Component<IProps> {
  render() {
    const { title, episodes } = this.props;

    return (
      <div className="list-title">
        <Typography variant="h6">{title}</Typography>
        <List>
          {episodes.map(episode => (
            <EpisodeEntryViewModel
              key={episode.content}
              episode={episode}
              {...this.props}
            />
          ))}
        </List>
      </div>
    );
  }
}
