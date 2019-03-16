import React, { Component } from "react";
import DataManager from "../../api/DataManager";
import SearchView from "./SearchView";
import { Podcast } from "../../models/Podcast";

interface IProps {
  api: DataManager;
}

interface IState {
  searchResults: Podcast[];
  searchTerm: string;
  isOpen: boolean;
}

export default class SearchViewModel extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      searchResults: [],
      searchTerm: "",
      isOpen: false
    };
  }

  /**
   * Queries the API for the specified search term.
   */
  onSearch = async (term: string) => {
    const { api } = this.props;

    if (term.length >= 3) {
      var searchResults = await api.searchPodcasts(term);
      if (searchResults) this.setState({ searchResults });
    }
  };

  /**
   * Sets the visibility of the search result window.
   */
  onVisibilityChanged = (visible: boolean) => {
    this.setState({ isOpen: visible });
  };

  render() {
    return (
      <SearchView
        onSearch={this.onSearch}
        onVisibilityChanged={this.onVisibilityChanged}
        {...this.state}
      />
    );
  }
}
