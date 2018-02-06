
const fbConfig = {
apiKey: "AIzaSyDhsH4FXxdlN9UegLr0_P2UDuOXp-WySk0",
authDomain: "react-native-firebase-st-d0137",
databaseURL: "https://react-native-firebase-st-d0137.firebaseio.com/"
}//TODO: move over to .env file. or build login function

import firebase from 'firebase' // 4.8.1

try {
    firebase.initializeApp(fbConfig)
} catch (err) {
    if (!/already exists/.test(err.message)) {
        console.error('Firebase initialization error', err.stack)
    }
}

module.export = databaseCall(){
    firebase.database().ref().on('value', (snapshot) => {
    const data = snapshot.val().recipesdb
    this.setState({
        ...this.state,
        recipes: data,
        loading: !this.state.loading,
        })
    })
}