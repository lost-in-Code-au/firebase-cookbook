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
	const result = []

	return firebase.database().ref(dBRoot).once('value', (data) => {
		data.forEach((childSnapshot) => {
			result.push(childSnapshot.val())
		})
	}).then(() => result)
}//TODO: add limitor to prevent over downloading infomation

export const userCheck = () => {
	return firebase.auth().currentUser
}

export const userSignOut = () => {
	return firebase.auth().signOut()
}

export function createKeyForPostFrom(dBRoot) {
	return firebase.database().ref().child(dBRoot).push().key
}

//you'll have to call createKeyForPost first before calling this function, then you'll have to new id for the new object
export function createNewObjIn(dBRoot, newObject) {
	return firebase.database().ref(dBRoot).push(newObject)
}

//User .set carefully! it rewrites over all children... basically don't user it, use update instead ^
// export function createNewRoot(newRoot, newObject) {
// 	return firebase.database().ref(newRoot).set(newObject)
// }


export default firebase
