

import firebase from 'firebase'

const config = {
	apiKey: 'AIzaSyDhsH4FXxdlN9UegLr0_P2UDuOXp-WySk0',
	authDomain: 'react-native-firebase-st-d0137',
	databaseURL: 'https://react-native-firebase-st-d0137.firebaseio.com',
	storageBucket: 'gs://react-native-firebase-st-d0137.appspot.com/'
}

firebase.initializeApp(config)

//this export still needs work, if used it creates bugs within the signin error handling
// might need to change const to function like dataBaseRequest(dBRoot)
export const authConfigLocal = (input, code) => {
	var email = input
	var password = code
	return firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
		.then(function(response) {
			console.log(response)
			// LOCAL Indicates that the state will be persisted even when the browser window is 
			// closed or the activity is destroyed in React Native. An explicit sign out is 
			// needed to clear that state. Note that Firebase Auth web sessions are single host 

			//TODO: doesn't work, signIn can't see what email and password params are.
			return firebase.auth().signInWithEmailAndPassword(email, password)
		})
		.catch(function(error) {
			// Handle Errors here.
			// var errorCode = error.code
			var errorMessage = error.message
			console.log(errorMessage)
		})
}

export function userLogin(email, password) {
	return firebase.auth().signInWithEmailAndPassword(email, password)
}

export function signUp(email, password) {
	return firebase.auth().createUserWithEmailAndPassword(email, password)
}


export function dataBaseRequest(dBRoot) {
	return firebase.database().ref(dBRoot).once('value')
}

// No longer required to hit database
// export const requestRecipes = () => {
// 	return firebase.database().ref('recipes').once('value')
// }

// export const requestUsers = () => {
// 	return firebase.database().ref('users').once('value')
// }

// export const requestDiets = () => {
// 	return firebase.database().ref('dietTypes').once('value')
// }

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
