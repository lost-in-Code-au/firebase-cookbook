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



//================================================Staging area for component functions=============================

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

//================================================Staging area for component functions=============================





	render() {
		return (
			<ImageBackground style={styles.backGround}
			source={require('../assets/images/seigaiha.png')}>
{/* Staging of JSX component area */}{/* Staging of JSX component area */}{/* Staging of JSX component area */}

			

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
