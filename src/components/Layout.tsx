import React, { Component } from "react";
import { Slide } from "@material-ui/core";
import {
  Route,
  RouteComponentProps,
  withRouter,
  Redirect,
  Switch
} from "react-router";
import {
  Category,
  Podcast,
  PodcastEpisode,
  MediaState
} from "../utility/types";
import Navigation from "./navigation/Navigation";
import MediaPlayer from "./player/MediaPlayer";
import DataManager from "../api/DataManager";
import PodcastBrowser from "./browse/PodcastBrowser";
import PodcastDetail from "./detail/PodcastDetail";
import Subscriptions from "./subscriptions/Subscriptions";
import Callback from "../auth/Callback";
import Auth from "../auth/Auth";
import { access } from "fs";

/**
 * State information for the application.
 */
interface ILayoutState {
  podcastData: { [key: string]: Podcast[] };
  categories: Category[];
  dialogOpen: boolean;
  media: MediaState | null;
  auth: Auth;
  api: DataManager;
}

/**
 * Required properties for the application.
 */
interface ILayoutProps extends RouteComponentProps {
  isMobile: boolean;
}

/**
 * UI entry point into the application, handles routing and player interaction.
 */
export class Layout extends Component<ILayoutProps, ILayoutState> {
  displayName = Layout.name;

  constructor(props: ILayoutProps) {
    super(props);

    let api = new DataManager();
    var episode = api.getCurrentPodcast();

    this.state = {
      auth: new Auth(props, this.updateApiAccessToken),
      api: api,
      podcastData: { top: [] },
      categories: [],
      dialogOpen: false,
      media: episode != null ? { episode: episode, autoplay: false } : null
    };
  }

  /**
   * Called before the component finishes mounting,
   * and loads all categories and podcasts into memory.
   */
  async componentWillMount() {
    const { api } = this.state;

    //Load category list and category data asynchronously.
    let categories = await api.getCategories();
    this.setState({ categories: categories || [] });

    if (categories)
      categories.forEach(async category => {
        let id = category.id;
        let podcasts = await api.getPodcastByCategory(id);
        if (podcasts) {
          let loadedPodcast = this.state.podcastData;

          loadedPodcast[id] = podcasts;
          this.setState({ podcastData: loadedPodcast });
        }
      });

    //Load top podcast data asynchronously.
    let podcasts = await api.getTopPodcasts();

    if (podcasts) {
      let loadedPodcasts = this.state.podcastData;
      loadedPodcasts["top"] = podcasts;
      this.setState({ podcastData: loadedPodcasts });
    }
  }

  /**
   * Called when an episode has been selected for playback.
   */
  onEpisodeSelected = (episode: PodcastEpisode) => {
    this.state.api.setCurrentPodcast(episode);

    let media = this.state.media;
    if (media) {
      media.autoplay = true;
      media.episode = episode;
      this.setState({ media: media });
    }
  };

  onDialogClose = () => {
    let history = this.props.history;
    if (history.length > 1) history.goBack();
    else history.push("/top");
  };

  handleAuthentication = (nextState: any, replace: any) => {
    if (/access_token|id_token|error/.test(nextState.location.hash)) {
      this.state.auth.handleAuthentication();
    }
  };

  updateApiAccessToken = (accessToken: string) => {
    let api = this.state.api;
    api.accessToken = accessToken;

    this.setState({ api: api });
  };

  render() {
    const { podcastData, media, categories, auth, api } = this.state;
    const { isMobile } = this.props;

    /**
     * Elements that can be routed to.
     */
    const RoutingContents = (
      <Switch>
        <Route
          path="/top/"
          render={() => <PodcastBrowser podcasts={podcastData["top"]} />}
        />

        <Route path="/subscribed/" render={() => <Subscriptions api={api} />} />

        <Route
          path="/browse/:id/"
          render={props => (
            <PodcastBrowser podcasts={podcastData[props.match.params.id]} />
          )}
        />

        <Route
          exact
          path="/detail/:rss/"
          render={props => (
            <PodcastDetail
              open={true}
              api={api}
              rssFeed={props.match.params.rss}
              selectedEpisode={media != null ? media.episode : null}
              isMobile={isMobile}
              isAuthenticated={auth.isAuthenticated()}
              onClose={() => this.onDialogClose()}
              onEpisodeSelected={episode => this.onEpisodeSelected(episode)}
            />
          )}
        />

        <Route
          path="/callback"
          render={() => {
            return <Callback auth={this.state.auth} />;
          }}
        />

        <Redirect exact from="/" to={"/top"} />
      </Switch>
    );

    return (
      <Navigation
        categories={categories}
        isMobile={isMobile}
        auth={auth}
        api={api}
      >
        <React.Fragment>
          {RoutingContents}
          {media != null && media.episode != null && (
            <Slide direction={"up"} in={media.episode.content != null}>
              <MediaPlayer media={media} isMobile={isMobile} api={api} />
            </Slide>
          )}
        </React.Fragment>
      </Navigation>
    );
  }
}

export default withRouter(Layout);
