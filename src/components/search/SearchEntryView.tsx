import React, { Component } from "react";
import {
  withStyles,
  Divider,
  ListItem,
  Theme,
  createStyles,
  ListItemText,
  WithStyles
} from "@material-ui/core";
import { LinkContainer } from "react-router-bootstrap";
import { Podcast } from "../../models/Podcast";

/**
 * CSS styles of the top AppBar.
 */
const styles = (theme: Theme) =>
  createStyles({
    image: {
      borderRadius: "3px",
      height: "50px",
      width: "50px"
    }
  });

interface IProps extends WithStyles<typeof styles> {
  podcast: Podcast;
}

class SearchEntryView extends Component<IProps> {
  render() {
    const { podcast, classes } = this.props;

    return (
      <LinkContainer to={Podcast.getDetailUrl(podcast.rssUrl)}>
        <div className="item">
          <ListItem alignItems="flex-start" button={true}>
            <div className={classes.image}>
              <img
                className={classes.image}
                src={podcast.imageUrl}
                alt={podcast.title}
              />
            </div>
            <ListItemText primary={podcast.title} />
          </ListItem>
          <Divider />
        </div>
      </LinkContainer>
    );
  }
}

export default withStyles(styles)(SearchEntryView);
