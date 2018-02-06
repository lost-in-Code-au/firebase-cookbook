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

class LoginScreen extends React.Component {

    constructor() {
        super()
        this.state = {
          user: false,
          loading: true,
          error: null,
        }
      }

  static navigationOptions = ({ navigation }) => ({
    title: 'Login',
  })

  _renderLandingPage = () => {
    const { navigate } = this.props.navigation

    if (this.state.error) {
      return <View><Text style={styles.font}>Error: {this.state.error}</Text></View>
    }
    else if (this.state.user) {
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
                    autoCorrect={false} 
                    keyboardType='email-address' 
                    returnKeyType="next" 
                    placeholder='Email' 
                    placeholderTextColor='#505050'/>
                </View>
                <View style={styles.loginContainer}>
                    <TextInput style = {styles.input}   
                    returnKeyType="go" 
                    ref={(input)=> this.passwordInput = input} 
                    placeholder='Password' 
                    placeholderTextColor='#505050' 
                    secureTextEntry/>
                </View>
                <TouchableOpacity style={styles.buttonContainer} 
                        //  onPress={onButtonPress}
                        >
                    <Text  style={styles.buttonText}>LOGIN</Text>
                </TouchableOpacity> 
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
        height: 20,
        color: '#fff'
    },
    loginContainer: {
        padding: 20,
        backgroundColor: "#fff",
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
        paddingVertical: 15
    },
    buttonText:{
        color: '#fff',
        textAlign: 'center',
        fontWeight: '700'
    }
})

export default LoginScreen
