import React, { Component } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { ListItem, ListItemIcon, ListItemText } from "@material-ui/core";

interface IProps {
  route: string;
  title: string;
  icon?: any;
  divider?: boolean;
  onClick?: () => void;
}

export default class DrawerElementView extends Component<IProps> {
  public static defaultProps = {
    route: ""
  };

  render() {
    const { route, title, icon, divider, onClick } = this.props;

    return (
      <LinkContainer to={route}>
        <ListItem button divider={divider}>
          {icon && <ListItemIcon>{icon}</ListItemIcon>}
          <ListItemText primary={title} onClick={onClick} />
        </ListItem>
      </LinkContainer>
    );
  }
}
