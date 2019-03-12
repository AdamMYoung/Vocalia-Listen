import React, { PureComponent } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Card,
  Button,
  Typography,
  Fade,
  List
} from "@material-ui/core";
import { PodcastFeed, PodcastEpisode, Podcast } from "../../utility/types";
import EpisodeEntry from "./EpisodeEntry";
import { removeTags } from "../../utility/FormatUtils";
import DataManager from "../../api/DataManager";

/**
 * Properties required for the detail modal window.
 */
interface IDetailProps {
  api: DataManager; //Class to manage I/O of API data.
  rssFeed: string; //Feed to load.
  open: boolean; //External control for dialog visibility.
  isMobile: boolean; //Indicates if the device is a mobile device.
  isAuthenticated: boolean; // Indicates if the user is authenticated.
  selectedEpisode: PodcastEpisode | null; //The currently playing episode.
  onClose: () => void; //Called when the dialog requests to be closed.
  onEpisodeSelected: (episode: PodcastEpisode | null) => void; //Called when an episode isselected.
}

/**
 * State information for the detail modal window.
 */
interface IDetailState {
  feed: PodcastFeed; //Currently loaded feed.
  visibleEpisodes: number; //Number of visible episodes.
  loading: boolean; //Indicates the feed is loading.
  imageLoaded: boolean; //Indicates if the image has loaded.
  isSubscribed: boolean; //Indicates if the user has subscribed to the current podcast.
}

/**
 * Modal window displaying title, description and episode information for a specific podcast.
 */
class PodcastDetail extends PureComponent<IDetailProps, IDetailState> {
  constructor(props: IDetailProps) {
    super(props);

    this.state = {
      feed: {} as PodcastFeed,
      visibleEpisodes: 20,
      loading: true,
      imageLoaded: false,
      isSubscribed: false
    };
  }

  /**
   * Loads the RSS feed from the passed props.
   */
  componentWillMount = () => {
    this.loadRss();
  };

  /**
   * Reloads the RSS feed if the user login status has changed.
   * @param prevProps Previous props.
   */
  componentDidUpdate(prevProps: IDetailProps) {
    if (this.props.api.accessToken != prevProps.api.accessToken) {
      this.loadRss();
    }
  }

  /**
   * Reloads the RSS feed from the API.
   */
  private loadRss = async () => {
    const { rssFeed, api } = this.props;

    if (rssFeed !== null) {
      this.setState({ loading: true });
      await api.parsePodcastFeed(rssFeed, feed => {
        if (feed)
          this.setState({
            feed: feed,
            loading: false,
            isSubscribed: feed.isSubscribed
          });
      });
    }
  };

  /**
   * Called when the subscribe button has been clicked.
   */
  onSubscribeClick = async () => {
    const { isSubscribed, feed } = this.state;
    const { api, rssFeed } = this.props;

    if (isSubscribed) {
      await api.deleteSubscription(rssFeed);
      this.setState({ isSubscribed: false });
    } else {
      await api.addSubscription({
        title: feed.title,
        rssUrl: feed.link,
        imageUrl: feed.imageUrl,
        isSubscribed: true
      });
      this.setState({ isSubscribed: true });
    }
  };

  render() {
    const {
      feed,
      visibleEpisodes,
      loading,
      imageLoaded,
      isSubscribed
    } = this.state;
    const {
      open,
      onClose,
      onEpisodeSelected,
      selectedEpisode,
      isMobile,
      isAuthenticated
    } = this.props;

    let button = isSubscribed ? (
      <Button
        variant="contained"
        color="secondary"
        onClick={() => this.onSubscribeClick()}
      >
        Unsubscribe
      </Button>
    ) : (
      <Button
        variant="contained"
        color="primary"
        onClick={() => this.onSubscribeClick()}
      >
        Subscribe
      </Button>
    );

    return (
      <Dialog open={open} onClose={onClose} fullScreen={isMobile} maxWidth="md">
        {/* Requires a nested dialog to have the two stage screen dim and fade in on content load */}
        <Dialog
          open={!loading && this.props.open}
          onClose={onClose}
          fullScreen={isMobile}
          maxWidth="md"
        >
          {!loading && (
            <React.Fragment>
              <DialogTitle disableTypography={true}>
                <Typography component={"span"}>
                  <div style={{ display: "flex", maxHeight: 250 }}>
                    <Fade in={imageLoaded}>
                      <div style={{ height: 80, width: 80, paddingTop: 16 }}>
                        <img
                          src={feed.imageUrl}
                          onLoad={() => this.setState({ imageLoaded: true })}
                        />
                      </div>
                    </Fade>

                    <div
                      style={{
                        display: "inline",
                        paddingLeft: 15,
                        maxHeight: 250
                      }}
                    >
                      <h2>{feed.title}</h2>
                      <p style={{ overflow: "auto", maxHeight: 200 }}>
                        {removeTags(feed.description)}
                      </p>
                    </div>
                  </div>
                </Typography>
                <div style={{ marginTop: "20px" }}>
                  {isAuthenticated && button}
                </div>
              </DialogTitle>
              <DialogContent style={{ paddingTop: 5 }}>
                <List>
                  {/* Episodes */}
                  {feed.items != null &&
                    feed.items
                      .slice(0, visibleEpisodes)
                      .map(item => (
                        <EpisodeEntry
                          key={item.content}
                          episode={item}
                          selectedEpisode={selectedEpisode}
                          onEpisodeSelected={(episode: PodcastEpisode | null) =>
                            onEpisodeSelected(episode)
                          }
                        />
                      ))}
                </List>

                {/* Load more button */}
                {visibleEpisodes < feed.items.length && (
                  <Button
                    onClick={() =>
                      this.setState(oldState => ({
                        visibleEpisodes: oldState.visibleEpisodes + 20
                      }))
                    }
                    color="primary"
                  >
                    Load More...
                  </Button>
                )}
              </DialogContent>

              {/* Close button */}
              {!loading && (
                <DialogActions>
                  <Button onClick={this.props.onClose} color="primary">
                    Close
                  </Button>
                </DialogActions>
              )}
            </React.Fragment>
          )}
        </Dialog>
      </Dialog>
    );
  }
}

export default PodcastDetail;
