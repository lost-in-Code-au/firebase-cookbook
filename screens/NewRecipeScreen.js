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
	Button, Alert,
	Image
} from 'react-native'
import uuid from 'uuid'//keyGen

import firebase, { dataBaseRequest, createKeyForPostFrom, createNewObjIn } from '../components/Utils/FirebaseUtil'

var ScreenHeight = Dimensions.get("window").height
var ScreenWidth = Dimensions.get("window").Width
const MAX_SNIPPET_LENGTH = 75

//Test identifier to ref without text in state.
const DIETS = ['No Diets', 'Vegeterian', 'Gluten Free', 'Dairy Free', 'Gluten Free & Dairy Free', 'Vegan']

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
			data: null,

			//setup
			error: null,
			dietTypes: null,

			//array counters
			// amountOfIningredients: 1,
			// amountOfSteps: 1,
	
			//models
			recipe: {
				name: null,
				author: null,
				snippet: null,
				diet: null,
				difficulty: null,
				duration: null,
				rating: null,
			},//move all of stage one into here
			ingredients: [''],//create a check to prevent ininate creating of objests
			steps: [{}],
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
		dataBaseRequest('dietTypes').then((data) => {
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

	_checkDietInput = () => {
		if(!this.state.recipe.diet) { return 'Diet type' } else {return this.state.recipe.diet }
	}

	_dietActionSheet = () => {
		const options = this.state.dietTypes
		

		customActionSheet(options, (index) => {
			this.setState({...this.state, recipe: 
				{
					...this.state.recipe,
					diet: options[index]
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
 
	_submitRecipe = () =>{
		const recipe = this.state.recipe
		const options = [ recipe.name, recipe.author, recipe.snippet, recipe.duration, recipe.diet, recipe.difficulty ]
		
		submitionAlert(options, (callback) => {
			this.setState({ ...this.state, firstStageSubmit: true })
		}) 
	}

	_submitRecipeIngreedients = () => {
		const options = this.state.ingredients
		
		submitionAlert(options, (callback) => {
			this.setState({ ...this.state, secoundStageSubmit: true })
		})
	}

	_submitRecipeSteps = () => {
		const options = this.state.steps

		submitionAlert(options, (callback) => {
			this.setState({ ...this.state, thridStageSubmit: true })
		})
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

	_ingredentBuilder = () => {
		const build = this.state.ingredients

		return build.map((value, index) => (								
			<TextInput 
				style = {styles.textInputContainer} 
				maxLength={30}
				ref={(input)=> this.foodInput = input} 
				onSubmitEditing={() => this.foodInput.focus()} 
				onChangeText={(foodInput) => this.setState({
					...this.state,
					ingredients: this.state.ingredients.map((_, inputIndex) => inputIndex === index ? foodInput : _)
				})}
				autoCorrect={true} 
				keyExtractor={(index) => index}
				returnKeyType='next'
				placeholder='Add name of ingredient' 
				value={value}
				placeholderTextColor='#505050' />
		))
	}	

	_addIngredentTextInput = () => {
		this.setState({ ...this.state, ingredients: [...this.state.ingredients, ''] })
	}

	_stepsBuilder = () => {
		const build = this.state.steps

		return build.map((value, index) => (								
			<TextInput 
				style = {styles.textInputContainer} 
				maxLength={200}
				ref={(input)=> this.stepInput = input} 
				onSubmitEditing={() => this.stepInput.focus()} 
				onChangeText={(stepInput) => this.setState({
					...this.state,
					steps: this.state.steps.map((_, inputIndex) => inputIndex === index ? stepInput : _)
				})}
				autoCorrect={true} 
				keyExtractor={(index) => index}
				returnKeyType='next'
				placeholder='Add new step' 
				value={value}
				placeholderTextColor='#505050' />
		))
	}

	_addStepsTextInput = () => {
		this.setState({ ...this.state, steps: [...this.state.steps, ''] })
	}

	_submitPreviewedRecipe = () => {
		Alert.alert(
			'Hold your horses!',
			'Are you sure your happy with the preview?',
			[
				{text: 'Cancel' },
				{text: 'OK', onPress: this._submitToFirebase}
			],
			{ cancelable: true }
		)
}

	_submitToFirebase = () => {
		
		const recipe = this.state.recipe
		const ingredients = this.state.ingredients
		const steps = this.state.steps

		const difficulty = parseInt(recipe.difficulty)
		const duration = parseInt(recipe.duration)
		

		obj = {
			_id: createKeyForPostFrom('recipes'),
			name: recipe.name,
			author: recipe.author,
			snippet: recipe.snippet,
			difficulty: difficulty,
			duration: duration,
			diet: recipe.diet,
			ingredients: ingredients,
			instructions: steps,
			picture: this.state.picture,
			rating: [this.state.recipe.rating]
		}
		createNewObjIn('recipes', obj).then(()=>{
			navigate('home')
		}).catch((error) => {
			console.log(error.message)
			Alert.alert(
				'Sorry somehing went wrong!',
				error.message,
				[
					{text: 'Ok' }
				],
				{ cancelable: true }
			)
		})

	}

	//+======================= Preview functions =========================
	_shortenSnippet(snippet) {
		if(snippet.length > MAX_SNIPPET_LENGTH){
			snippet = snippet.slice(0, MAX_SNIPPET_LENGTH-5) + "..."
		}
		return snippet
	}

	_setImage(url) {
		if(!url) {
			return 'https://firebasestorage.googleapis.com/v0/b/react-native-firebase-st-d0137.appspot.com/o/placeholder.jpg?alt=media&token=7a619092-d46f-4162-bea1-4be1f6a5c41f'
		} else {
			return url
		}
	}
	//+=====================================================================

	_renderForm = () => {
		const { navigate } = this.props.navigation
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
									<Text style={styles.textInput}>{this.state.recipe.diet ? this.state.recipe.diet :  'Add diet type of the recipe' }</Text>
								</TouchableOpacity> 

								<TouchableOpacity style={styles.actionSheetContainer}  onPress={this._difActionSheet}>
									<Text style={styles.textInput}>{this.state.recipe.difficulty ? this.state.recipe.difficulty + ' lvl' : 'Add the difficulty of the recipe'}</Text>
								</TouchableOpacity>


								<TouchableOpacity style={styles.stage1ButtonContainer}  onPress={this._submitRecipe}>
									<Text style={styles.buttonText}>Next</Text>
								</TouchableOpacity>
							</View>
						</ImageBackground>
					</ScrollView>
				</KeyboardAvoidingView>
			)
		} else if (!this.state.secoundStageSubmit) {
			return (
				<KeyboardAvoidingView behavior="padding" style={styles.backGround}>
					<ScrollView >
						<ImageBackground style={styles.backGround}
							source={require('../assets/images/seigaiha.png')}>
							<View style={styles.page}>
								<Text>Hello and welcome to the Ingredents stage, please input the ingredients that are required for your recipe</Text>
								
								{this._ingredentBuilder()}

									<TouchableOpacity style={styles.addIngredent}  onPress={this._addIngredentTextInput}>
										<Text style={styles.addIngredentText}>+</Text>
									</TouchableOpacity>
								
								<View style={styles.stageButtons}>
									<TouchableOpacity style={styles.buttonContainer}  onPress={this._stepBackToStageOne}>
										<Text style={styles.buttonText}>Back</Text>
									</TouchableOpacity>
									<TouchableOpacity style={styles.buttonContainer}  onPress={this._submitRecipeIngreedients}>
										<Text style={styles.buttonText}>Next</Text>
									</TouchableOpacity>
								</View>
							</View>
						</ImageBackground>
					</ScrollView>
				</KeyboardAvoidingView> 
			)
		} else if (!this.state.thridStageSubmit) {
			console.log(this.state.steps)
			return (
				<KeyboardAvoidingView behavior="padding" style={styles.backGround}>
					<ScrollView >
						<ImageBackground style={styles.backGround}
							source={require('../assets/images/seigaiha.png')}>
							<View style={styles.page}>
								<Text>Hello and welcome to the Instructions stage, please input the steps that are required for your recipe</Text>
								
								{this._stepsBuilder()}

								<TouchableOpacity style={styles.addIngredent}  onPress={this._addStepsTextInput}>
									<Text style={styles.addIngredentText}>+</Text>
								</TouchableOpacity>

								<View style={styles.stageButtons}>
									<TouchableOpacity style={styles.buttonContainer}  onPress={this._stepBackToStageTwo}>
										<Text style={styles.buttonText}>back</Text>
									</TouchableOpacity>
									<TouchableOpacity style={styles.buttonContainer} onPress={this._submitRecipeSteps}>
										<Text style={styles.buttonText}>Preview</Text>
									</TouchableOpacity>
								</View>
							</View>
						</ImageBackground>
					</ScrollView>
				</KeyboardAvoidingView> 
			)
		}
//================================================> Preview stage <=========================================
		
		else if (!this.previewStage) {
			return (
				<KeyboardAvoidingView behavior="padding" style={styles.backGround}>
					<ScrollView >
						<ImageBackground style={styles.backGround}
							source={require('../assets/images/seigaiha.png')}>
						<View style={styles.page}>
							<Text>Preview of how your recipe will look</Text>
							<View style={styles.recipeCard}>
								<Image
								style={styles.recipeImage}
								source={{uri: this._setImage(this.state.picture) }}
								/>
								<View style={styles.textPosition}>
								<View style={styles.overlaptopText}>
									<Text style={[styles.infoText, styles.font]}>Difficulty: {this.state.recipe.difficulty}/5</Text>
									<Text style={[styles.infoText, styles.font]}>Takes: {this.state.recipe.duration}mins</Text>
								</View>
								<View style={styles.overlapbottomText}>
									<Text style={[styles.name, styles.font]}>{this.state.recipe.name}</Text>
									<Text style={[styles.snippet, styles.font]}>{this._shortenSnippet(this.state.recipe.snippet)}</Text>
								</View>
								</View>
							</View>
							<View style={styles.stageButtons}>
								<TouchableOpacity style={styles.buttonContainer}  onPress={this._stepBackToStageThree}>
									<Text style={styles.buttonText}>back</Text>
								</TouchableOpacity>
								<TouchableOpacity style={styles.buttonContainer}   navitgate={navigate} onPress={this._submitPreviewedRecipe}>
									<Text style={styles.buttonText}>Submit Recipe</Text>
								</TouchableOpacity>
							</View>
						</View>
					</ImageBackground>
				</ScrollView>
			</KeyboardAvoidingView> 
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
		color: '#505050',
		height: 40,
		paddingLeft: 10,//text spacing from left
		marginTop: 20,//buffer on top of each textBox 
		marginLeft: '10%',
		width: '80%',
		backgroundColor: '#fff',
	},
	textInput: {
		color: '#505050',
		height: 40,
		paddingTop: 10,
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
		marginTop: 20,
		backgroundColor: '#4097c9',
		width: "100%",
	},
	addIngredent: {
		padding: 10,
		marginTop: 20,
		backgroundColor: '#4097c9',
		width: "20%",
		height: 50,
		justifyContent: 'center',
	},
	addIngredentText:{
		color: '#fff',
		fontWeight: 'bold',
		textAlign: "center",
		fontSize: 34,
	},
	buttonContainer: {
		marginBottom: 10,
		marginLeft: '16%',
		marginTop: 15,
		backgroundColor: '#4097c9',
		paddingVertical: 15,
		width: "100%",
	},
	buttonText: {
		fontWeight: 'bold',
		textAlign: "center",
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
	page: {
		backgroundColor: "transparent",
	},
	recipeCardContainer: {
		backgroundColor: "transparent",
		maxWidth: ScreenWidth,
		marginTop: 10,
		marginBottom: 10,
	},
	recipeCard: {
		backgroundColor: "transparent",
		width: "100%",
		height: 300,
	},
	name: {
		fontWeight: "bold",
		margin: 5,
	},
	snippet: {
		backgroundColor: "transparent",
		fontWeight: "bold",
		margin: 5,
	},
	infoText: {
		backgroundColor: "transparent",
		fontWeight: "bold",
		flex: 1,
		textAlign: "center",
		paddingBottom: 8,
	},
	recipeImage: {
		backgroundColor: "transparent",
		width: ScreenWidth,
		height: 300,
		opacity: 0.9,
	}
})

export default NewRecipeScreen
