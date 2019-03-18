import React, { Component } from "react";
import {
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Switch
} from "@material-ui/core";

interface IProps {
  text: string;
  description?: string;
  toggleValue: boolean;
  onToggle: () => void;
}

export default class OptionsListToggleView extends Component<IProps> {
  render() {
    const { text, description, toggleValue, onToggle } = this.props;

    return (
      <ListItem style={{ minWidth: 300 }}>
        <ListItemText primary={text} secondary={description} />
        <ListItemSecondaryAction>
          <Switch onClick={onToggle} checked={toggleValue} />
        </ListItemSecondaryAction>
      </ListItem>
    );
  }
}
