import React from 'react'
import {
  Dimensions,
  StyleSheet,
  ImageBackground,
  Text,
  View,
  FlatList,
  TouchableHighlight,
  Image,
  Button,
} from 'react-native'

// import styles from '../styles.js'//TODO: need to import styles somehow without losing connection to window object

import firebase from 'firebase'

const config = {
  apiKey: "AIzaSyDhsH4FXxdlN9UegLr0_P2UDuOXp-WySk0",
  authDomain: "react-native-firebase-st-d0137",
  databaseURL: "https://react-native-firebase-st-d0137.firebaseio.com/"
}

firebase.initializeApp(config)

var ScreenHeight = Dimensions.get("window").height//not in use now that background has been removed
var ScreenWidth = Dimensions.get("window").Width
const MAX_SNIPPET_LENGTH = 75

class HomeScreen extends React.Component {
  static navigationOptions = {
    // headerRight: <Button title="Add" />,//TODO: create firebase writing Component
    title: 'J&K CookBook'
  }

  constructor() {
    super()
    this.state = {
      newRecipe: []
    }
  }


  function writeUserData(userId, name, email, imageUrl) {
    firebase.database().ref('users/' + userId).set({
      author: name,
      : email,
      profile_picture : imageUrl
    })
  }

  render() {
    return (

    )
  }
}
