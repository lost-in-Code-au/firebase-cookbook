import React, { Component } from 'react'
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableHighlight,
  ImageBackground,
  Image,
  Button
} from 'react-native'
import { StackNavigator } from 'react-navigation' // 1.0.0-beta.23
import PropTypes from 'prop-types'

// import styles from './styles'

import HomeScreen from './screens/HomeScreen'
import RecipeScreen from './screens/RecipeScreen'
import IngredientsScreen from './screens/IngredientsScreen'
import SearchScreen from './screens/SearchScreen'

const config = {
  apiKey: "AIzaSyDhsH4FXxdlN9UegLr0_P2UDuOXp-WySk0",
  authDomain: "react-native-firebase-st-d0137",
  databaseURL: "https://react-native-firebase-st-d0137.firebaseio.com/"
}//TODO: move over to webApp.js file.

import firebase from 'firebase' // 4.8.1

try {
  firebase.initializeApp(config)
  } catch (err) {
  if (!/already exists/.test(err.message)) {
    console.error('Firebase initialization error', err.stack)
  }
}

const CookBookApp = StackNavigator({
  Home: { screen: HomeScreen },
  Recipe: { screen: RecipeScreen },
  Ingredients: { screen: IngredientsScreen },
  Search: { screen: SearchScreen },
})

export default class App extends Component<{}> {
  constructor() {
    super()
    this.state = {
      recipes: [],
      loading: true,
      error: null
    }
  }

  static navigationOptions = {
  header: ({ navigate }) => {
    return {
      titleStyle: {
        fontFamily: 'American Typewriter'
        },
      }
    },
  }//TODO: Maybe doing nothing, need to be checked.

  componentDidMount() {
    firebase.database().ref().on('value', (snapshot) => {
      const data = snapshot.val()
      this.setState({
        ...this.state,
        recipes: data,
        loading: !this.state.loading
      })
    })
  }

  render() {
    return <CookBookApp />
  }
}