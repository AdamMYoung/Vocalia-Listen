import React, { Component } from "react";
import DataManager from "../data/api/DataManager";
import NavigationViewModel from "./navigation/NavigationViewModel";
import PlayerViewModel from "./player/PlayerViewModel";
import { Slide } from "@material-ui/core";
import DetailViewModel from "./detail/DetailViewModel";
import { Route, Switch, Redirect } from "react-router";
import Callback from "../data/auth/Callback";
import Auth from "../data/auth/Auth";
import BrowserViewModel from "./browse/BrowserViewModel";
import { PodcastEpisode } from "../models/PodcastEpisode";
import OptionsViewModel from "./options/OptionsViewModel";

interface IProps {
  isMobile: boolean;
  isAuthenticated: boolean;
  api: DataManager;
  auth: Auth;
  currentEpisode: PodcastEpisode | null;
  onAuth: () => void;
  onOptionsChanged: () => void;
  onEpisodeSelected: (episode: PodcastEpisode | null) => void;
}

export default class LayoutView extends Component<IProps> {
  render() {
    const { currentEpisode, auth } = this.props;

    const route = (
      <React.Fragment>
        <Switch>
          <Route
            path="/browse/:id/"
            render={props => (
              <BrowserViewModel
                category={props.match.params.id}
                {...this.props}
              />
            )}
          />

          <Route
            path="/callback"
            render={() => {
              return <Callback auth={auth} />;
            }}
          />

          {auth.isAuthenticated() ? (
            <Redirect to="/browse/subscribed" />
          ) : (
            <Redirect to="/browse/top" />
          )}
        </Switch>

        <Route
          path="/browse/:location/:dialog"
          render={props =>
            props.match.params.dialog == "options" ? (
              <OptionsViewModel {...this.props} />
            ) : (
              <DetailViewModel
                feedUrl={props.match.params.dialog}
                {...this.props}
              />
            )
          }
        />
      </React.Fragment>
    );

    return (
      <NavigationViewModel {...this.props}>
        {route}
        <Slide direction={"up"} in={Boolean(currentEpisode)}>
          <PlayerViewModel episode={currentEpisode} {...this.props} />
        </Slide>
      </NavigationViewModel>
    );
  }
}
