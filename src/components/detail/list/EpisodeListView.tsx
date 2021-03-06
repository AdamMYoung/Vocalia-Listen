import { List, Typography } from "@material-ui/core";
import React, { Component } from "react";
import { PodcastEpisode } from "../../../models/PodcastEpisode";
import EpisodeEntryViewModel from "../entry/EpisodeEntryViewModel";
import "./EpisodeListView.css";

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
