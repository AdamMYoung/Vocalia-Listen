import { Slide } from "@material-ui/core";
import React, { Component } from "react";
import { Redirect, Route, Switch } from "react-router";
import DataManager from "../data/api/DataManager";
import Auth from "../data/auth/Auth";
import Callback from "../data/auth/Callback";
import { PodcastEpisode } from "../models/PodcastEpisode";
import BrowserViewModel from "./browse/BrowserViewModel";
import DetailViewModel from "./detail/DetailViewModel";
import NavigationViewModel from "./navigation/NavigationViewModel";
import OptionsViewModel from "./options/OptionsViewModel";
import PlayerViewModel from "./player/PlayerViewModel";

interface IProps {
  isMobile: boolean;
  api: DataManager;
  auth: Auth;
  currentEpisode: PodcastEpisode | null;
  isContinuation: boolean;
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
                isAuthenticated={auth.isAuthenticated()}
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
          <PlayerViewModel
            isAuthenticated={auth.isAuthenticated()}
            episode={currentEpisode}
            {...this.props}
          />
        </Slide>
      </NavigationViewModel>
    );
  }
}
