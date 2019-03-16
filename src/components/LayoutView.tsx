import React, { Component } from "react";
import DataManager from "../api/DataManager";
import NavigationViewModel from "./navigation/NavigationViewModel";
import PlayerViewModel from "./player/PlayerViewModel";
import { Slide } from "@material-ui/core";
import DetailViewModel from "./detail/DetailViewModel";
import { Route, Switch, Redirect } from "react-router";
import Callback from "../auth/Callback";
import Auth from "../auth/Auth";
import BrowserViewModel from "./browse/BrowserViewModel";
import { PodcastEpisode } from "../models/PodcastEpisode";

interface IProps {
  isMobile: boolean;
  api: DataManager;
  auth: Auth;
  currentEpisode: PodcastEpisode | null;
  onAuth: () => void;
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
          path="/browse/:id/:rss"
          render={props => (
            <DetailViewModel feedUrl={props.match.params.rss} {...this.props} />
          )}
        />
      </React.Fragment>
    );

    return (
      <NavigationViewModel {...this.props}>
        {route}
        {currentEpisode && (
          <Slide direction={"up"} in={Boolean(currentEpisode)}>
            <PlayerViewModel episode={currentEpisode} {...this.props} />
          </Slide>
        )}
      </NavigationViewModel>
    );
  }
}
