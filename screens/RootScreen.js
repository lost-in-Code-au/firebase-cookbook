import React from 'react'
import { ImageBackground, Text, View, Dimensions, StyleSheet } from 'react-native'
var ScreenHeight = Dimensions.get("window").height//not in use now, is messes up the background
var ScreenWidth = Dimensions.get("window").width

export default class Root extends React.Component {
	


	render = () => {
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