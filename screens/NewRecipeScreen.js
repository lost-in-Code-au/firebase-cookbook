import React from 'react'
import {
	Dimensions,
	StyleSheet,
	ImageBackground,
	Text,
	ActionSheetIOS,
	View, ScrollView,
	TextInput,
	FlatList,
	TouchableOpacity, 
	KeyboardAvoidingView,
	Button, Alert
} from 'react-native'
import uuid from 'uuid'//keyGen

import firebase, { dataBaseRequest, createKeyForPostFrom, createNewObjIn } from './Utils/FirebaseUtil'

var ScreenHeight = Dimensions.get("window").height
var ScreenWidth = Dimensions.get("window").Width
const MAX_SNIPPET_LENGTH = 75

//Test identifier to ref without text in state.
const DIETS = ['No Diets', 'Vegeterian']

//abstracted fucntions
// const CustomTextInput = ({ maxLength, ref, submit, onChange, autoCorrect, returnKey, placeHolder, value}) => (
// 	<TextInput 
// 		style = {styles.textInputContainer} 
// 		maxLength={maxLength}
// 		ref={(input)=> this.{ref} = input} //should it be `this.${ref}.focus()`?
// 		onSubmitEditing={() => this.{submit}.focus()} //should it be `this.${submit}.focus()`?
// 		onChangeText={onChange}
// 		autoCorrect={autoCorrect}
// 		returnKeyType={returnKey}
// 		placeholder={placeHolder}
// 		value={value}
// 		placeholderTextColor='#505050' />
// )
// 	======>exaple component<=======
//		<CustomTextInput
//		maxLength=30
//		ref='authorInput'
//		submit='snippetInput'
//		onChange={(authorName) => this.setState({ ...this.state, author: authorName })} //handled in the element
//		autoCorrect={true}
// 		returnKey='next'
// 		placeHolder='Name of author'
// 		value={this.state.author}
//		/>
// 	

const submitionAlert = (options, callback) => {
	console.log('hellow!')
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
}//callback that doesn't concern it's self with class functions such as state.

class NewRecipeScreen extends React.Component {
	
	constructor() {
		super()
		this.state = {

			//setup
			error: null,
			dietTypes: null,
	
			//models
			recipe: {
				name: null,
				author: null,
				snippet: null,
				diet: 0,
				difficulty: 1,
				duration: null,
			},//move all of stage one into here
			ingredients: { id: 0,
			value: 'food' },//move all of stage two into here
			steps: { step: 0,
			value: 'here is a step' },//move all of stage three into here
			picture: 'http://via.placeholder.com/300.png/09f/fff',
			
			//flags
			firstStageSubmit: false,
			secoundStageSubmit: false,
			thridStageSubmit: false,

			previewStage: false
		}
	}
		
	static navigationOptions = ({ navigation }) => ({
		headerTitle: 'New grEat meal!',
	})

	componentDidMount() {
		dataBaseRequest('dietTypes').then((snapshot) => {
			let data = snapshot.val()
			data['Cancel'] = 'cancel'
			this.setState({
				...this.state,
				dietTypes: data,
				loading: !this.state.loading,
			})
		}).catch((error) => {
			console.log(error.message)
		})
	}

	_dietActionSheet = () => {
		// const options = this.state.dietTypes
		

		customActionSheet(DIETS, (index) => {
			this.setState({...this.state, recipe: 
				{
					...this.state.recipe,
					diet: DIETS[index]
				}
			})
		})
	}
	
	_difActionSheet = () => {
		const options = [ '1', '2', '3', '4', '5', 'cancel']

		customActionSheet(options, (index) => {
			this.setState({...this.state, recipe: 
				{ 
					...this.state.recipe,
					difficulty: options[index]
				}
			})
		}) 
	}
 
//Refactor 0.2 <==================================================================
//submitStage's needs to be made into a dynamic function, but having some trouble with the setStage accepting dynamic input.

