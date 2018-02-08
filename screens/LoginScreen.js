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

import firebase from './Utils/FirebaseUtil'

// import styles from '../styles.js'//TODO: need to import styles somehow without losing connection to window object

var ScreenHeight = Dimensions.get("window").height//not in use now that background has been removed
var ScreenWidth = Dimensions.get("window").Width

class LoginScreen extends React.Component {

    constructor() {
        super()
        this.state = {
            isLoggedIn: false,
            email: null,
            password: null,
            error: null,
            showWarning: null,
        }
    }

  static navigationOptions = ({ navigation }) => ({
    title: 'Login',
  })

  _onSignUp = () => {
    const { navigate } = this.props.navigation
    navigate('Signup')
  }

  _onPress = () => {
    const { navigate } = this.props.navigation
    
    const email = this.state.email
    const password = this.state.password
    
    firebase.auth().signInWithEmailAndPassword(email, password)
            .then((response) => {
                navigate('Home')
            })
            .catch(() => {
                this.setState({ 
                    ...this.state,
                    showWarning: 'Login failed, please check your login details... <3'
                }) 

                //
                //Login was not successful, let's create a new account
                // firebase.auth().createUserWithEmailAndPassword(email, password)
                //     .then(() => { this.setState({ error: '', loading: false }); })
                //     .catch(() => {
                //         this.setState({ error: 'Authentication failed.', loading: false });
                //     });
            })
  }

  _renderLandingPage = () => {
      return (
        <KeyboardAvoidingView behavior="padding" style={styles.container}>
            <ImageBackground style={styles.backGround}
            source={require('../assets/images/seigaiha.png')}>
                <View style={styles.loginContainer}>
                    <TextInput 
                    style = {styles.input} 
                    autoCapitalize="none" 
                    onSubmitEditing={() => this.passwordInput.focus()} 
                    onChangeText={(userEmail) => this.setState({email: userEmail})}
                    autoCorrect={false} 
                    keyboardType='email-address' 
                    returnKeyType="next" 
                    placeholder='Email' 
                    value={this.state.email}
                    placeholderTextColor='#505050' />
                    <TextInput style = {styles.input}   
                    returnKeyType="go" 
                    ref={(input)=> this.passwordInput = input} 
                    placeholder='Password' 
                    onChangeText={(passwordInput) => this.setState({password: passwordInput})}
                    placeholderTextColor='#505050' 
                    secureTextEntry />
                    {this.state.showWarning && <Text style={styles.showWarning}>{this.state.showWarning}</Text>}
                    <TouchableOpacity style={styles.buttonContainer} 
                            onPress={this._onPress}
                            >
                        <Text  style={styles.buttonText}>LOGIN</Text>
                    </TouchableOpacity> 
                </View>
                <TouchableOpacity style={styles.signupContainer}  onPress={this._onSignUp}>
                    <Text style={styles.signup}>Signup</Text>
                </TouchableOpacity>
            </ImageBackground>
        </KeyboardAvoidingView>
      )
  }
  //Velan Questions: how can I improve my image loading before everything else?
  

  render() {
    return (
      <View>
        {this._renderLandingPage()}
      </View>
    )
  }
}

const styles = StyleSheet.create({
    signupContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    signup: {
        backgroundColor:'transparent',
        color: '#00f',
        padding: 20,
        margin:20,
    },
    showWarning: {
        color: '#e00f04',
        backgroundColor:'transparent',
    },
    loading: {
        backgroundColor:'transparent',
    },
    input: {
        color: '#000',
        height: 40,
        paddingLeft: 15,
        margin: 20,
        width: '90%',
        backgroundColor: '#fff',
    },
    loginContainer: {
        padding: 20,
        alignItems: 'center',
        width: '90%',
        opacity: 0.7,
        borderRadius: .5,
        marginTop: 10,
        marginLeft: '5%',
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