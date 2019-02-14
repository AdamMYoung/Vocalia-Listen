import React, { Component } from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import InputBase from "@material-ui/core/InputBase";
import { fade } from "@material-ui/core/styles/colorManipulator";
import {
  createStyles,
  Theme,
  withStyles,
  WithStyles
} from "@material-ui/core/styles";
import MenuIcon from "@material-ui/icons/Menu";
import SearchIcon from "@material-ui/icons/Search";
import CssBaseline from "@material-ui/core/CssBaseline";
import NavDrawer from "./NavDrawer";
import { Category } from "../../utility/types";
import { drawerWidth } from "../../utility/constants";
import Auth from "../../auth/Auth";
import Search from "../search/Search";
import DataManager from "../../api/DataManager";

/**
 * CSS styles of the top AppBar.
 */
const styles = (theme: Theme) =>
  createStyles({
    root: {
      width: "100%"
    },
    grow: {
      flexGrow: 1
    },
    appBar: {
      marginLeft: drawerWidth,
      [theme.breakpoints.up("sm")]: {
        width: `calc(100% - ${drawerWidth}px)`
      }
    },
    menuButton: {
      marginRight: 20,
      [theme.breakpoints.up("sm")]: {
        display: "none"
      }
    },
    title: {
      display: "none",
      [theme.breakpoints.up("sm")]: {
        display: "block"
      }
    },
    content: {
      flexGrow: 1,
      [theme.breakpoints.up("sm")]: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`
      }
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

/**
 * Required properties of the top AppBar.
 */
interface INavigationProps extends WithStyles<typeof styles> {
  categories: Category[]; //Categories to display.
  isMobile: boolean; //Indicates if the device is a mobile device.
  auth: Auth; //Auth0 authentication object.
  api: DataManager; //Manager for I/O of API calls.
}

/**
 * State information of the top AppBar.
 */
interface INavigationState {
  mobileOpen: boolean; //Indicates if the mobile navigation drawer is open.
}

/**
 * Provides a top AppBar component as well as drawer integration for search.
 * Child properties are displayed within the content area.
 */
class Navigation extends Component<INavigationProps, INavigationState> {
  constructor(props: INavigationProps) {
    super(props);

    this.state = {
      mobileOpen: false
    };
  }

  /**
   * Opens/closes the navigation drawer depending on it's current state.
   */
  onDrawerToggle = () => {
    this.setState(state => ({ mobileOpen: !state.mobileOpen }));
  };

  render() {
    const { classes, isMobile, api } = this.props;

    return (
      <div className={classes.root}>
        <CssBaseline />

        {/* Top AppBar */}
        <AppBar position="fixed" className={classes.appBar}>
          <Toolbar variant={isMobile ? "regular" : "dense"}>
            <IconButton
              color="inherit"
              aria-label="Open drawer"
              className={classes.menuButton}
              onClick={this.onDrawerToggle}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              className={classes.title}
              variant="h6"
              color="inherit"
              noWrap
            >
              Vocalia
            </Typography>
            <div className={classes.grow} />
            <Search api={api} />
          </Toolbar>
        </AppBar>

        {/* Navigation drawer. */}
        <NavDrawer
          auth={this.props.auth}
          categories={this.props.categories}
          handleDrawerToggle={this.onDrawerToggle}
          mobileOpen={this.state.mobileOpen}
        />

        {/* Content to display. */}
        <main className={classes.content}>
          <Toolbar />
          {this.props.children}
        </main>
      </div>
    );
  }
}

export default withStyles(styles)(Navigation);
