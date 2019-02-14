import React, { PureComponent } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Card,
  Button,
  Typography,
  Fade
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
  onEpisodeSelected: (episode: PodcastEpisode) => void; //Called when an episode isselected.
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
   * Updates the detail dialog. Only refreshes if the RSS URL has changed to prevent unnecessary re-renders.
   */
  componentWillMount = async () => {
    const { rssFeed, api } = this.props;

    if (rssFeed !== null) {
      this.setState({ loading: true });
      let feed = await api.parsePodcastFeed(rssFeed);

      if (feed)
        this.setState({
          feed: feed,
          loading: false,
          isSubscribed: feed.isSubscribed
        });
    }
  };

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
      <Card
        style={{
          height: window.outerHeight,
          width: window.outerWidth,
          margin: -100
        }}
      >
        <Dialog
          open={open}
          onClose={onClose}
          fullScreen={isMobile}
          maxWidth="md"
        >
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
                    <div style={{ display: "flex" }}>
                      <Fade in={imageLoaded}>
                        <div style={{ height: 80, width: 80, paddingTop: 16 }}>
                          <img
                            src={feed.imageUrl}
                            onLoad={() => this.setState({ imageLoaded: true })}
                          />
                        </div>
                      </Fade>

                      <div style={{ display: "inline", paddingLeft: 15 }}>
                        <h2>{feed.title}</h2>
                        <p>{removeTags(feed.description)}</p>
                      </div>
                    </div>
                  </Typography>
                  {isAuthenticated && button}
                </DialogTitle>
                <DialogContent style={{ paddingTop: 5 }}>
                  {/* Episodes */}
                  {feed.items != null &&
                    feed.items
                      .slice(0, visibleEpisodes)
                      .map(item => (
                        <EpisodeEntry
                          key={item.content}
                          episode={item}
                          selectedEpisode={selectedEpisode}
                          onEpisodeSelected={(episode: PodcastEpisode) =>
                            onEpisodeSelected(episode)
                          }
                        />
                      ))}

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
      </Card>
    );
  }
}

export default PodcastDetail;
