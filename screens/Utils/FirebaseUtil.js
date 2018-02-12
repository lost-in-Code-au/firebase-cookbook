

import firebase from 'firebase'

const config = {
	apiKey: 'AIzaSyDhsH4FXxdlN9UegLr0_P2UDuOXp-WySk0',
	authDomain: 'react-native-firebase-st-d0137',
	databaseURL: 'https://react-native-firebase-st-d0137.firebaseio.com'
}

firebase.initializeApp(config)

export const signUp = (email, password) => {
	firebase.auth().createUserWithEmailAndPassword(email, password)
		.then((response) => {
			const { navigate } = this.props.navigation
			Alert.alert(
				'Yay! it worked!',
				'Successful created your account, please check your email of confirmation link',
				[
					{text: 'Return to login', onPress: () => navigate('Login')},
				],
				{ cancelable: false }
			)
		})
		.catch(() => {
			this.setState({ 
				...this.state,
				showWarning: 'Signup failed, please check your password is 6 charatars long and that your email is correct <3'
			}) 
		})
}

export const grEatLogin = (email, password) => {
	firebase.auth().signInWithEmailAndPassword(email, password)
		.then((response) => {
			navigate('Home')
		})
		.catch(() => {
			this.setState({ 
				...this.state,
				showWarning: 'Login failed, please check your login details... <3'
			}) 
		})
}

export default firebase
