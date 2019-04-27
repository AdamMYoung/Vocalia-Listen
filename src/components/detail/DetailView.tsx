import React, { Component } from "react";
import {
  Dialog,
  Fade,
  Button,
  Typography,
  DialogTitle,
  DialogContent,
  DialogActions
} from "@material-ui/core";
import { removeTags } from "../../utility/FormatUtils";
import EpisodeListView from "./list/EpisodeListView";
import { PodcastEpisode } from "../../models/PodcastEpisode";
import { PodcastFeed } from "../../models/PodcastFeed";

interface IProps {
  isMobile: boolean;
  isAuthenticated: boolean;
  isImageLoaded: boolean;
  visibleEpisodeCount: number;
  currentEpisode: PodcastEpisode | null;
  feed: PodcastFeed | null;
  onClose: () => void;
  onSubscribe: () => void;
  onImageLoad: () => void;
  onLoadMoreEpisodes: () => void;
  onListenStatusChanged: (episode: PodcastEpisode) => void;
  onEpisodeSelected: (episode: PodcastEpisode | null) => void;
}

export default class DetailView extends Component<IProps> {
  render() {
    const {
      isMobile,
      isAuthenticated,
      isImageLoaded,
      visibleEpisodeCount,
      feed,
      onClose,
      onSubscribe,
      onImageLoad,
      onLoadMoreEpisodes
    } = this.props;

    const isSubscribed = feed && feed.isSubscribed;

    //Button to toggle subscribed/unsubscribed status.
    const subscribeButton = feed && (
      <div style={{ marginTop: "20px" }}>
        <Button
          variant="contained"
          color={isSubscribed ? "secondary" : "primary"}
          onClick={onSubscribe}
        >
          {isSubscribed ? "Unsubscribe" : "Subscribe"}
        </Button>
      </div>
    );

    //Button to load more episodes into view.
    const loadMoreButton = feed && visibleEpisodeCount < feed.items.length && (
      <Button onClick={onLoadMoreEpisodes}>Load More...</Button>
    );

    //Heading of the detail view.
    const heading = feed && (
      <Typography component={"span"}>
        <div style={{ display: "flex", maxHeight: 250 }}>
          <Fade in={isImageLoaded}>
            <div style={{ height: 80, width: 80, paddingTop: 16 }}>
              <img src={feed.imageUrl} onLoad={onImageLoad} />
            </div>
          </Fade>

          <div style={{ display: "inline", paddingLeft: 15 }}>
            <h2>{feed.title}</h2>
            <p style={{ overflow: "auto", maxHeight: 200 }}>
              <div dangerouslySetInnerHTML={{ __html: feed.description }} />
            </p>
          </div>
        </div>
      </Typography>
    );

    //List of episodes belonging to the feed.
    const episodeList = feed && (
      <React.Fragment>
        {feed.items.filter(c => c.time > 0 && !c.isCompleted).length > 0 && (
          <EpisodeListView
            title="In Progress"
            episodes={feed.items.filter(c => c.time > 0 && !c.isCompleted)}
            {...this.props}
          />
        )}

        <EpisodeListView
          title="Episodes"
          episodes={feed.items
            .filter(c => c.time == 0 || c.isCompleted)
            .slice(0, visibleEpisodeCount)}
          {...this.props}
        />
      </React.Fragment>
    );

    return (
      <Dialog open={true} fullScreen={isMobile} maxWidth="md">
        <Dialog
          open={Boolean(feed)}
          onClose={onClose}
          fullScreen={isMobile}
          maxWidth="md"
        >
          <DialogTitle disableTypography={true}>
            {heading}
            {isAuthenticated && subscribeButton}
          </DialogTitle>
          <DialogContent>
            {episodeList}
            {loadMoreButton}
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose}>Close</Button>
          </DialogActions>
        </Dialog>
      </Dialog>
    );
  }
}
