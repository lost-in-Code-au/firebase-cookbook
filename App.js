import React, { Component } from 'react'
import {
  StatusBar,
  Dimensions,
  StyleSheet,
  ImageBackground,
  Text,
  View,
  FlatList,
  TouchableHighlight,
  AppRegistry,
  Image
} from 'react-native'
import { StackNavigator } from 'react-navigation'
import RNCloudinary from 'react-native-cloudinary'

import ShowPage from './showpage.js'//TODO: to be written

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

class HomeScreen extends React.Component {
  static navigationOptions = {
  title: 'J&K CookBook'
  }

  constructor() {
    super()
    this.state = {
      recipes: [],
      loading: true,
      error: null
    }
  }

  componentDidMount() {
    firebase.database().ref().on('value', (snapshot) => {
        console.log(snapshot.val())
        const data = snapshot.val()
        this.setState({
          ...this.state,
          recipes: data,
          loading: !this.state.loading
        })
      })
    // .catch((err) => {
    //   console.log(err)
    //   this.setState({...this.state, error: true, loading: false})
    // })//TODO: err catch needs to be researched on react-native-firebase package
  }

  shortenSnippet(snippet){
    if(snippet.length > MAX_SNIPPET_LENGTH){
      snippet = snippet.slice(0, MAX_SNIPPET_LENGTH-5) + "..."
    }
    return snippet
  }

  renderLandingPage() {
    const { navigate } = this.props.navigation
    const text = this.state.loading ? 'Loading...' : 'Loaded'
    if(this.state.loading) {
      return (
        <View>
          <Text style={[styles.loading, styles.backGround]}>{text}</Text>
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
      console.log(this.state.recipes[0].picture);
      return (
        <FlatList
          data={this.state.recipes}
          automaticallyAdjustContentInsets={true}
          renderItem={({ item }) => (
            <TouchableHighlight
            onPress={() => navigate('Recipe', item)}
            key={item._id} style={styles.recipeCardContainer}>
              <View style={styles.recipeCard}>
                <Image source={{uri: 'http://res.cloudinary.com/detvc9wtb/image/upload/v1513357565/sample.jpg' }} style={styles.recipeImage} />
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.snippet}>{this.shortenSnippet(item.snippet)}</Text>
                <View style={styles.infoContainer}>
                  <Text style={styles.infoText}>Difficulty: {item.difficulty}/5</Text>
                  <Text style={styles.infoText}>Duration: {item.duration}mins</Text>
                </View>
              </View>
            </TouchableHighlight>
          )}
        />
      )
    }
  }

  render() {

    return (
      <ImageBackground source={require('./assets/bg.png')} style={styles.backGround}>
        <View style={styles.container}>
          {this.renderLandingPage()}
        </View>
      </ImageBackground>
    )
  }
}

class RecipeScreen extends React.Component {

  static navigationOptions = ({ navigation }) => ({
    title: navigation.state.params.name,
  })

  shortenSnippet(snippet){
    if(snippet.length > MAX_SNIPPET_LENGTH){
      snippet = snippet.slice(0, MAX_SNIPPET_LENGTH-5) + "..."
    }
    return snippet
  }

  render() {
    console.log("Item props:", this.props.navigation.state.params)
    const { params: item } = this.props.navigation.state

    return (
      <ImageBackground source={require('./assets/bg.png')} style={styles.backGround}>
        <FlatList
          data={item.instructions}
          renderItem={({item: instruction}) => (
            <View key={instruction.step} style={styles.recipeCard}>
              <Text style={styles.name}>{instruction.text}</Text>
            </View>
          )}
          ListHeaderComponent={() => (
            <View style={styles.header}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.name}>{item.author}</Text>
              <Text style={styles.snippet}>{this.shortenSnippet(item.snippet)}</Text>
              <View style={styles.infoContainer}>
                <Text style={styles.infoText}>Difficulty: {item.difficulty}/5</Text>
                <Text style={styles.infoText}>Duration: {item.duration}mins</Text>
              </View>
            </View>
          )}
        />
      </ImageBackground>
    )
  }
}

const CookBookApp = StackNavigator({
  Home: { screen: HomeScreen },
  Recipe: { screen: RecipeScreen },
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

  _keyExtractor = (item, index) => item.id

  componentDidMount() {
    firebase.database().ref().on('value', (snapshot) => {
        console.log(snapshot.val())
        const data = snapshot.val()
        this.setState({
          ...this.state,
          recipes: data,
          loading: !this.state.loading
        })
      })
    // .catch((err) => {
    //   console.log(err)
    //   this.setState({...this.state, error: true, loading: false})
    // })//TODO: err catch needs to be researched on react-native-firebase package
  }

  render() {
    return <CookBookApp />
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
  header: {
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
  button: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    padding: 10
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
    width: ScreenWidth,
    height: 300,
  }
})
