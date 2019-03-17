import React, { Component } from "react";
import {
  Theme,
  createStyles,
  WithStyles,
  List,
  Divider,
  Hidden,
  SwipeableDrawer,
  Drawer,
  withStyles
} from "@material-ui/core";
import { drawerWidth } from "../../../utility/constants";
import DrawerElementView from "./DrawerElementView";
import { Person, BarChart, Star, Settings } from "@material-ui/icons";
import { Category } from "../../../models/Category";

/**
 * CSS styles for the navigation drawer.
 * @param theme Theme of the navigation drawer.
 */
const drawerStyles = (theme: Theme) =>
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
interface IProps extends WithStyles<typeof drawerStyles> {
  theme: Theme;
  categories: Category[];
  isMobile: boolean;
  isAuthenticated: boolean;
  drawerOpen: boolean;
  addToHomePrompt: any;
  onAuth: () => void;
  setDrawer: (open: boolean) => void;
  onAddToHome: () => void;
}

class DrawerView extends Component<IProps> {
  render() {
    const {
      theme,
      classes,
      drawerOpen,
      isAuthenticated,
      addToHomePrompt,
      onAuth,
      setDrawer,
      onAddToHome,
      categories
    } = this.props;

    const drawer = (
      <div className={classes.toolbar}>
        <List>
          <DrawerElementView
            title={isAuthenticated ? "Sign Out" : "Sign In"}
            icon={<Person />}
            onClick={onAuth}
          />
        </List>
        <Divider />
        <List>
          <DrawerElementView
            route="/browse/top"
            title="Top"
            onClick={() => setDrawer(false)}
            icon={<BarChart />}
          />
          {isAuthenticated && (
            <DrawerElementView
              route="/browse/subscribed"
              title="Subscribed"
              onClick={() => setDrawer(false)}
              icon={<Star />}
            />
          )}
        </List>
        <Divider />

        {addToHomePrompt != null && (
          <div>
            <List>
              {/* Add To Home Screen */}
              <DrawerElementView
                title="Add to Home Screen"
                onClick={onAddToHome}
              />
            </List>
            <Divider />
          </div>
        )}
        <List>
          {categories.map(category => (
            <DrawerElementView
              key={category.id}
              route={"/browse/" + category.id}
              title={category.title}
              onClick={() => setDrawer(false)}
            />
          ))}
        </List>
        <Divider />
        <List>
          <DrawerElementView
            title="Options"
            icon={<Settings />}
            route={window.location.pathname + "/options"}
          />
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
              open={drawerOpen}
              onClose={() => setDrawer(false)}
              onOpen={() => setDrawer(true)}
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

export default withStyles(drawerStyles, { withTheme: true })(DrawerView);
