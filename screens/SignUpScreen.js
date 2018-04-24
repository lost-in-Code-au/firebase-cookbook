import React from 'react'
import { 
    View, Text, 
    TextInput, 
    TouchableOpacity, 
    Dimensions, 
    ImageBackground, 
    StyleSheet, 
    KeyboardAvoidingView,
    Alert, ScrollView
} from 'react-native'
import { CheckBox } from 'react-native-elements'
import firebase, { signUp } from '../components/Utils/FirebaseUtil'

var ScreenHeight = Dimensions.get("window").height//not in use now that background has been removed
var ScreenWidth = Dimensions.get("window").width

class SignUpScreen extends React.Component {

    state = {
        currentUser: false,
        email: null,
        passwordCheck: null,
        password: null,
        error: null,
        showWarning: null,
        userHasAgreed: false,
    }
    
    static navigationOptions = ({ navigation }) => ({
        title: 'SignUp to grEat',
		headerStyle: {
			backgroundColor: '#D3D3D3',
			color: 'white'
		}
    })

    _onPress = () => {
        const { navigate } = this.props.navigation        
        const email = this.state.email
        const password = this.state.password

        signUp(email, password)
        .then((response) => {
            const { navigate } = this.props.navigation
            Alert.alert(
                'Yay! it worked!',
                'Successfully created your account, please check your email of confirmation link',
                [
                {text: 'Welcome to grEats!'},
                ],
                { cancelable: false }
            )
        })// onPress: () => navigate('Login')
        .catch((error) => {
			if (error.code === 'auth/email-already-in-use') {
                this.setState({ 
                    ...this.state,
                    showWarning: error.message
                }) 
            }
        })    
    }

