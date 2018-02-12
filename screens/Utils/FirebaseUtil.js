

import firebase from 'firebase'

const config = {
	apiKey: 'AIzaSyDhsH4FXxdlN9UegLr0_P2UDuOXp-WySk0',
	authDomain: 'react-native-firebase-st-d0137',
	databaseURL: 'https://react-native-firebase-st-d0137.firebaseio.com',
	storageBucket: 'gs://react-native-firebase-st-d0137.appspot.com/'
}

firebase.initializeApp(config)

export const grEatLogin = (email, password) => {
	return firebase.auth().signInWithEmailAndPassword(email, password)
}

export const signUp = (email, password) => {
	return firebase.auth().createUserWithEmailAndPassword(email, password)
}

export const requestRecipes = () => {
	return firebase.database().ref('recipes').once('value')
}

export const requestUsers = () => {
	return firebase.database().ref('users').once('value')
}

export default firebase
