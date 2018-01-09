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
    headerLeft: <Button title="Search" />,
    // headerRight: <Button title="Add" />,//TODO: create firebase writing Component
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

  // _renderItem = ({item}) => (
  //   <TouchableHighlight
  //   onPress={() => navigate('Recipe', item)}
  //   key={item._id}
  //   style={styles.recipeCardContainer}>
  //     <View style={styles.recipeCard}>
  //       <Image
  //       style={styles.recipeImage}
  //       source={{uri: this.setImage(item.picture) }}
  //       ></Image>
  //       <Text style={[styles.name, styles.font]}>{item.name}</Text>
  //       <Text style={[styles.snippet, styles.font]}>{this.shortenSnippet(item.snippet)}</Text>
  //       <View style={styles.infoContainer}>
  //         <Text style={[styles.infoText, styles.font]}>Difficulty: {item.difficulty}/5</Text>
  //         <Text style={[styles.infoText, styles.font]}>Duration: {item.duration}mins</Text>
  //       </View>
  //     </View>
  //   </TouchableHighlight>
  // )//Won't work without binding the navigate function somehow to the function

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
        <ImageBackground
        style={[styles.backGround, {width: ScreenWidth, height: ScreenHeight}]}
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
                source={{uri: this.setImage(item.picture) }}
                ></Image>
                <View style={styles.overlap}>
                  <Text style={[styles.name, styles.font]}>{item.name}</Text>
                  <Text style={[styles.snippet, styles.font]}>{this.shortenSnippet(item.snippet)}</Text>
                  <View style={styles.infoContainer}>
                    <Text style={[styles.infoText, styles.font]}>Difficulty: {item.difficulty}/5</Text>
                    <Text style={[styles.infoText, styles.font]}>Duration: {item.duration}mins</Text>
                  </View>
                </View>
              </View>
            </TouchableHighlight>
          )}
          />
        </ImageBackground>
      )
    }
  }

  render() {
    return (
      <View>
        {this.renderLandingPage()}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  font: {
    fontFamily: 'Baskerville',
  },
  overlap: {
    backgroundColor: "#fff",
    marginTop: -100,
    paddingTop: -100,
    opacity: 0.7,
    width: ScreenWidth,
  },
  loading: {
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
