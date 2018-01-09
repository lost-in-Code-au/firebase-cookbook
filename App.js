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

var ScreenHeight = Dimensions.get("window").height
var ScreenWidth = Dimensions.get("window").Width
const MAX_SNIPPET_LENGTH = 75

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

  componentDidMount = () => {
    firebase.database().ref().on('value', (snapshot) => {
        const data = snapshot.val()

        this.forceUpdate(this.setState({
          ...this.state,
          recipes: data,
          loading: !this.state.loading
        }))
      })
  }

  shortenSnippet(snippet) {
    if(snippet.length > MAX_SNIPPET_LENGTH){
      snippet = snippet.slice(0, MAX_SNIPPET_LENGTH-5) + "..."
    }
    return snippet
  }

  setImage(url) {
    if(!url) {
      return 'https://firebasestorage.googleapis.com/v0/b/react-native-firebase-st-d0137.appspot.com/o/placeholder.jpg?alt=media&token=7a619092-d46f-4162-bea1-4be1f6a5c41f'
    } else {
      return url
    }
  }

  renderLandingPage = () => {
    const { navigate } = this.props.navigation
    const text = this.state.loading ? 'Loading...' : 'Loaded'

    if(this.state.loading) {
      return (
        <Text style={[styles.loading, styles.backGround, styles.font]}>{text}</Text>
      )
    }
    else if (this.state.error) {
      return <View><Text style={styles.font}>Error</Text></View>
    }
    else if (this.state.recipes.length === 0) {
      return <View><Text style={styles.font}>No recipes</Text></View>
    }
    else {
      return (
        <View>
        <ImageBackground
        style={{
          width: ScreenWidth,
          height: ScreenHeight,
        }}
        source={require('./assets/images/seigaiha.png')}>
          <FlatList
            data={this.state.recipes}
            renderItem={({ item }) => (
              <TouchableHighlight
              onPress={() => navigate('Recipe', item)}
              key={item._id} style={styles.recipeCardContainer}>
                <View style={styles.recipeCard}>
                  <Image
                  style={styles.recipeImage}
                  source={{uri: this.setImage(item.picture) }}
                  ></Image>
                  <Text style={[styles.name, styles.font]}>{item.name}</Text>
                  <Text style={[styles.snippet, styles.font]}>{this.shortenSnippet(item.snippet)}</Text>
                  <View style={styles.infoContainer}>
                    <Text style={[styles.infoText, styles.font]}>Difficulty: {item.difficulty}/5</Text>
                    <Text style={[styles.infoText, styles.font]}>Duration: {item.duration}mins</Text>
                  </View>
                </View>
              </TouchableHighlight>
            )}
          />
          </ImageBackground>
        </View>
      )
    }
  }

  render() {
    return (
        <View style={[styles.container, styles.backGround]}>
          {this.renderLandingPage()}
        </View>
    )
  }
}

class RecipeScreen extends React.Component {

  static navigationOptions = ({ navigation }) => ({
    title: navigation.state.params.name,
  })

  render() {
    const { params: item } = this.props.navigation.state
    const { navigate } = this.props.navigation

    return (
        <View>
          <ImageBackground
          style={{
            width: ScreenWidth,
            height: ScreenHeight,
          }}
          source={require('./assets/images/seigaiha.png')}>
            <FlatList
              data={item.instructions}
              renderItem={({item: instruction}) => (
                <View key={instruction.step} style={styles.recipeCard}>
                  <Text style={[styles.name, styles.font]}>{instruction.text}</Text>
                </View>
              )}
              ListHeaderComponent={() => (
                <View style={styles.headerContainer}>
                  <Text style={[styles.name, styles.font]}>{item.name}</Text>
                  <Text style={[styles.name, styles.font]}>{item.author}</Text>
                  <Button
                  onPress={() => navigate('Ingredients', item)}
                  key={item._id}
                  title="Ingredients" ></Button>
                  <Text style={[styles.snippet, styles.font]}>{item.snippet}</Text>
                  <View style={styles.infoContainer}>
                    <Text style={[styles.infoText, styles.font]}>Difficulty: {item.difficulty}/5</Text>
                    <Text style={[styles.infoText, styles.font]}>Duration: {item.duration}mins</Text>
                  </View>
                </View>
              )}
            />
          </ImageBackground>
        </View>
    )
  }
}

class IngredientsScreen extends React.Component {

  static navigationOptions = ({ navigation }) => ({
    title: navigation.state.params.name,
  })

  render() {
    const { params: item } = this.props.navigation.state

    return (
        <View>
          <ImageBackground
          style={{
            width: ScreenWidth,
            height: ScreenHeight,
          }}
          source={require('./assets/images/seigaiha.png')}>
            <FlatList
              data={item.ingredients}
              renderItem={({item: ingredients}) => (
                <View key={ingredients.id} style={styles.recipeCard}>
                  <Text style={[styles.name, styles.font]}>{ingredients.name}</Text>
                </View>
              )}
              ListHeaderComponent={() => (
                <View style={styles.headerContainer}>
                  <Text  style={[styles.header, styles.font]}>Ingredients</Text>
                </View>
              )}
            />
          </ImageBackground>
        </View>
    )
  }
}

const CookBookApp = StackNavigator({
  Home: { screen: HomeScreen },
  Recipe: { screen: RecipeScreen },
  Ingredients: { screen: IngredientsScreen },
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
  }

  render() {
    return <CookBookApp />
  }
}

const styles = StyleSheet.create({
  font: {
    fontFamily: 'Baskerville',
  },
  footer: {
  },
  loading: {
    textAlign:'center',
    fontSize: 28,
    backgroundColor:'transparent',
  },
  container: {
    flex: 1,
  },
  backGround: {
    height: ScreenHeight,
    width: ScreenWidth,
  },
  header: {
    color: '#fff'
  },
  headerContainer: {
    alignItems: 'center',
    margin: 10,
    backgroundColor:'transparent',
  },
  recipeCardContainer: {
    backgroundColor: "transparent",
    borderRadius: 50,
    width: ScreenWidth,
    borderWidth: 1,
    margin: 10,
  },
  recipeCard: {
    backgroundColor: "transparent",
    width: "100%",
    padding: 10,
  },
  name: {
    fontWeight: "bold",
    margin: 5,
  },
  snippet: {
    backgroundColor: "transparent",
    fontWeight: "bold",
    margin: 5,
  },
  infoContainer: {
    backgroundColor: "transparent",
    flexDirection: "row",
    justifyContent: "center",
  },
  infoText: {
    backgroundColor: "transparent",
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
  },
  recipeImage: {
    backgroundColor: "transparent",
    width: ScreenWidth,
    height: 300,
    borderRadius: 50,
  }
})
