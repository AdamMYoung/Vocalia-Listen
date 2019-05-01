import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List
} from "@material-ui/core";
import React, { Component } from "react";
import OptionsListToggleView from "./elements/OptionsListToggleView";

interface IProps {
  isDarkMode: boolean;
  onClose: () => void;
  onToggleDarkMode: () => void;
}

export default class OptionsView extends Component<IProps> {
  render() {
    const { isDarkMode, onClose, onToggleDarkMode } = this.props;

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
          <Button onClick={onClose}>Close</Button>
        </DialogActions>
      </Dialog>
    );
  }
}