    _renderLandingPage = () => {     
        if(!this.state.userHasAgreed) {
            return (
                <ImageBackground style={styles.backGround}
                source={require('../assets/images/seigaiha.png')}>
                    <View>
                        <ScrollView>
                            <Text style={styles.userAgreementBold}>
                                End-User License Agreement (EULA)
                            </Text>
                            <Text style={styles.userAgreementSub}>
                                Last updated: 1/4/2018
                            </Text>
                            <Text style={styles.userAgreement}>
                                Please read this End-User License Agreement carefully before clicking the "I Agree" checkbox, downloading or using My Application "grEats".
                            </Text>
                            <Text style={styles.userAgreement}>
                                By clicking the "I Agree" checkbox, downloading or using the Application, you are agreeing to be bound by the terms and conditions of this Agreement.
                            </Text>
                            <Text style={styles.userAgreement}>
                                If you do not agree to the terms of this Agreement, do not click on the "I Agree" button and do not download or use the Application.
                            </Text>
                            <Text style={styles.userAgreementBold}>
                                License
                            </Text>
                            <Text style={styles.userAgreement}>
                                My Company Lost-in-code grants you a revocable, non-exclusive, non-transferable, limited license to download, install and use the Application solely for your personal, non-commercial purposes strictly in accordance with the terms of this Agreement.
                            </Text>
                            <Text style={styles.userAgreementBold}>
                                Restrictions
                            </Text>
                            <Text style={styles.userAgreement}>
                                You agree not to, and you will not permit others to:

                                a) license, sell, rent, lease, assign, distribute, transmit, host, outsource, disclose or otherwise commercially exploit the Application or make the Application available to any third party.
                            </Text>
                            <Text style={styles.userAgreementBold}>
                                Modifications to Application
                            </Text>
                            <Text style={styles.userAgreement}>
                                My Company Lost-in-code reserves the right to modify, suspend or discontinue, temporarily or permanently, the Application or any service to which it connects, with or without notice and without liability to you.
                            </Text>
                            <Text style={styles.userAgreementBold}>
                                Term and Termination
                            </Text>
                            <Text style={styles.userAgreement}>
                                This Agreement shall remain in effect until terminated by you or My Company Lost-in-code. 

                                My Company Lost-in-code may, in its sole discretion, at any time and for any or no reason, suspend or terminate this Agreement with or without prior notice.

                                This Agreement will terminate immediately, without prior notice from My Company Lost-in-code, in the event that you fail to comply with any provision of this Agreement. You may also terminate this Agreement by deleting the Application and all copies thereof from your mobile device or from your desktop.

                                Upon termination of this Agreement, you shall cease all use of the Application and delete all copies of the Application from your mobile device or from your desktop.
                            </Text>
                            <Text style={styles.userAgreementBold}>
                                Severability
                            </Text>
                            <Text style={styles.userAgreement}>
                                If any provision of this Agreement is held to be unenforceable or invalid, such provision will be changed and interpreted to accomplish the objectives of such provision to the greatest extent possible under applicable law and the remaining provisions will continue in full force and effect.
                            </Text>
                            <Text style={styles.userAgreementBold}>
                                Amendments to this Agreement
                            </Text>
                            <Text style={styles.userAgreement}>
                                My Company Lost-in-code reserves the right, at its sole discretion, to modify or replace this Agreement at any time. If a revision is material we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
                            </Text>
                            <Text style={styles.userAgreementBold}>
                                Contact Information
                            </Text>
                            <Text style={styles.userAgreement}>
                                If you have any questions about this Agreement, please contact us at:    
                            </Text>
                            <Text style={styles.userAgreementEmail} onPress={() => Linking.openURL('mailto:mailto@lost.in.code.co@gmail.com?subject=abcdefg&body=body')}>    
                                lost.in.code.co@gmail.com
                            </Text>
                            <CheckBox
                                title='I Agree'
                                checked={this.state.userHasAgreed}
                                onPress={() => this.setState({userHasAgreed: true})}
                                containerStyle={styles.CheckBox}
                            />
                        </ScrollView>
                    </View>
                </ImageBackground>
            )
        }
        else if(this.state.userHasAgreed) {
                return (
                <KeyboardAvoidingView behavior="padding" style={styles.container}>
                    <ImageBackground style={styles.backGround}
                    source={require('../assets/images/seigaiha.png')}>
                        <View style={styles.loginContainer}>
                            <TextInput 
                            style = {styles.input} 
                            autoCapitalize="none" 
                            onSubmitEditing={() => this.passwordInput.focus()} 
                            onChangeText={(userEmail) => this.setState({...this.state, email: userEmail})}
                            autoCorrect={false} 
                            keyboardType='email-address' 
                            returnKeyType="next" 
                            placeholder='Email' 
                            value={this.state.email}
                            placeholderTextColor='#505050' />

                            <TextInput style = {styles.input}   
                            returnKeyType="next"
                            placeholder='Password'
                            onSubmitEditing={() => this.passwordCheck.focus()} 
                            ref={(input) => this.passwordInput = input} 
                            onChangeText={(value) => this.setState({...this.state, password: value})}
                            placeholderTextColor='#505050' 
                            secureTextEntry />
                            
                            <TextInput style = {styles.input}   
                            returnKeyType="go" 
                            placeholder='Password'
                            onSubmitEditing={this._onPress} 
                            ref={(input) => this.passwordCheck = input} 
                            onChangeText={(value) => this.setState({...this.state, passwordCheck: value})}
                            placeholderTextColor='#505050' 
                            secureTextEntry />
                            {this.state.showWarning && <Text style={styles.showWarning}>{this.state.showWarning}</Text>}
                            {(this.state.password !== this.state.passwordCheck) && <Text style={styles.showWarning}>Password does not match</Text>}
                            
                            <TouchableOpacity style={styles.buttonContainer} 
                                    onPress={this._onPress}
                                    >
                                <Text  style={styles.buttonText}>SignUp</Text>
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
    CheckBox: {
        height: 40,
        flex: 1,
        marginBottom: 80,
    },
    userAgreementBold: {
		backgroundColor: "transparent",
        fontWeight: "bold",
        height: 20,
        flex: 1,
        padding: 20,
        height: '10%',
		paddingBottom: 4,
    },
    userAgreementSub: {
		backgroundColor: "transparent",
        height: 40,
        flex: 1,
        padding: 20,
		paddingBottom: 6,
    },
    userAgreement: {
        textAlign: 'center',
		backgroundColor: "transparent",
        flex: 1,
        padding: 20,
		paddingBottom: 6,
    },
    userAgreementEmail: {
        textAlign: 'center',
		backgroundColor: "transparent",
        color: 'blue',
        textDecorationLine: 'underline',
        flex: 1,
		paddingBottom: 6,
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
        margin: 10,
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

export default SignUpScreen
