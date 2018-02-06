import React from 'react'
import { 
    View, Text, 
    TextInput, 
    TouchableOpacity, 
    Dimensions, 
    ImageBackground, 
    StyleSheet, 
    KeyboardAvoidingView,
} from 'react-native'
import { Button } from 'react-native-elements'

// import styles from '../styles.js'//TODO: need to import styles somehow without losing connection to window object

var ScreenHeight = Dimensions.get("window").height//not in use now that background has been removed
var ScreenWidth = Dimensions.get("window").Width

import firebase from 'firebase'

const config = {
  apiKey: "AIzaSyDhsH4FXxdlN9UegLr0_P2UDuOXp-WySk0",
  authDomain: "react-native-firebase-st-d0137",
  databaseURL: "https://react-native-firebase-st-d0137.firebaseio.com/"
}

class LoginScreen extends React.Component {

    constructor() {
        super()
        this.state = {
            isLoggedIn: false,
            email: null,
            password: null,
            loading: true,
            error: null,
        }
      }

  static navigationOptions = ({ navigation }) => ({
    title: 'Login',
  })

  _onPress = () => {
    console.log('you have submited')
    console.log(this.state.email)
    console.log(this.state.password)
    
    const email = this.state.email
    const password = this.state.password
      
    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error, res) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...
        console.log(res);
        
      })
  }
  _helloworld = () => {
      console.log("HELLLLLLO~!!")
  }

  _renderLandingPage = () => {
    const { navigate } = this.props.navigation

    if (this.state.isLoggedIn) {
    return <Secured 
        onLogoutPress={() => this.setState({isLoggedIn: false})}
      />
    }
    else if (this.state.error) {
      return <View><Text style={styles.font}>Error: {this.state.error}</Text></View>
    }
    else if (this.state.isLoggedIn) {
      return <View><Text style={styles.font}>Already logged in as {this.state.user}</Text></View>
    }
    else {
      return (
        <KeyboardAvoidingView behavior="padding" style={styles.container}>
            <ImageBackground style={styles.backGround}
            source={require('../assets/images/seigaiha.png')}>
                <View style={styles.loginContainer}>
                    <TextInput 
                    style = {styles.input} 
                    autoCapitalize="none" 
                    onSubmitEditing={() => this.passwordInput.focus()} 
                    onChangeText={(text) => this.setState({email: text})}
                    autoCorrect={false} 
                    keyboardType='email-address' 
                    returnKeyType="next" 
                    placeholder='Email' 
                    placeholderTextColor='#505050' />
                    <TextInput style = {styles.input}   
                    returnKeyType="go" 
                    ref={(input)=> this.passwordInput = input} 
                    placeholder='Password' 
                    onChangeText={(text) => this.setState({password: text})}
                    placeholderTextColor='#505050' 
                    secureTextEntry />
                    <TouchableOpacity style={styles.buttonContainer} 
                            onPress={this._onPress}
                            >
                        <Text  style={styles.buttonText}>LOGIN</Text>
                    </TouchableOpacity> 
                </View>
            </ImageBackground>
        </KeyboardAvoidingView>
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
    input: {
        color: '#000',
        height: 40,
        paddingLeft: 15,
        margin: 20,
        width: "90%",
        backgroundColor: "#fff",
    },
    loginContainer: {
        padding: 20,
        alignItems: 'center',
        width: "90%",
        opacity: 0.7,
        borderRadius: .5,
        marginTop: 10,
        marginLeft: "5%",
    },
    font: {
        fontFamily: 'American Typewriter',
        fontSize: 16,
        opacity: 0.9,
    },
    backGround: {
     width: ScreenWidth,
     height: ScreenHeight,
    },
    buttonContainer:{
        marginTop: 15,
        backgroundColor: '#2980b6',
        paddingVertical: 15,
        width: "90%",
    },
    buttonText:{
        color: '#fff',
        textAlign: 'center',
        fontWeight: '700'
    }
})

export default LoginScreen
