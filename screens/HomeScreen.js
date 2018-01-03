import React from 'react'
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
  Image,
  Button,

  Platform,
  ScrollView,
  TouchableOpacity,
} from 'react-native'
import { WebBrowser } from 'expo'

import { MonoText } from '../components/StyledText'

import * as firebase from 'firebase'

const config = {
  apiKey: "AIzaSyDhsH4FXxdlN9UegLr0_P2UDuOXp-WySk0",
  authDomain: "react-native-firebase-st-d0137",
  databaseURL: "https://react-native-firebase-st-d0137.firebaseio.com/"
}

firebase.initializeApp(config)

var ScreenHeight = Dimensions.get("window").height
var ScreenWidth = Dimensions.get("window").Width
const MAX_SNIPPET_LENGTH = 75

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

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
      console.log(data)

    })
  // .catch((err) => {
  //   console.log(err)
  //   this.setState({...this.state, error: true, loading: false})
  // })//TODO: err catch needs to be researched on react-native-firebase package
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
        <View style={styles.footer}>
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

  // render() {
    // return (
    //   <View style={styles.container}>
    //     <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
    //       <View style={styles.welcomeContainer}>
    //         <Image
    //           source={
    //             __DEV__
    //               ? require('../assets/images/robot-dev.png')
    //               : require('../assets/images/robot-prod.png')
    //           }
    //           style={styles.welcomeImage}
    //         />
    //       </View>
    //
    //       <View style={styles.getStartedContainer}>
    //         {this._maybeRenderDevelopmentModeWarning()}
    //
    //         <Text style={styles.getStartedText}>Get started by opening</Text>
    //
    //         <View style={[styles.codeHighlightContainer, styles.homeScreenFilename]}>
    //           <MonoText style={styles.codeHighlightText}>screens/HomeScreen.js</MonoText>
    //         </View>
    //
    //         <Text style={styles.getStartedText}>
    //           Change this text and your app will automatically reload.
    //         </Text>
    //       </View>
    //
    //       <View style={styles.helpContainer}>
    //         <TouchableOpacity onPress={this._handleHelpPress} style={styles.helpLink}>
    //           <Text style={styles.helpLinkText}>Help, it didn’t automatically reload!</Text>
    //         </TouchableOpacity>
    //       </View>
    //     </ScrollView>
    //
    //     <View style={styles.tabBarInfoContainer}>
    //       <Text style={styles.tabBarInfoText}>This is a tab bar. You can edit it in:</Text>
    //
    //       <View style={[styles.codeHighlightContainer, styles.navigationFilename]}>
    //         <MonoText style={styles.codeHighlightText}>navigation/MainTabNavigator.js</MonoText>
    //       </View>
    //     </View>
    //   </View>
    // )
  // }

  _maybeRenderDevelopmentModeWarning() {
    if (__DEV__) {
      const learnMoreButton = (
        <Text onPress={this._handleLearnMorePress} style={styles.helpLinkText}>
          Learn more
        </Text>
      );

      return (
        <Text style={styles.developmentModeText}>
          Development mode is enabled, your app will be slower but you can use useful development
          tools. {learnMoreButton}
        </Text>
      );
    } else {
      return (
        <Text style={styles.developmentModeText}>
          You are not in development mode, your app will run at full speed.
        </Text>
      );
    }
  }

  _handleLearnMorePress = () => {
    WebBrowser.openBrowserAsync('https://docs.expo.io/versions/latest/guides/development-mode');
  };

  _handleHelpPress = () => {
    WebBrowser.openBrowserAsync(
      'https://docs.expo.io/versions/latest/guides/up-and-running.html#can-t-see-your-changes'
    );
  };
}

const styles = StyleSheet.create({
  font: {
    fontFamily: 'Baskerville',
  },
  // backGround: {
  //   backgroundColor: '#fff',
  // },
  img: {
    margin: 10,
    padding: 30,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  footer: {
  },
  statusBar: {
    height: 20,
  },
  loading: {
    textAlign:'center',
    fontSize: 28,
    backgroundColor: '#fff',
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
    fontWeight: "bold",
    margin: 5,
  },
  snippet: {
    fontWeight: "bold",
    margin: 5,
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  infoText: {
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
  },
  recipeImage: {
    width: ScreenWidth,
    height: 300,
    borderRadius: 50,
  }
})
//
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   developmentModeText: {
//     marginBottom: 20,
//     color: 'rgba(0,0,0,0.4)',
//     fontSize: 14,
//     lineHeight: 19,
//     textAlign: 'center',
//   },
//   contentContainer: {
//     paddingTop: 30,
//   },
//   welcomeContainer: {
//     alignItems: 'center',
//     marginTop: 10,
//     marginBottom: 20,
//   },
//   welcomeImage: {
//     width: 100,
//     height: 80,
//     resizeMode: 'contain',
//     marginTop: 3,
//     marginLeft: -10,
//   },
//   getStartedContainer: {
//     alignItems: 'center',
//     marginHorizontal: 50,
//   },
//   homeScreenFilename: {
//     marginVertical: 7,
//   },
//   codeHighlightText: {
//     color: 'rgba(96,100,109, 0.8)',
//   },
//   codeHighlightContainer: {
//     backgroundColor: 'rgba(0,0,0,0.05)',
//     borderRadius: 3,
//     paddingHorizontal: 4,
//   },
//   getStartedText: {
//     fontSize: 17,
//     color: 'rgba(96,100,109, 1)',
//     lineHeight: 24,
//     textAlign: 'center',
//   },
//   tabBarInfoContainer: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     ...Platform.select({
//       ios: {
//         shadowColor: 'black',
//         shadowOffset: { height: -3 },
//         shadowOpacity: 0.1,
//         shadowRadius: 3,
//       },
//       android: {
//         elevation: 20,
//       },
//     }),
//     alignItems: 'center',
//     backgroundColor: '#fbfbfb',
//     paddingVertical: 20,
//   },
//   tabBarInfoText: {
//     fontSize: 17,
//     color: 'rgba(96,100,109, 1)',
//     textAlign: 'center',
//   },
//   navigationFilename: {
//     marginTop: 5,
//   },
//   helpContainer: {
//     marginTop: 15,
//     alignItems: 'center',
//   },
//   helpLink: {
//     paddingVertical: 15,
//   },
//   helpLinkText: {
//     fontSize: 14,
//     color: '#2e78b7',
//   },
// });
