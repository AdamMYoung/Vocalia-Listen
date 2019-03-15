import React, { Component } from "react";
import { fade } from "@material-ui/core/styles/colorManipulator";
import {
  withStyles,
  WithStyles,
  CssBaseline,
  AppBar,
  Toolbar,
  IconButton,
  Theme,
  createStyles,
  Typography
} from "@material-ui/core";
import { Category } from "../../utility/types";
import MenuIcon from "@material-ui/icons/Menu";
import { drawerWidth } from "../../utility/constants";
import { DrawerView } from "./drawer/DrawerView";

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

interface IProps extends WithStyles<typeof styles> {
  categories: Category[];
  isMobile: boolean;
  isAuthenticated: boolean;
  mobileOpen: boolean;
  search: any;
  onAuth: () => void;
  onAddToHome: () => void;
  onToggleDrawer: () => void;
}

class NavigationView extends Component<IProps> {
  public static defaultProps = {
    search: ""
  };

  render() {
    const { classes, isMobile, search, onToggleDrawer } = this.props;

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
              onClick={onToggleDrawer}
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
            {search}
          </Toolbar>
        </AppBar>

        {/* Navigation drawer. */}
        <DrawerView {...this.props} />

        {/* Content to display. */}
        <main className={classes.content}>
          <Toolbar />
          {this.props.children}
        </main>
      </div>
    );
  }
}

export default withStyles(styles)(NavigationView);
