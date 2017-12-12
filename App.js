import React, { Component } from 'react'
import {
  Dimensions,
  StyleSheet,
  Platform,
  ImageBackground,
  Text,
  View,
  StatusBar,
  FlatList,
  ScrollView,
  Animated,
  Image,
  Easing
} from 'react-native'

// import favData from './favdata.json' //TODO: make backout data incase no wifi?

import firebase from 'react-native-firebase'

var ScreenHeight = Dimensions.get("window").height
var ScreenWidth = Dimensions.get("window").Width
const MAX_SNIPPET_LENGTH = 75
// var SBHeight = StatusBar.currnetHeight //for android

const config = {
  apiKey: "AIzaSyDhsH4FXxdlN9UegLr0_P2UDuOXp-WySk0",
  authDomain: "react-native-firebase-st-d0137",
  databaseURL: "https://react-native-firebase-st-d0137.firebaseio.com/"
}//TODO: move over to webApp.js file.

firebase.initializeApp(config)

export default class App extends Component<{}> {
  constructor() {
    super()
    // this.spinValue = new Animated.Value(0)
    this.state = {
      recipes: [],
      loading: true,
      error: null
      //added for view state ie error and state handling
    }
  }

  componentDidMount() {
    // console.log('Hello')

    firebase.database().ref().once('value')
    .then((snapshot) => {
      console.log(snapshot.val())
      const data = snapshot.val()
      this.setState({...this.state, recipes: data, loading: false})
      // console.log("data: ", data)
    })
    .catch((err) => {
      console.log(err)
      this.setState({...this.state, error: true, loading: false})
    })
  }

  shortenSnippet(snippet){
    if(snippet.length > MAX_SNIPPET_LENGTH){
      snippet = snippet.slice(0, MAX_SNIPPET_LENGTH-3) + "..."
    }
    return snippet
  }


  renderRecipes(){
    if(this.state.loading) {
      return (
        <View>
          <Text style={styles.loading}>Loading...</Text>
        </View>
      )
    }
    else if (this.state.error) {
      return <View><Text>Error</Text></View>
    }
    else if (this.state.recipes.length === 0) {
      return <View><Text>No recipes</Text></View>
    }
    else {
      return this.state.recipes.map((recipe) => {
        return (
          <View key={recipe._id} style={styles.recipeCardContainer}>
            <View style={styles.recipeCard}>
              <Text style={styles.name}>{recipe.name}</Text>
              <Text style={styles.snippet}>{this.shortenSnippet(recipe.snippet)}</Text>
              <View style={styles.infoContainer}>
                <Text style={styles.infoText}>Difficulty: {recipe.difficulty}/5</Text>
                <Text style={styles.infoText}>Duration: {recipe.duration}mins</Text>
              </View>
              {/* <Image source={image} style={styles.recipeImage} /> /*TODO: add to cards after image upload is possible */}
            </View>
          </View>
        )
      })
    }
  }//TODO: remove ScrollView since it's not required if we are using  FlatList

  render() {
    return (
      <View>
        <View  style={styles.statusBar}>
          <StatusBar />
        </View>
        <ImageBackground source={require('./assets/bg.png')} style={[styles.backGround]}>
          <ScrollView  style={styles.container}>
            <View>
              <Text style={styles.welcome}>
                Klassen & Jones CookBook
              </Text>
            </View>
            {this.renderRecipes()}
          </ScrollView>
        </ImageBackground>
      </View>
    )
  }
}
// {firebase.auth.nativeModuleExists && <Text style={styles.module}>Authentication</Text>}
// {firebase.messaging.nativeModuleExists && <Text style={styles.module}>Messaging</Text>}

const styles = StyleSheet.create({
  img: {
    margin: 10,
    padding: 30,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  statusBar: {
    backgroundColor: '#fff',
    height: 20,
  },
  loading: {
    backgroundColor: "transparent",
    color: "white",
    textAlign:'center',
    fontSize: 28,
  },
  container: {
    flex: 1,
  },
  backGround: {
    height: ScreenHeight,
    width: ScreenWidth,
  },
  welcome: {
    fontSize: 28,
    textAlign: 'center',
    margin: 10,
    backgroundColor:'transparent',
    color: '#fff',
  },
  recipeCardContainer: {
    backgroundColor: "transparent",
    borderRadius: 20,
    width: ScreenWidth,
    borderWidth: 1,
    borderColor: '#fff',
    margin: 10,
  },
  recipeCard: {
    backgroundColor: "transparent",
    width: "100%",
    padding: 10,
  },
  name: {
    color: '#fff',
    fontWeight: "bold",
    margin: 5,
  },
  snippet: {
    fontWeight: "bold",
    color: '#fff',
    margin: 5,
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  infoText: {
    fontWeight: "bold",
    color: '#fff',
    flex: 1,
    textAlign: "center",
  },
  recipeImage: {
    width: 200,
    height: 100,
  }
})
