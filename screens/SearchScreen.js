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
//
// import firebase from 'firebase'
//
// const config = {
//   apiKey: "AIzaSyDhsH4FXxdlN9UegLr0_P2UDuOXp-WySk0",
//   authDomain: "react-native-firebase-st-d0137",
//   databaseURL: "https://react-native-firebase-st-d0137.firebaseio.com/"
// }
//
// firebase.initializeApp(config)

var ScreenHeight = Dimensions.get("window").height//not in use now, is messes up the background
var ScreenWidth = Dimensions.get("window").Width
const MAX_SNIPPET_LENGTH = 75

class SearchScreen extends React.Component {
  static navigationOptions = {
    // headerRight: <Button title="Add" />,//TODO: create firebase writing Component
    title: 'grEat search'
  }

  constructor() {
    super()
    this.state = {
      recipes: []
    }
  }

  render() {
    const { params: item } = this.props.navigation.state
    const { navigate } = this.props.navigation

    // seachthingy: state.recipes.map().includes blah blah

    return (
      <ImageBackground
      style={styles.backGround}
      source={require('../assets/images/seigaiha.png')}>
        <Text> hello </Text>
      </ImageBackground>
    )
  }
}

export default SearchScreen
