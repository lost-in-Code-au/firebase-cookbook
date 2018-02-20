import React from 'react'
import { ImageBackground, Text, View, Dimensions, StyleSheet } from 'react-native'
import firebase from '../screens/Utils/FirebaseUtil'//to start FB instance and check if a user is logged in already.
var ScreenHeight = Dimensions.get("window").height//not in use now, is messes up the background
var ScreenWidth = Dimensions.get("window").Width

export default class Root extends React.Component {
	constructor() {
		super()
		this.state = {
            loading: true,
            currentUser: null,
			error: null,
		}
	}

	componentDidMount() {
        const { navigate } = this.props.navigation
        firebase.auth().onAuthStateChanged((user) => {
			if (user) {
				console.log('user is already logged in')

				this.setState({
					...this.state,
					currentUser: user.uid,
					loading: !this.state.loading,
                })
                navigate('Home', this.state.currentUser)
			} else {
				console.log('no user')
				this.setState({
					...this.state,
					loading: !this.state.loading,
                })
                navigate('Login')
			}
		})
    }
    
    _userExists = () => {        
        const text = this.state.loading ? 'Loading...' : 'Loaded'
        console.log(this.state)
		if(this.state.loading) {			
            return (
                <View>
					<ImageBackground
						style={styles.backGround}
						source={require('../assets/images/seigaiha.png')}>
						<Text style={[styles.loading, styles.font]}>{text}</Text>
					</ImageBackground>
				</View>
			)
        }
    }

	render() {
        return <View>{this._userExists()}</View>
	}
}

const styles = StyleSheet.create({
	font: {
		fontFamily: 'American Typewriter',
		fontSize: 16,
	},
	backGround: {
		width: ScreenWidth,
	},
	loading: {
		backgroundColor:'transparent',
		height: ScreenHeight,
		textAlign:'center',
		fontSize: 28,
		paddingTop: 230,
	},
})