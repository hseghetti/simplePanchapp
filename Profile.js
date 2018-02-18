import React from 'react'
import * as firebase from 'firebase'
import { Button, View, StyleSheet, Text, TextInput } from 'react-native'

export default class Profile extends React.Component {

    
    constructor(props) {
        super(props)
        this.state = {
            userData: this.props.userData            
        }
        console.log('profile constructor ', this.props.userData.val())
        this.usersRef = new Firebase('/users/' + this.props.usersData.key)
    }

    componentWillMount () {
        console.log('Profile props')
        console.log(this.props)
    }
    
    render () {
        return (
            <View style={styles.container}>
                <Text>
                    Your Alias is
                </Text>
                <TextInput
                    style={styles.input}
                    onChangeText={(text) => this.setState({alias: text})}
                    value={this.state.alias}
                />
                <Button title="SAVE" onPress={this.onButtonPress.bind(this)} />
            </View>
        );
    }

    onButtonPress = () => {
        console.log('profile state ', this.state.userData)
        this.state.userData.update({alias: this.state.alias})
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'flex-start'
    },
    input: {
        borderWidth: 1,
        borderColor: 'black',
        padding: 3
    }
});