	_submitRecipe = () =>{
		const recipe = this.state.recipe
		const options = [ recipe.name, recipe.author, recipe.snippet, recipe.duration, recipe.diet, recipe.difficulty ]
		
		submitionAlert(options, (callback) => {
			this.setState({ ...this.state, firstStageSubmit: true })
		}) 
	}

	_submitRecipeIngreedients = () => {
		const ingredients = this.state.ingredients
		const options = [ ingredients.placeholder ]
		console.log(options)


		// submitionAlert(options, (callback) => {
			this.setState({ ...this.state, secoundStageSubmit: true })
		// })
	}

	_submitRecipeSteps = () => {
		const steps = this.state.steps
		const options = [ steps.placeholder ]

		// submitionAlert(options, (callback) => {
			this.setState({ ...this.state, thridStageSubmit: true })
		// })
	}
// <=============================same thing as above=====================================
//having some trouble with the setStage accepting dynamic input.
	_stepBackToStageOne = () => {
		this.setState({ ...this.state, firstStageSubmit: false })
	}

	_stepBackToStageTwo = () => {
		this.setState({ ...this.state, secoundStageSubmit: false })
	}

	_stepBackToStageThree = () => {
		this.setState({ ...this.state, thridStageSubmit: false })
	}
//End of Refactor 0.2 <==================================================================

	_submitToFirebase = () => {
		const recipe = this.state.recipe
		const ingredients = this.state.ingredients
		const steps = this.state.steps

		const difficulty = parseInt(recipe.difficulty)
		console.log(difficulty)
		const duration = parseInt(recipe.duration)
		console.log(duration)

		const newKey = createKeyForPostFrom('recipes')
		
		// const newId = uuid()
		// let newRecipe = {}
		obj = {
			_id: newKey,
			name: recipe.name,
			author: recipe.author,
			snippet: recipe.snippet,
			difficulty: difficulty,
			duration: duration,
			diet: recipe.diet,
			ingredients: ingredients,
			instructions: steps,
			picture: this.state.picture
		}
  		// newRecipe[newKey] = obj
		createNewObjIn('recipes', obj)
	}

	// _submitToFirebase = () => {
	// 	// const s = this.state
	// 	// const newKey = createKeyForPost('recipes')
		
	// 	// const newId = uuid()
	// 	let updates = {}
	// 	newRecipe = {
	// 		_id: newId,
	// 		name: s.name,
	// 		author: s.author,
	// 		snippet: s.snippet,
	// 		difficulty: s.difficulty,
	// 		duration: s.duration,
	// 		ingredients: s.ingredients,
	// 		instructions: s.instructions,
	// 		picture: s.picture
	// 	}
  	// 	updates[newKey] = newRecipe
	// 	createRecipe('recipes', updates)
	// }

