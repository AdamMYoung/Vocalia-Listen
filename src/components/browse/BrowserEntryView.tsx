import React, { Component } from "react";
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
import { Podcast } from "../../models/Podcast";

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

interface IProps extends WithStyles<typeof styles> {
  podcast: Podcast | null;
}

interface IState {
  isLoaded: boolean;
}

class BrowseEntryView extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      isLoaded: false
    };
  }

  render() {
    const { classes, podcast } = this.props;
    const { isLoaded } = this.state;

    const image = (
      <Fade in={isLoaded} timeout={300}>
        {podcast && (
          <CardMedia
            component="img"
            image={podcast.imageUrl ? podcast.imageUrl : "s"}
            onLoad={() => this.setState({ isLoaded: true })}
          />
        )}
      </Fade>
    );

    const item = (
      <div className={classes.paper}>
        {podcast && (
          <Card className={classes.paper}>
            <CardActionArea>{image}</CardActionArea>
          </Card>
        )}
      </div>
    );

    return podcast ? (
      <LinkContainer to={podcast ? Podcast.getDetailUrl(podcast.rssUrl) : ""}>
        {item}
      </LinkContainer>
    ) : (
      item
    );
  }
}

export default withStyles(styles)(BrowseEntryView);
