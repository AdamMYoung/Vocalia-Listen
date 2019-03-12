import React, { Component } from "react";
import { Podcast } from "../../utility/types";
import { LinkContainer } from "react-router-bootstrap";
import {
  Card,
  createStyles,
  Theme,
  withStyles,
  WithStyles,
  Fade,
  CardActionArea,
  CardMedia
} from "@material-ui/core";

/**
 * CSS Styles of the browser
 */
const styles = (theme: Theme) =>
  createStyles({
    paper: {
      [theme.breakpoints.down("sm")]: {
        height: 90,
        width: 90,
        margin: 3
      },
      [theme.breakpoints.up("md")]: {
        height: 140,
        width: 140,
        margin: 4
      }
    }
  });

/**
 * Properties for a podcast entry.
 */
interface IEntryProps extends WithStyles<typeof styles> {
  podcast: Podcast | null;
}

interface IEntryState {
  isLoaded: boolean;
}

/**
 * Single podcast entry for display in the browser.
 * @param props Properties belonging to the podcast entry.
 */
class PodcastEntry extends Component<IEntryProps, IEntryState> {
  constructor(props: IEntryProps) {
    super(props);

    this.state = {
      isLoaded: false
    };
  }

  render() {
    const { classes, podcast } = this.props;
    const { isLoaded } = this.state;

    const Entry = (
      <div className={classes.paper}>
        {podcast && (
          <Card className={classes.paper}>
            <CardActionArea>
              {podcast.imageUrl && (
                <Fade in={isLoaded} timeout={300}>
                  <CardMedia
                    component="img"
                    image={podcast.imageUrl}
                    onLoad={() => this.setState({ isLoaded: true })}
                  />
                </Fade>
              )}
            </CardActionArea>
          </Card>
        )}
      </div>
    );

    return podcast && podcast.rssUrl != null ? (
      <LinkContainer
        to={window.location.pathname + "/" + encodeURIComponent(podcast.rssUrl)}
      >
        {Entry}
      </LinkContainer>
    ) : (
      Entry
    );
  }
}

export default withStyles(styles)(PodcastEntry);
