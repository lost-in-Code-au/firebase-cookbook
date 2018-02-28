import React from 'react'
import { ImageBackground, Text, View, Dimensions, StyleSheet } from 'react-native'
import firebase from '../components/Utils/FirebaseUtil'//to start FB instance and check if a user is logged in already.
const ScreenHeight = Dimensions.get('window').height
const ScreenWidth = Dimensions.get('window').width

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
	
	render() {
		return (
			<View>
				<ImageBackground
					style={styles.backGround}
					source={require('../assets/images/seigaiha.png')}>
					<Text style={[styles.loading, styles.font]}>Loading...</Text>
				</ImageBackground>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	font: {
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