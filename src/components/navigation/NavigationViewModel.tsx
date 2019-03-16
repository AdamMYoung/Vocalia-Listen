import React, { Component } from "react";
import DataManager from "../../api/DataManager";
import NavigationView from "./NavigationView";
import SearchViewModel from "../search/SearchViewModel";
import { Category } from "../../models/Category";

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
  onToggleDrawer = () => {
    const { drawerOpen } = this.state;
    this.setState({ drawerOpen: !drawerOpen });
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
        onToggleDrawer={this.onToggleDrawer}
        search={<SearchViewModel api={api} />}
        {...this.props}
        {...this.state}
      />
    );
  }
}
