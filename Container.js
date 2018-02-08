import React from 'react'
import { AppRegistry,View, Picker } from 'react-native'
import moment from 'moment'

import { actionCreators } from './panchosListRedux'
import List from './List'
import Input from './Input'
import Title from './Title'

export default class Container extends React.Component {

  state = {
    panchado: 'Ivana' // TODO: Add Placeholder 
  }

  componentWillMount() {
    const {store} = this.props
    const {panchos} = this.props // Data coming from firebase

    // const {panchos} = store.getState()  // Data coming from the store redux
  
    this.setState({panchos})

    // this.unsubscribe = store.subscribe(() => {
    //   const {panchos} = store.getState()
    //   this.setState({panchos})
    // })
  }

  componentWillReceiveProps (props) {
    const {panchos} = props
  
    this.setState({panchos})
  }

  componentWillUnmount() {
    this.unsubscribe()
  }

  onAddPancho = (reason) => {
    // USING STORES REDUX
    // const {store} = this.props
    const {panchado} = this.state

    // store.dispatch(actionCreators.add({panchado: panchado, reason: reason, date: moment().toString()}))

    this.props.addToFirebase({
      panchado: panchado,
      reason: reason,
      date: moment().toString()
    })
  }

  onRemovePancho = (index) => {
    // Using Store Reflux
    // const {store} = this.props
    // store.dispatch(actionCreators.remove(index))

    // Using remove from firebase
    this.props.removeFromFirebase(index._key) 
  }

  render() {
    const {panchos} = this.state
  
    return (
      <View>
        <Title>
          Pancho List... Lets pay
        </Title>
        <Picker 
          onValueChange={this.onPickerChange.bind(this)}
          selectedValue={this.state.panchado}>
          <Picker.Item label="Ivana" value="Ivana" />
          <Picker.Item label="Emma" value="Emma" />
          <Picker.Item label="Mema" value="Mema" />
        </Picker>
        <Input placeholder={'Reason'} onSubmitEditing={this.onAddPancho.bind(this)} />
        <List list={panchos} onPressItem={this.onRemovePancho} />
      </View>
    )
  }

  onPickerChange = (itemValue, itemIndex) => {
    this.setState({panchado: itemValue})
  }
}

