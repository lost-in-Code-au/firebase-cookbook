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

var ScreenHeight = Dimensions.get("window").height//not in use now, is messes up the background
var ScreenWidth = Dimensions.get("window").Width
const MAX_SNIPPET_LENGTH = 75

class NewRecipeScreen extends React.Component {
  static navigationOptions = {
    // headerRight: <Button title="Add" />,//TODO: create firebase writing Component
    title: 'new grEat'
  }

  constructor() {
    super()
    this.state = {
      newRecipe: {
        _id: let id = require('crypto').randomBytes(10).toString('hex'),//To be tested.
        author: authorName,
        diet: dietType,
        difficulty: DefLvl,
        duration: durationCount,
        ingredients: [
          { `ingredients builder goes here` id: ingId, name: ingName}
        ],
        instructions: [
          { `instructions builder goes here` step: stepNumber, text: stepText}
        ],
        name: dishName,
        picture: imgUrl,
        snippet: snippetString
      }
    }
  }


  function writeDataToCloud() {

    //this needs tobe review and wrapped in a promise to save the image and get it's url.
    firebase.database().ref('users/' + userId).set({
      recipesdb: this.state.newRecipe
    })
  }

  render() {
    return (

    )
  }
}

export default NewRecipeScreen
