import React from 'react'
import { AppRegistry,View, Picker, Alert, StyleSheet } from 'react-native'
import moment from 'moment'
import _ from 'lodash'

import List from '../base-components/List'
import Input from '../base-components/Input'
import Title from '../base-components/Title'
import MenuPopup from './MenuPopup'
import Profile from './Profile'

export default class Container extends React.Component {

  state = {
    panchado: 'panchedPlaceholder',
    view: 'panchos',
    panchos: {}
  }

  componentDidMount() {
    const {panchos} = this.props
    const {userData} = this.props

    this.setState({
      panchos: panchos,
      userData: userData || {}
    })
  }

  componentWillReceiveProps (props) {
    const {panchos} = props
  
    this.setState({panchos: panchos})
  }

  onAddPancho = (reason) => {
    const {panchado} = this.state

    if (panchado && panchado !== 'panchedPlaceholder') {
      this.props.addToFirebase({
        panchado: panchado,
        reason: reason,
        date: moment().toString()
      })
    } else {
      Alert.alert(
        'Please select an email',
        'You must select the victim of the Pancho before submit',
        [
          {text: 'OK', onPress: () => console.log('OK Pressed')},
        ],
        { cancelable: false }
      );
    }
  }

  onRemovePancho = (index) => {
    Alert.alert(
      'Are you sure?',
      'Do you want to delete the pancho?',
      [
        {text: 'NO', onPress: () => console.log('NO Pressed')},
        {text: 'YES', onPress: function (index) {
          this.removePancho(index);
        }.bind(this, index)}
      ],
      { cancelable: false }
    );
  }

  removePancho = (index) => {
    this.props.removeFromFirebase(index._key);    
  }

  render() {
    const viewToRender = {
      'panchos': this.renderPanchoView,
      'profile': this.renderProfileView
    }
  
    return (
      <View>
        <View style={styles.topBar}>
          <MenuPopup {...this.getMenuProps() }/>
          <Title>
            Pancho List... Lets pay
          </Title>
        </View>
        {viewToRender[this.state.view]()}
      </View>
    )
  }

  renderPanchoView = () => {

    return (
      <View>
        <Picker 
          onValueChange={this.onPickerChange.bind(this)}
          selectedValue={this.state.panchado}>
          <Picker.Item label="Who was Panched?" value="panchedPlaceholder" />
          {this.props.users.map(this.renderPickerItem)}
        </Picker>
        <Input placeholder={'Reason'} onSubmitEditing={this.onAddPancho.bind(this)} />
        {this.renderPanchoList()}
      </View>
    );
  }

  renderPanchoList = () => {
    let dataToRender = null;
    const {panchos} = this.state

    if (!_.isEmpty(panchos)) {
        dataToRender = (<List list={panchos} onPressItem={this.onRemovePancho} />);
    }

    return dataToRender;
  }

  renderProfileView = () => {
    return (
      <View>
        <Profile userData={this.state.userData} />
      </View>
    );
  }

  renderPickerItem = (item, index) => {
    return <Picker.Item label={item.alias || item.email} value={item.email} key={index} />
  }

  getMenuProps = () => {
    return {
      onMenuAction: this.onMenuAction.bind(this),
      onUserLogout: this.props.onUserLogout
    }
  }

  onMenuAction = (menuSelected) => {
    this.setState({view: menuSelected})
  }

  onPickerChange = (itemValue, itemIndex) => {
    this.setState({panchado: itemValue})
  }
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    justifyContent: 'flex-start'
  }
})

