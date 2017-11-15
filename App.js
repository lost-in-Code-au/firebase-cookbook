import React from 'react';
import { Dimensions, StyleSheet, Platform, Image, Text, View, StatusBar } from 'react-native';

import firebase from 'react-native-firebase';

var ScreenHeight = Dimensions.get("window").height
var ScreenWidth = Dimensions.get("window").Width
// var SBHeight = StatusBar.currnetHeight //for android

const config = {
  apiKey: "AIzaSyDhsH4FXxdlN9UegLr0_P2UDuOXp-WySk0",
  authDomain: "react-native-firebase-st-d0137",
  databaseURL: "https://react-native-firebase-st-d0137.firebaseio.com/"
}

firebase.initializeApp(config)

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      // firebase things?
    };

  }

  componentDidMount() {
    // firebase things?
  }



  render() {

    const db = firebase.database()

    db.ref().once('value').then(function(snapshot) {
      console.log(snapshot.val())
      data = snapshot.val()
      return data
    })

    // const recipes = function renderData() {
    //
    // }

    return (
      <View>
        <View  style={styles.statusBar}>
          <StatusBar />
        </View>
        <Image source={require('./assets/bg.png')} style={[styles.backGround]}>
          <View  style={styles.container}>
            <View>
              <Text style={styles.welcome}>
                Klassen & Jones CookBook
              </Text>
            </View>
            <Text style={styles.instructions}>

            </Text>
          </View>
        </Image>
      </View>
    )
  }
}
// {firebase.auth.nativeModuleExists && <Text style={styles.module}>Authentication</Text>}
// {firebase.messaging.nativeModuleExists && <Text style={styles.module}>Messaging</Text>}

const styles = StyleSheet.create({
  statusBar: {
    backgroundColor: '#fff',
    height: 20,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backGround: {
    height: ScreenHeight,
    width: ScreenWidth,
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    backgroundColor:'transparent',
    color: '#fff'
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  modules: {
    margin: 20,
  },
  modulesHeader: {
    fontSize: 16,
    marginBottom: 8,
  },
  module: {
    fontSize: 14,
    marginTop: 4,
    textAlign: 'center',
  }
})
