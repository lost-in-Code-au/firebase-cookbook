import React from 'react'
import {
	Dimensions,
	StyleSheet,
	ImageBackground,
	Text, TextInput,
	View, Alert,
	FlatList,
	TouchableHighlight,
	TouchableOpacity,
	Image, Button,
	ActionSheetIOS,
	ScrollView,
	KeyboardAvoidingView
} from 'react-native'

//Alpha version feedback
import Feedback from '../components/Utils/AlphaUserFeedback'

import firebase, { createNewObjIn, dataBaseRequest, userSignOut } from '../components/Utils/FirebaseUtil'

var ScreenHeight = Dimensions.get('window').height
var ScreenWidth = Dimensions.get('window').width
const MAX_SNIPPET_LENGTH = 75

class StagingScreen extends React.Component {
	constructor() {
		super()
		this.state = {
			currentUser: null,
			recipes: [],
			loading: true,
			error: null,

		}
	}

	static navigationOptions = ({ navigation }) => ({
		headerTitle: 'Stagging Area',
	})

	componentDidMount = () => {	
	}



//================================================Staging area for component functions=============================


//================================================Staging area for component functions=============================





	render() {
		return (
			<ImageBackground style={styles.backGround}
			source={require('../assets/images/seigaiha.png')}>
{/* Staging of JSX component area */}{/* Staging of JSX component area */}{/* Staging of JSX component area */}

			<Feedback page='Staging' />

{/* Staging of JSX component area */}{/* Staging of JSX componentv */}{/* Staging of JSX component area */}
			</ImageBackground>
		)
	}
}

const styles = StyleSheet.create({
	backGround: {
		width: ScreenWidth,
	},
})


export default StagingScreen
