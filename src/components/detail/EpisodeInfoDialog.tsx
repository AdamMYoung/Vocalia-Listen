import React, { Component } from "react";
import { PodcastEpisode } from "../../models/PodcastEpisode";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from "@material-ui/core";

interface IProps {
  episode: PodcastEpisode;
  onClose: () => void;
}

export default class EpisodeInfoDialog extends Component<IProps> {
  render() {
    const { episode, onClose } = this.props;

    return (
      <Dialog open onClose={onClose}>
        <DialogTitle>{episode.title}</DialogTitle>
        <DialogContent>
          <DialogContentText style={{ maxHeight: 300 }}>
            <div dangerouslySetInnerHTML={{ __html: episode.description }} />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Close</Button>
        </DialogActions>
      </Dialog>
    );
  }
}
