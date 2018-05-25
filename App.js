import React from 'react';
import { AppRegistry, View, StyleSheet, StatusBar } from 'react-native'
import * as firebase from 'firebase'
import Container from './main-components/Container'
import LoginForm from './main-components/LoginForm'
import firebaseData from './app-config/firebase-data'
import _ from 'lodash'

// Initialize Firebase
const firebaseConfig = firebaseData;
const firebaseApp = firebase.initializeApp(firebaseConfig);

export default class App extends React.Component {

    panchos = {}

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

    componentDidMount() {
        this.listenForPanchodAdded(this.panchosRef)
        StatusBar.setHidden(true);
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
        return (
            <Container  
                panchos={this.getPanchos()}
                users={this.state.users}
                userData={this.state.userData}
                removeFromFirebase={this.removeFromFirebase.bind(this)}
                addToFirebase={this.addToFirebase.bind(this)}
                onUserLogout={this.onUserLogout.bind(this)}
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

            // this setTimeout is needed because in prod there is a issue trying to get the panchos
            setTimeout(function () {
                this.setState({
                    panchos: items
                })
            }.bind(this), 0)
        })
    }

    getPanchos = () => {
        let panchos = {};

        if (_.isEmpty(this.state.panchos)) {
            this.listenForPanchodAdded(this.panchosRef);
        } else {
           panchos = this.state.panchos 
        }

        return panchos;
    }

    removeFromFirebase = (key) => {
        this.panchosRef.child(key).remove()
    }

    addToFirebase = (pancho) => {
        this.panchosRef.push(pancho)
    }

    onLoggedIn = () => {
        const user = firebase.auth().currentUser;
        let newUserRef;

        this.usersRef.orderByChild('email').equalTo(user.email).on("value", function(snapshot) {
            if (!snapshot.val()) {
                newUserRef = this.usersRef.push({email: user.email}, (error) => {
                    if (error) {
                        console.log('user push failed ', error);
                    } else {
                        this.setUsersList(newUserRef)
                    }
                })
            } else {
                this.setUsersList(snapshot)
            }
        }.bind(this));
        //console.log('current user ', user)
    }

    setUsersList = (userData) => {
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
                users: items,
                userData: userData
            })
        }.bind(this));        
    }

    onUserLogout = () => {
        firebase.auth().signOut();
        this.setState({
            loggedIn: false,
            users: [],
            userData: {}
        })
    }
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 15
    }
})

AppRegistry.registerComponent('SimplePanchapp', () => App)