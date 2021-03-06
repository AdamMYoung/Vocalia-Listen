import React, { Component } from "react";
import DataManager from "../../data/api/DataManager";
import { Category } from "../../models/Category";
import SearchViewModel from "../search/SearchViewModel";
import NavigationView from "./NavigationView";

interface IProps {
  api: DataManager;
  isMobile: boolean;
  onAuth: () => void;
}

interface IState {
  drawerOpen: boolean;
  categories: Category[];
  addToHomePrompt: any;
}

export default class NavigationViewModel extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      drawerOpen: false,
      addToHomePrompt: null,
      categories: []
    };

    this.loadCategories();

    window.addEventListener("beforeinstallprompt", (e: any) => {
      this.setState({ addToHomePrompt: e });
    });
  }

  /**
   * Loads the categories from the API.
   */
  loadCategories = async () => {
    const { api } = this.props;
    await api.getCategories(categories => {
      if (categories) this.setState({ categories });
    });
  };

  /**
   * Toggles the status of the drawer.
   */
  setDrawer = (drawerOpen: boolean) => {
    this.setState({ drawerOpen });
  };

  /**
   * Opens the window to add the SPA to the home page of the application.
   */
  onAddToHome = () => {
    const { addToHomePrompt } = this.state;
    addToHomePrompt.prompt();
    addToHomePrompt.userChoice.then(this.setState({ addToHomePrompt: null }));
  };

  render() {
    const { api } = this.props;

    return (
      <NavigationView
        isAuthenticated={Boolean(api.accessToken)}
        onAddToHome={this.onAddToHome}
        setDrawer={this.setDrawer}
        search={<SearchViewModel api={api} />}
        {...this.props}
        {...this.state}
      />
    );
  }
}
