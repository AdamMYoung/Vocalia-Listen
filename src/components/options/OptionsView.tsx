import React, { Component } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  DialogActions,
  Button
} from "@material-ui/core";
import OptionsListToggleView from "./elements/OptionsListToggleView";

interface IProps {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export default class OptionsView extends Component<IProps> {
  render() {
    const { isDarkMode, onToggleDarkMode } = this.props;

    return (
      <Dialog open={true}>
        <DialogTitle>Options</DialogTitle>
        <DialogContent>
          <List>
            <OptionsListToggleView
              text="Dark Theme"
              onToggle={onToggleDarkMode}
              toggleValue={isDarkMode}
            />
          </List>
        </DialogContent>
        <DialogActions>
          <Button color="primary">Close</Button>
        </DialogActions>
      </Dialog>
    );
  }
}
