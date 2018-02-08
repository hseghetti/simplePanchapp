import React from 'react';
import { AppRegistry, View } from 'react-native'
import { createStore } from 'redux'
import * as firebase from 'firebase'
import { reducer } from './panchosListRedux'
import Container from './Container'
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
            panchos: []
        };

        this.panchosRef = firebaseApp.database().ref('/panchos/')
    }

    componentWillMount () {
        // this.initialDataBaseLoad(this.panchosRef)
        // this.listenForPanchoRemoved(this.panchosRef)
        this.listenForPanchodAdded(this.panchosRef)
    }

    componentWillUnmount () {
        this.panchosRef.off()
    }

    render () {
        return (
            <Container 
                store={store} 
                panchos={this.state.panchos} 
                removeFromFirebase={this.removeFromFirebase.bind(this)}
                addToFirebase={this.addToFirebase.bind(this)}
            />
        )
    }

    initialDataBaseLoad = (panchosRef) => {
        let items = []
        var that = this;
        
        panchosRef.once('value').then(function (dataSnapshot) {
            dataSnapshot.forEach((child) => {      
                items.push({
                date: child.val().date,
                panchado: child.val().panchado,
                reason: child.val().reason,
                _key: child.key
                })
            })

            console.log(items)
            that.setState({
                panchos: items
            })
        })
    }

    listenForPanchodAdded = (panchosRef) => {
        panchosRef.on('value', (dataSnapshot) => { // child_added
            let items = []

            dataSnapshot.forEach((child) => {      
                items.push({
                    date: child.val().date,
                    panchado: child.val().panchado,
                    reason: child.val().reason,
                    _key: child.key
                })
            })

            console.log(items)
            this.setState({
                panchos: items
            })
        })
    }

    listenForPanchoRemoved = (panchosRef) => {
        panchosRef.on('child_removed', (oldChildSnapshot) => { 
            let panchos = _.cloneDeep(this.state.panchos)
            panchos = _.filter(panchos, (pancho) => {return pancho._key !== oldChildSnapshot.key})

            this.setState({
                panchos: panchos
            })
        })  
    }

    removeFromFirebase = (key) => {
        this.panchosRef.child(key).remove()
    }

    addToFirebase = (pancho) => {
        this.panchosRef.push(pancho)
    }
}

AppRegistry.registerComponent('SimplePanchapp', () => App)