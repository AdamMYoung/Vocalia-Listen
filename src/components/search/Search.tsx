import React, { Component, ChangeEvent } from "react";
import {
  Card,
  List,
  ListItem,
  ListItemText,
  createStyles,
  Theme,
  withStyles,
  WithStyles,
  Divider,
  Fade,
  InputBase
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import { fade } from "@material-ui/core/styles/colorManipulator";
import { Podcast } from "../../utility/types";
import { LinkContainer } from "react-router-bootstrap";
import DataManager from "../../api/DataManager";

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
    image: {
      borderRadius: "3px",
      height: "50px",
      width: "50px"
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

interface ISearchProps extends WithStyles<typeof styles> {
  api: DataManager; //Manager for I/O of API calls.
}

interface ISearchState {
  podcasts: Podcast[];
  term: string;
  isOpen: boolean;
}

interface IEntryProps {
  podcast: Podcast;
}

class Search extends Component<ISearchProps, ISearchState> {
  constructor(props: ISearchProps) {
    super(props);

    this.state = {
      podcasts: [],
      term: "",
      isOpen: false
    };
  }

  querySearch = async (term: string) => {
    const { api } = this.props;

    if (term.length >= 3) {
      var podcasts = await api.searchPodcasts(term);

      if (podcasts) this.setState({ podcasts: podcasts });
    }
  };

  render() {
    const { podcasts, isOpen } = this.state;
    const { classes } = this.props;

    function Entry(props: IEntryProps) {
      const { podcast } = props;

      return (
        <LinkContainer to={"/detail/" + encodeURIComponent(podcast.rssUrl)}>
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

    return (
      <div className={classes.search}>
        <div className={classes.searchIcon}>
          <SearchIcon />
        </div>
        <InputBase
          placeholder="Search…"
          classes={{
            root: classes.inputRoot,
            input: classes.inputInput
          }}
          onChange={event => this.querySearch(event.target.value)}
          onFocus={() => this.setState({ isOpen: true })}
          onBlur={() => setTimeout(() => this.setState({ isOpen: false }), 500)}
        />
        {isOpen && (
          <Fade in={isOpen}>
            <Card style={{ position: "absolute" }}>
              <List className={classes.root}>
                {podcasts.map(podcast => (
                  <Entry
                    podcast={podcast}
                    key={podcast.rssUrl + podcast.title}
                  />
                ))}
              </List>
            </Card>
          </Fade>
        )}
      </div>
    );
  }
}

export default withStyles(styles)(Search);
