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
import { SearchBar } from 'react-native-elements'

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
    // headerLeft: <Button title="Search" onPress={this._search()} />,//TODO: Build search to look though Data
    // headerRight: <Button title="Add" />,//TODO: create firebase writing Component
    title: 'J&K CookBook'
  }
  constructor() {
    super()
    this.state = {
      recipes: [],
      loading: true,
      error: null,
    }
  }


  componentDidMount = () => {
    firebase.database().ref().on('value', (snapshot) => {
        const data = snapshot.val().recipesdb
        this.setState({
          ...this.state,
          recipes: data,
          loading: !this.state.loading,
        })
      })
  }

  _shortenSnippet(snippet) {
    if(snippet.length > MAX_SNIPPET_LENGTH){
      snippet = snippet.slice(0, MAX_SNIPPET_LENGTH-5) + "..."
    }
    return snippet
  }

  _setImage(url) {
    if(!url) {
      return 'https://firebasestorage.googleapis.com/v0/b/react-native-firebase-st-d0137.appspot.com/o/placeholder.jpg?alt=media&token=7a619092-d46f-4162-bea1-4be1f6a5c41f'
    } else {
      return url
    }
  }

  // _renderItem = ({item}) => (
  //   <TouchableHighlight
  //   onPress={() => navigate('Recipe', item)}
  //   key={item._id}
  //   style={styles.recipeCardContainer}>
  //     <View style={styles.recipeCard}>
  //       <Image
  //       style={styles.recipeImage}
  //       source={{uri: this._setImage(item.picture) }}
  //       ></Image>
  //       <Text style={[styles.name, styles.font]}>{item.name}</Text>
  //       <Text style={[styles.snippet, styles.font]}>{this._shortenSnippet(item.snippet)}</Text>
  //       <View style={styles.infoContainer}>
  //         <Text style={[styles.infoText, styles.font]}>Difficulty: {item.difficulty}/5</Text>
  //         <Text style={[styles.infoText, styles.font]}>Duration: {item.duration}mins</Text>
  //       </View>
  //     </View>
  //   </TouchableHighlight>
  // )//Won't work without binding the navigate function somehow to the function


  // <SearchBar
  // round
  // lightTheme
  // onChangeText={this._search(text)}
  // // onClearText={someMethod}
  // placeholder='Type Here...' />
  //
  _search(text) {
    const searchField = []
    // this.setState({
    //   searchBox: text
    // })
    // return 'working'
  }

  _renderLandingPage = () => {
    const { navigate } = this.props.navigation
    const text = this.state.loading ? 'Loading...' : 'Loaded'

    if(this.state.loading) {
      return (
        <ImageBackground
        style={styles.backGround}
        source={require('../assets/images/seigaiha.png')}>
          <Text style={[styles.loading, styles.font]}>{text}</Text>
        </ImageBackground>
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
        <ImageBackground
        style={styles.backGround}
        source={require('../assets/images/seigaiha.png')}>
          <FlatList
            data={this.state.recipes}
            renderItem={({ item }) => (
            <TouchableHighlight
            onPress={() => navigate('Recipe', item)}
            key={item._id} style={styles.recipeCardContainer}>
              <View style={styles.recipeCard}>
                <Image
                style={styles.recipeImage}
                source={{uri: this._setImage(item.picture) }}
                ></Image>
                <View style={styles.overlap}>
                  <Text style={[styles.name, styles.font]}>{item.name}</Text>
                  <Text style={[styles.snippet, styles.font]}>{this._shortenSnippet(item.snippet)}</Text>
                  <View style={styles.infoContainer}>
                    <Text style={[styles.infoText, styles.font]}>Difficulty: {item.difficulty}/5</Text>
                    <Text style={[styles.infoText, styles.font]}>Duration: {item.duration}mins</Text>
                  </View>
                </View>
              </View>
            </TouchableHighlight>
          )}
          keyExtractor={(item, index) => index}
          />
        </ImageBackground>
      )
    }
  }

  render() {
    return (
      <View>
        {this._renderLandingPage()}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  font: {
    fontFamily: 'Baskerville',
  },
  backGround: {
    width: ScreenWidth,
  },
  overlap: {
    backgroundColor: "#fff",
    marginTop: -100,
    paddingTop: -100,
    opacity: 0.7,
    width: ScreenWidth,
  },
  loading: {
    height: ScreenHeight,
    textAlign:'center',
    fontSize: 28,
    backgroundColor:'transparent',
  },
  recipeCardContainer: {
    backgroundColor: "transparent",
    width: ScreenWidth,
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
    borderRadius: 10,
    opacity: 0.9,
  }
})


export default HomeScreen
