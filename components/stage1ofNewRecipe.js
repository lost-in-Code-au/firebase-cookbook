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

//================================================Staging area for component outer class functions=============================

const submitionAlert = (options, callback) => {
	const isfalse = (currentValue) => {
		return currentValue
	}//needs to be tested a bit

	if( options.every(isfalse) === false ){
		Alert.alert(
			'Wait up!',
			"Something's is missing from your recipe",
			{ cancelable: true }
		)
	} else {
		callback()
	}
}

const customActionSheet = (options, callback) => {
	ActionSheetIOS.showActionSheetWithOptions({
		options,
		destructiveButtonIndex: options.length,
		cancelButtonIndex: options.length
	}, (index) => {
		if(index === options.length) {
			return
		}
		callback(index)
	})
}

//================================================Staging area for component outer class functions=============================
//TODO list: 
// 1) reidrect after susscessful submition
// 2) convert base64 img and upload to firebase
// 3) push uploaded uri from the img post to the recipe submition
// 4) cleanup styles of buttons
// 5) link TextInput(durationInput) to the frist actoinSheet
// 6) lastly move all of stage one/recipe submit to it's own component.(maybe a bit complex)

class StagingScreen extends React.Component {
	constructor() {
		super()
		this.state = {
			//setup
			error: null,
			dietTypes: null,

			//image encoding
			image: null,
			file: null,
			progress: null,
	
			//models
			recipe: {
				name: null,
				author: null,
				snippet: null,
				diet: null,
				difficulty: null,
				duration: null,
				rating: null,
			},
			ingredients: [''],
			steps: [''],
			picture: 'http://via.placeholder.com/300.png/09f/fff',
			
			//flags
			firstStageSubmit: false,
			secoundStageSubmit: false,
			thridStageSubmit: false,

			previewStage: false
		}
	}

	static navigationOptions = ({ navigation }) => ({
		headerTitle: 'Stagging Area',
	})

	componentDidMount = () => {	


	}



//====================================== Staging area for component functions =============================
	
	_renderButton = (text, onPress, buttonStyle, textStyle) => (
		<TouchableOpacity  style={buttonStyle} onPress={onPress}>
				<Text style={textStyle}>{text}</Text>
		</TouchableOpacity>
	)

	_renderForm = () => {
		const { navigate } = this.props.navigation
		if(!this.state.firstStageSubmit) {			
			return (
				<View style={styles.container}>
					<TextInput 
						style = {styles.textInputContainer} 
						maxLength={35}
						onSubmitEditing={() => this.authorInput.focus()} 
						onChangeText={(nameInput) => this.setState({ ...this.state, recipe: { ...this.state.recipe, name: nameInput }})}
						autoCorrect={true} 
						returnKeyType='next'
						placeholder='Add the name of recipe' 
						value={this.state.recipe.name}
						placeholderTextColor='#505050' />
					<TextInput 
						style = {styles.textInputContainer} 
						maxLength={30}
						ref={(input)=> this.authorInput = input} 
						onSubmitEditing={() => this.snippetInput.focus()} 
						onChangeText={(authorName) => this.setState({ ...this.state, recipe: { ...this.state.recipe, author: authorName }})}
						autoCorrect={true} 
						returnKeyType='next'
						placeholder='Add the name of author' 
						value={this.state.recipe.author}
						placeholderTextColor='#505050' />
					<TextInput 
						style = {styles.textInputContainer} 
						maxLength={100}
						ref={(input)=> this.snippetInput = input} 
						onSubmitEditing={() => this.durationInput.focus()} 
						onChangeText={(snippetInput) => this.setState({ ...this.state, recipe: { ...this.state.recipe, snippet: snippetInput }})}
						autoCorrect={true} 
						returnKeyType='next'
						placeholder='Add your summary of the Recipe' 
						value={this.state.recipe.snippet}
						placeholderTextColor='#505050' />
					<TextInput 
						style = {styles.textInputContainer} 
						maxLength={3}
						ref={(input)=> this.durationInput = input} 
						onSubmitEditing={() => this.durationInput.focus()} 
						onChangeText={(durationInput) => this.setState({ ...this.state, recipe: { ...this.state.recipe, duration: durationInput }})}
						autoCorrect={false} 
						keyboardType='numeric'
						returnKeyType='done'
						placeholder='Add the time your Recipe takes' 
						value={this.state.recipe.duration}
						placeholderTextColor='#505050' />

					<TouchableOpacity style={styles.actionSheetContainer}  onPress={this._dietActionSheet}>
						<Text style={styles.textInput}>{this.state.recipe.diet ? this.state.recipe.diet :  'Select diet type' }</Text>
					</TouchableOpacity> 

					<TouchableOpacity style={styles.actionSheetContainer}  onPress={this._difActionSheet}>
						<Text style={styles.textInput}>{this.state.recipe.difficulty ? this.state.recipe.difficulty + ' lvl' : 'Select the difficulty of the recipe'}</Text>
					</TouchableOpacity>

					{this._renderButton('Next', this._submitRecipe, styles.stage1ButtonContainer, styles.buttonText)}
				</View>
			)
		}
	}

//====================================== Staging area for component functions=============================





//====================================== Staging of JSX component area ===================================
	render() {
		return (
			<ImageBackground style={styles.backGround}
			source={require('../assets/images/seigaiha.png')}>


				<KeyboardAvoidingView behavior="padding" style={styles.backGround}>
					<ScrollView >
						{this._renderForm()}
					</ScrollView>
				</KeyboardAvoidingView> 


			</ImageBackground>
		)
	}
}
//====================================== Staging of JSX component area ===================================


const styles = StyleSheet.create({
	backGround: {
		width: ScreenWidth,
	},

	//Staging of JSX component styles
	textInputContainer: {
		color: '#505050',
		height: 40,
		paddingLeft: 10,
		marginTop: 20,
		marginLeft: '10%',
		width: '80%',
		backgroundColor: '#fff',
	},
	actionSheetContainer: {
		height: 40,
		paddingLeft: 10,
		marginTop: 20,
		marginLeft: '10%',
		width: '80%',
		backgroundColor: '#fff',
	},
	textInput: {
		color: '#505050',
		height: 40,
		paddingTop: 10,
	},
	stage1ButtonContainer: {
		padding: 10,
		marginTop: 20,
		backgroundColor: '#4097c9',
		marginLeft: '10%',
		width: '80%',
	},
	buttonText: {
		fontWeight: 'bold',
		textAlign: 'center',
		color: '#505050',
	},
})


export default StagingScreen
