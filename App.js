import React from 'react';
import { StyleSheet, Platform, Image, Text, View } from 'react-native';

import firebase from 'react-native-firebase';

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
    const db = firebase.database().ref().toJSON

    console.log("firebase.db: ", firebase.database().ref().toJSON)
    return (
      <View style={styles.container}>
        <Image source={require('./assets/RNFirebase512x512.png')} style={[styles.logo]} />
        <Text style={styles.welcome}>
          Welcome to the React Native{'\n'}Firebase starter project!
        </Text>
        <Text style={styles.instructions}>
          To get started, edit App.js
        </Text>
        {Platform.OS === 'ios' ? (
          <Text style={styles.instructions}>
            Press Cmd+R to reload,{'\n'}
            Cmd+D or shake for dev menu
          </Text>
        ) : (
          <Text style={styles.instructions}>
            Double tap R on your keyboard to reload,{'\n'}
            Cmd+M or shake for dev menu
          </Text>
        )}
        <View style={styles.modules}>
          <Text style={styles.modulesHeader}>The following Firebase modules are enabled:</Text>
          {firebase.database.nativeModuleExists && <Text style={styles.module}>Realtime Database</Text>}



          {firebase.config.nativeModuleExists && <Text style={styles.module}>Remote Config</Text>}

        </View>
      </View>
    );
  }
}
// {firebase.auth.nativeModuleExists && <Text style={styles.module}>Authentication</Text>}
// {firebase.messaging.nativeModuleExists && <Text style={styles.module}>Messaging</Text>}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  logo: {
    height: 80,
    marginBottom: 16,
    width: 80,
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
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
});
