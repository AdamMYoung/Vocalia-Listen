import React, { Component } from "react";
import { Podcast } from "../../utility/types";
import { Grid } from "@material-ui/core";
import BrowseEntryView from "./BrowserEntryView";

interface IProps {
  podcasts: Podcast[];
}

export default class BrowserView extends Component<IProps> {
  render() {
    const { podcasts } = this.props;

    return (
      <Grid container justify="space-evenly">
        {/* If podcasts are available, display them. Otherwise, display empty entries to fill the UI */}
        {podcasts == null &&
          Array.from(Array(100).keys()).map(num => (
            <BrowseEntryView key={num} podcast={{} as Podcast} />
          ))}

        {podcasts != null &&
          podcasts.map(podcast => (
            <BrowseEntryView key={podcast.rssUrl} podcast={podcast} />
          ))}

        {podcasts != null &&
          Array.from(Array(100 - podcasts.length).keys()).map(num => (
            <BrowseEntryView key={num} podcast={null} />
          ))}
      </Grid>
    );
  }
}
