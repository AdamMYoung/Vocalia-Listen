import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import { Podcast } from "../../utility/types";
import PodcastEntry from "./PodcastEntry";

/**
 * Properties passed into the browser.
 */
interface IBrowserProps {
  podcasts: Podcast[]; //Podcast entries to display.
}

/**
 * State of the browser.
 */
interface IBrowserState {}

/**
 * Component to display and interact with podcasts passed into it.
 */
class PodcastBrowser extends Component<IBrowserProps, IBrowserState> {
  constructor(props: IBrowserProps) {
    super(props);

    this.state = {
      dialogOpen: false,
      selectedPodcast: {} as Podcast
    };
  }

  /**
   * Called when a podcast is clicked.
   */
  onPodcastClick = (podcast: Podcast) => {
    this.setState({ selectedPodcast: podcast, dialogOpen: true });
  };

  render() {
    const { podcasts } = this.props;

    return (
      <Grid container justify="space-evenly">
        {/* If podcasts are available, display them. Otherwise, display empty entries to fill the UI */}
        {podcasts == null &&
          Array.from(Array(100).keys()).map(num => (
            <PodcastEntry key={num} podcast={{} as Podcast} />
          ))}

        {podcasts != null &&
          podcasts.map(podcast => (
            <PodcastEntry key={podcast.rssUrl} podcast={podcast} />
          ))}

        {podcasts != null &&
          Array.from(Array(100 - podcasts.length).keys()).map(num => (
            <PodcastEntry key={num} podcast={{} as Podcast} />
          ))}
      </Grid>
    );
  }
}

export default PodcastBrowser;
