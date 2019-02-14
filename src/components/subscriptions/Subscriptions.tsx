import React, { Component } from "react";
import { Podcast } from "../../utility/types";
import Auth from "../../auth/Auth";
import PodcastBrowser from "../browse/PodcastBrowser";
import DataManager from "../../api/DataManager";

interface ISubscriptionsState {
  subscriptions: Podcast[];
}

interface ISubscriptionProps {
  api: DataManager; //Manages the I/O of API calls.
}

export default class Subscriptions extends Component<
  ISubscriptionProps,
  ISubscriptionsState
> {
  constructor(props: ISubscriptionProps) {
    super(props);

    this.state = {
      subscriptions: []
    };
  }

  async componentWillMount() {
    const { api } = this.props;

    let subscriptions = await api.getSubscriptions();
    console.log(subscriptions);
    if (subscriptions) this.setState({ subscriptions: subscriptions });
  }

  render() {
    const { subscriptions } = this.state;
    return <PodcastBrowser podcasts={subscriptions} />;
  }
}
