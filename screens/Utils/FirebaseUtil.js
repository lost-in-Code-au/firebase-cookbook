

import firebase from 'firebase'

const config = {
	apiKey: 'AIzaSyDhsH4FXxdlN9UegLr0_P2UDuOXp-WySk0',
	authDomain: 'react-native-firebase-st-d0137',
	databaseURL: 'https://react-native-firebase-st-d0137.firebaseio.com',
	storageBucket: 'gs://react-native-firebase-st-d0137.appspot.com/'
}

firebase.initializeApp(config)

export function userLogin(email, password) {
	return firebase.auth().signInWithEmailAndPassword(email, password)
}

export function signUp(email, password) {
	return firebase.auth().createUserWithEmailAndPassword(email, password)
}


export function dataBaseRequest(dBRoot) {
	return firebase.database().ref(dBRoot).once('value')
}

export const userCheck = () => {
	return firebase.auth().currentUser
}

export const userSignOut = () => {
	return firebase.auth().signOut()
}
export const createRecipe = (newRecipe) => {
	return firebase.database().ref('recipes').set(newRecipe)
}


export default firebase