	_renderForm = () => {
		//First landing page for creating a recipe, it includes the basic data info such as:
		// Name, Author, Snippet, Diet, Difficulty, Duration.

//Refactor 0.3 <=========================================================
// some of these components are very simlair and could be put into one dynamic component
// components by grouping: 	
// 		TextInput: {name, author, snippet, duration}	
// 		ActoinSheet: {diet, difficulty}
		if(!this.state.firstStageSubmit) {			
			return (
				<KeyboardAvoidingView behavior="padding" style={styles.backGround}>
					<ScrollView >
						<ImageBackground style={styles.backGround}
						source={require('../assets/images/seigaiha.png')}>
							<View style={styles.container}>
								<TextInput 
									style = {styles.textInputContainer} 
									maxLength={35}
									onSubmitEditing={() => this.authorInput.focus()} 
									onChangeText={(nameInput) => this.setState({ ...this.state, recipe: { ...this.state.recipe, name: nameInput }})}
									autoCorrect={true} 
									returnKeyType='next'
									placeholder='Name of recipe' 
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
									placeholder='Name of author' 
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
									placeholder='Snippet of Recipe' 
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
									placeholder='Duration of Recipe' 
									value={this.state.recipe.duration}
									placeholderTextColor='#505050' />

								<TouchableOpacity style={styles.actionSheetContainer}  onPress={this._dietActionSheet}>
									<Text style={styles.buttonText}>{DIETS[this.state.recipe.diet]}</Text>
								</TouchableOpacity> 
								{/* issue: DIETS[this.state.recipe.diet] not showing once set on change	 */}

								<TouchableOpacity style={styles.actionSheetContainer}  onPress={this._difActionSheet}>
									<Text style={styles.buttonText}>{this.state.recipe.difficulty}</Text>
								</TouchableOpacity>


								<TouchableOpacity style={styles.stage1ButtonContainer}  onPress={this._submitRecipe}>
									<Text style={styles.buttonText}>Next</Text>
								</TouchableOpacity>


							</View>
						</ImageBackground>
					</ScrollView>
				</KeyboardAvoidingView>
			)
		}//TODO: Build TextInput step/ingredent builder
		else if (!this.state.secoundStageSubmit) {
			return (
				<View>
					<Text>Hello and welcome to stage 2, please input the ingredients that are required for your recipe</Text>
					<View style={styles.stageButtons}>
						<TouchableOpacity style={styles.buttonContainer}  onPress={this._stepBackToStageOne}>
							<Text style={styles.buttonText}>Back</Text>
						</TouchableOpacity>
						<TouchableOpacity style={styles.buttonContainer}  onPress={this._submitRecipeIngreedients}>
							<Text style={styles.buttonText}>Next</Text>
						</TouchableOpacity>
					</View>
				</View>
			)
		}
		else if (!this.state.thridStageSubmit) {
			return (
				<View>
					<Text>Hello and welcome to stage 3, please input the steps that are required for your recipe</Text>
					<View style={styles.stageButtons}>
						<TouchableOpacity style={styles.buttonContainer}  onPress={this._stepBackToStageTwo}>
							<Text style={styles.buttonText}>back</Text>
						</TouchableOpacity>
						<TouchableOpacity style={styles.buttonContainer}  onPress={this._submitRecipeSteps}>
							<Text style={styles.buttonText}>Preview</Text>
						</TouchableOpacity>
					</View>
				</View>
			)
		}
		else if (!this.previewStage) {
			return (
				<View>
					<Text>Hello Preview</Text>
					<View style={styles.stageButtons}>
						<TouchableOpacity style={styles.buttonContainer}  onPress={this._stepBackToStageThree}>
							<Text style={styles.buttonText}>back</Text>
						</TouchableOpacity>
						<TouchableOpacity style={styles.buttonContainer}  onPress={this._submitToFirebase}>
							<Text style={styles.buttonText}>Submit Recipe</Text>
						</TouchableOpacity>
					</View>
				</View>
			)
		}
	}

	render() {
		return this._renderForm()
	}
}

const styles = StyleSheet.create({
	stageButtons: {
		flexDirection: 'row',
		width: '40%'
	},
	showWarning: {
		color: '#e00f04',
		backgroundColor:'transparent',
	},
	loading: {
		backgroundColor:'transparent',
	},
	textInputContainer: {
		color: '#000',//black text color
		height: 40,//hight of white space that holds the text
		paddingLeft: 10,//text spacing from left
		marginTop: 20,//buffer on top of each textBox 
		marginLeft: '10%',
		width: '80%',
		backgroundColor: '#fff',
	},
	actionSheetContainer: {
		height: 40,
		paddingLeft: 10,//text spacing from left
		marginTop: 20,//buffer on top of each textBox 
		marginLeft: '10%',
		width: '80%',
		backgroundColor: '#fff',
	},
	stage1ButtonContainer: {
		padding: 10,
		marginLeft: '50%',
		marginTop: 20,
		backgroundColor: '#2980b6',
		// paddingVertical: 15,
		width: "35%",
	},
	buttonContainer: {
		marginBottom: 10,
		marginLeft: '10%',
		marginTop: 15,
		backgroundColor: '#2980b6',
		paddingVertical: 15,
		width: "40%",
	},
	buttonText: {
		color: '#505050',
	},
	backGround: {
		width: ScreenWidth,
		height: ScreenHeight,
	},
	font: {
		fontFamily: 'American Typewriter',
		fontSize: 16,
	},
})

export default NewRecipeScreen
