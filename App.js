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
  Button,
  StatusBar
} from 'react-native'
import { StackNavigator } from 'react-navigation' // 1.0.0-beta.23
import 'expo'// For dev logs through expo XDE

// import Config from 'react-native-config'//Failed atempt at adding .env
// console.log(Config.FIREBASE_KEY)

// import styles from './styles'

import LoginScreen from './screens/LoginScreen'
import HomeScreen from './screens/HomeScreen'
import RecipeScreen from './screens/RecipeScreen'
import IngredientsScreen from './screens/IngredientsScreen'
import SearchScreen from './screens/SearchScreen'

const CookBookApp = StackNavigator({
  login: { screen: LoginScreen },
  Home: { screen: HomeScreen },
  Recipe: { screen: RecipeScreen },
  Ingredients: { screen: IngredientsScreen },
  Search: { screen: SearchScreen },
})

export default class App extends Component<{}> {
  constructor() {
    super()
    this.state = {
      user: null,
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

  render() {
    return <CookBookApp />
  }
}