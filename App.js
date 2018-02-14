import React from 'react';
import { AppRegistry, View } from 'react-native'
import { createStore } from 'redux'
import * as firebase from 'firebase'
import { reducer } from './panchosListRedux'
import Container from './Container'
import LoginForm from './LoginForm'
import _ from 'lodash'

const store = createStore(reducer)

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDtz51NeQQVzOHR-MqKfV4HCsZxURbNS-M",
    authDomain: "panchos-4ad41.firebaseapp.com",
    databaseURL: "https://panchos-4ad41.firebaseio.com",
    projectId: "panchos-4ad41",
    storageBucket: "panchos-4ad41.appspot.com",
    messagingSenderId: "357706798263"
  };
const firebaseApp = firebase.initializeApp(firebaseConfig);

export default class App extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            panchos: [],
            loggedIn: false,
            users: []
        };

        this.panchosRef = firebaseApp.database().ref('/panchos/')
        this.usersRef = firebaseApp.database().ref('/users/')
    }

    componentWillMount () {
        this.listenForPanchodAdded(this.panchosRef)
    }

    componentWillUnmount () {
        this.panchosRef.off()
    }

    render () {
        return (
            <View>
                {this.state.loggedIn ? this.renderAppContainer() : this.renderLoginForm()}        
            </View>
        )
    }

    renderAppContainer = () => {
        console.log('users in the state ', this.state.users)
        return (
            <Container 
                store={store} 
                panchos={this.state.panchos}
                users={this.state.users} 
                removeFromFirebase={this.removeFromFirebase.bind(this)}
                addToFirebase={this.addToFirebase.bind(this)}
            />
        );
    }

    renderLoginForm = () => {
        return <LoginForm onLoggedIn={this.onLoggedIn.bind(this)} />;
    }

    listenForPanchodAdded = (panchosRef) => {
        panchosRef.orderByKey().on('value', (dataSnapshot) => {
            let items = []

            dataSnapshot.forEach((child) => {      
                items.push({
                    date: child.val().date,
                    panchado: child.val().panchado,
                    reason: child.val().reason,
                    _key: child.key
                })
            })

            this.setState({
                panchos: items
            })
        })
    }

    removeFromFirebase = (key) => {
        this.panchosRef.child(key).remove()
    }

    addToFirebase = (pancho) => {
        this.panchosRef.push(pancho)
    }

    onLoggedIn = () => {
        const user = firebase.auth().currentUser;

        this.usersRef.orderByChild('email').equalTo(user.email).on("value", function(snapshot) {
            if (!snapshot.val()) {
                this.usersRef.push({email: user.email}, (error) => {
                    if (error) {
                        console.log('user push failed ', error);
                    } else {
                        this.setUsersList()
                    }
                })
            } else {
                this.setUsersList()
            }
        }.bind(this));
        //console.log('current user ', user)
    }

    setUsersList = () => {
        this.usersRef.orderByChild('email').on("value", function(dataSnapshot) {
            let items = [];
            
            dataSnapshot.forEach((child) => {      
                items.push({
                    email: child.val().email,
                    name: child.val().email,
                    _key: child.key
                })
            })
            
            this.setState({
                loggedIn: true,
                users: items
            })
        }.bind(this));        
    }
}

AppRegistry.registerComponent('SimplePanchapp', () => App)