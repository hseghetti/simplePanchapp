import React from 'react'
import { Text, StyleSheet } from 'react-native'
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
 
export default class MenuPopup extends React.PureComponent {
  setMenuRef = ref => {
    this.menu = ref;
  };
 
  menu = null;
 
  render() {
    return (
        <Menu
          ref={this.setMenuRef}
          button={<Text style={styles.menu} onPress={this.showMenu}>MENU</Text>}
        >
          <MenuItem onPress={this.onProfileClick} disabled>Profile</MenuItem>
          <MenuItem onPress={this.hideMenu} disabled>New Group</MenuItem>
          <MenuItem onPress={this.hideMenu} disabled>Reports</MenuItem>
          <MenuItem onPress={this.hideMenu} disabled>Logs</MenuItem>
          <MenuDivider />
          <MenuItem onPress={this.onUserLogout}>Logout</MenuItem>
        </Menu>
    );
  }

  hideMenu = () => {
    this.menu.hide();
  };

  showMenu = () => {
    this.menu.show();
  };

  onProfileClick = () => {
    this.props.onMenuAction('profile');
    this.hideMenu();
  }

  onUserLogout = () => {
    this.props.onUserLogout();
    this.hideMenu()
  }
}

const styles = StyleSheet.create({
  menu: {
    backgroundColor: '#76abc1',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15
  }
})