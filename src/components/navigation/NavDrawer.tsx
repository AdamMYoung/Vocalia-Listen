import React, { Component } from "react";
import {
  Divider,
  SwipeableDrawer,
  Drawer,
  Hidden,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  createStyles,
  Theme,
  withStyles,
  WithStyles
} from "@material-ui/core";
import { Person, BarChart, Star } from "@material-ui/icons";
import { LinkContainer } from "react-router-bootstrap";
import { drawerWidth } from "../../utility/constants";
import { Category } from "../../utility/types";
import Auth from "../../auth/Auth";

/**
 * CSS styles for the navigation drawer.
 * @param theme Theme of the navigation drawer.
 */
const styles = (theme: Theme) =>
  createStyles({
    root: {
      display: "flex"
    },
    drawer: {
      [theme.breakpoints.up("sm")]: {
        width: drawerWidth,
        flexShrink: 0
      }
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
    toolbar: theme.mixins.toolbar,
    drawerPaper: {
      width: drawerWidth
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing.unit * 3
    }
  });

/**
 * Required properties for the navigation drawer, also bundling the current styles.
 */
interface INavDrawerProps extends WithStyles<typeof styles> {
  theme: Theme; //Theme of the drawer.
  mobileOpen: boolean; //Indicates if the mobile drawer should be opened.
  categories: Category[]; //Categories to display.
  handleDrawerToggle: () => void; //Called when the drawer requests to be toggled.
  auth: Auth; //Auth0 authentication object.
}

/**
 * State variables of the navigation drawer.
 */

interface INavDrawerState {
  addToHomePrompt: any | null;
}

/**
 * Navigation drawer for selecting various routes of the application.
 */
class NavDrawer extends Component<INavDrawerProps, INavDrawerState> {
  /**
   * Closes the drawer if the mobile varient has been opened.
   */

  constructor(props: INavDrawerProps) {
    super(props);
    this.state = {
      addToHomePrompt: null
    };

    window.addEventListener("beforeinstallprompt", (e: any) => {
      this.setState({ addToHomePrompt: e });
    });
  }

  /**
   * Closes the mobile nav drawer.
   */
  closeDrawer = () => {
    if (this.props.mobileOpen) this.props.handleDrawerToggle();
  };

  /**
   * Signs the user into the application.
   */
  login() {
    this.props.auth.login();
  }

  /**
   * Signs the user out of the application.
   */
  logout() {
    this.props.auth.logout();
  }

  /**
   * Opens the window to add the SPA to the home page of the application.
   */
  addToHome = () => {
    const { addToHomePrompt } = this.state;
    addToHomePrompt.prompt();
    addToHomePrompt.userChoice.then(this.setState({ addToHomePrompt: null }));
  };

  render() {
    const { classes, theme } = this.props;
    const { isAuthenticated } = this.props.auth;

    const drawer = (
      <div>
        {/* Login */}
        <div className={classes.toolbar}>
          <List>
            <ListItem button>
              <ListItemIcon>
                <Person />
              </ListItemIcon>
              {!isAuthenticated() ? (
                <ListItemText primary="Sign In" onClick={() => this.login()} />
              ) : (
                <ListItemText
                  primary="Sign Out"
                  onClick={() => this.logout()}
                />
              )}
            </ListItem>
          </List>
        </div>

        <Divider />
        <List>
          {/* Top */}
          <LinkContainer to="/top">
            <ListItem button>
              <ListItemIcon>
                <BarChart />
              </ListItemIcon>
              <ListItemText primary="Top" onClick={this.closeDrawer} />
            </ListItem>
          </LinkContainer>

          {/* Subscribed */}
          {isAuthenticated() && (
            <LinkContainer to="/subscribed">
              <ListItem button>
                <ListItemIcon>
                  <Star />
                </ListItemIcon>
                <ListItemText primary="Subscribed" onClick={this.closeDrawer} />
              </ListItem>
            </LinkContainer>
          )}
        </List>
        <Divider />

        {this.state.addToHomePrompt != null && (
          <div>
            <List>
              {/* Add To Home Screen */}
              <ListItem button>
                <ListItemText
                  primary="Add to Home Screen"
                  onClick={this.addToHome}
                />
              </ListItem>
            </List>
            <Divider />
          </div>
        )}

        <List>
          {/* Categories */}
          {this.props.categories.map(category => (
            <LinkContainer key={category.id} to={"/browse/" + category.id}>
              <ListItem button>
                <ListItemText
                  primary={category.title}
                  onClick={this.closeDrawer}
                />
              </ListItem>
            </LinkContainer>
          ))}
        </List>
      </div>
    );

    return (
      <div className={classes.root}>
        <nav className={classes.drawer}>
          {/* Mobile varient of the navigation drawer */}
          <Hidden smUp implementation="css">
            <SwipeableDrawer
              variant="temporary"
              anchor={theme.direction === "rtl" ? "right" : "left"}
              open={this.props.mobileOpen}
              onClose={this.props.handleDrawerToggle}
              onOpen={this.props.handleDrawerToggle}
              classes={{
                paper: classes.drawerPaper
              }}
            >
              {drawer}
            </SwipeableDrawer>
          </Hidden>

          {/* Desktop varient of the navigation drawer */}
          <Hidden xsDown implementation="css">
            <Drawer
              classes={{
                paper: classes.drawerPaper
              }}
              variant="permanent"
              open
            >
              {drawer}
            </Drawer>
          </Hidden>
        </nav>
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(NavDrawer);
