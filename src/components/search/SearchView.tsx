import React, { Component } from "react";
import {
  Theme,
  createStyles,
  WithStyles,
  withStyles,
  InputBase,
  Fade,
  List,
  Card
} from "@material-ui/core";
import { fade } from "@material-ui/core/styles/colorManipulator";
import { Podcast } from "../../utility/types";
import SearchEntryView from "./SearchEntryView";
import { Search } from "@material-ui/icons";

/**
 * CSS styles of the top AppBar.
 */
const styles = (theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      maxWidth: 360,
      backgroundColor: theme.palette.background.paper,
      position: "relative",
      overflow: "auto",
      maxHeight: 300
    },
    search: {
      position: "relative",
      borderRadius: theme.shape.borderRadius,
      backgroundColor: fade(theme.palette.common.white, 0.15),
      "&:hover": {
        backgroundColor: fade(theme.palette.common.white, 0.25)
      },
      marginRight: theme.spacing.unit * 2,
      marginLeft: 0,
      width: "100%",
      [theme.breakpoints.up("sm")]: {
        marginLeft: theme.spacing.unit * 3,
        width: "auto"
      }
    },
    searchIcon: {
      width: theme.spacing.unit * 9,
      height: "100%",
      position: "absolute",
      pointerEvents: "none",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    },
    inputRoot: {
      color: "inherit",
      width: "100%"
    },
    inputInput: {
      paddingTop: theme.spacing.unit,
      paddingRight: theme.spacing.unit,
      paddingBottom: theme.spacing.unit,
      paddingLeft: theme.spacing.unit * 10,
      transition: theme.transitions.create("width"),
      width: "100%",
      [theme.breakpoints.up("sm")]: {
        width: 120,
        "&:focus": {
          width: 200
        }
      }
    }
  });

interface IProps extends WithStyles<typeof styles> {
  searchResults: Podcast[];
  searchTerm: string;
  isOpen: boolean;
  onSearch: (term: string) => void;
  onVisibilityChanged: (visible: boolean) => void;
}

class SearchView extends Component<IProps> {
  render() {
    const {
      classes,
      searchResults,
      isOpen,
      onSearch,
      onVisibilityChanged
    } = this.props;

    return (
      <div className={classes.search}>
        <div className={classes.searchIcon}>
          <Search />
        </div>
        <InputBase
          placeholder="Search…"
          classes={{
            root: classes.inputRoot,
            input: classes.inputInput
          }}
          onChange={event => onSearch(event.target.value)}
          onFocus={() => onVisibilityChanged(true)}
          onBlur={() => setTimeout(() => onVisibilityChanged(false), 500)}
        />
        {isOpen && (
          <Fade in={isOpen}>
            <Card style={{ position: "absolute" }}>
              <List className={classes.root}>
                {searchResults.map(podcast => (
                  <SearchEntryView podcast={podcast} key={podcast.rssUrl} />
                ))}
              </List>
            </Card>
          </Fade>
        )}
      </div>
    );
  }
}

export default withStyles(styles)(SearchView);
