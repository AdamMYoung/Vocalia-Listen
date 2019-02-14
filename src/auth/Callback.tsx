import React, { Component } from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import Auth from "./Auth";
import DataManager from "../api/DataManager";

interface ICallbackProps {
  auth: Auth;
}

export default class Callback extends Component<ICallbackProps> {
  constructor(props: ICallbackProps) {
    super(props);

    const { auth } = this.props;

    auth.handleAuthentication();
  }

  render() {
    return <CircularProgress />;
  }
}
