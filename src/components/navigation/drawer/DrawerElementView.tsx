import React, { Component } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { ListItem, ListItemIcon, ListItemText } from "@material-ui/core";

interface IProps {
  route: string;
  title: string;
  icon: any | null;
  onClick: () => void;
}

export default class DrawerElementView extends Component<IProps> {
  public static defaultProps = {
    icon: null,
    route: "",
    onClick: () => {}
  };

  render() {
    const { route, title, icon, onClick } = this.props;

    return (
      <LinkContainer to={route}>
        <ListItem>
          {icon && <ListItemIcon>{icon}</ListItemIcon>}
          <ListItemText primary={title} onClick={onClick} />
        </ListItem>
      </LinkContainer>
    );
  }
}
