import React from 'react'
import {
	Dimensions,
	StyleSheet,
	ActivityIndicator,
	ImageBackground,
	ActionSheetIOS,
	View, ScrollView,
	TextInput, Text,
	TouchableOpacity, 
	KeyboardAvoidingView,
	Button, Alert, Image
} from 'react-native'

import { ImagePicker } from 'expo'// For dev logs through expo XDE
import uuid from 'uuid'

import Feedback from '../components/Utils/AlphaUserFeedback'
import firebase, { dataBaseRequest, createNewObjIn } from '../components/Utils/FirebaseUtil'

var ScreenHeight = Dimensions.get("window").height
var ScreenWidth = Dimensions.get("window").width
const MAX_SNIPPET_LENGTH = 75

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

class NewRecipeScreen extends React.Component {
	
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
			imageUrl: 'http://via.placeholder.com/300.png/09f/fff',
			
			//flags
			firstStageSubmit: false,
			secoundStageSubmit: false,
			thridStageSubmit: false,

			previewStage: false,
			uploadImgFlag: true,
			uploadImgButtonFlag: true
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

    _renderButton = (text, onPress, buttonStyle, textStyle) => (
        <TouchableOpacity  style={buttonStyle} onPress={onPress}>
                <Text style={textStyle}>{text}</Text>
        </TouchableOpacity>
	)
	
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
				key={index}
				returnKeyType='next'
				placeholder='  Add name of ingredient' 
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
				key={index}
				returnKeyType='next'
				placeholder='  Add new step' 
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
				{text: 'OK', onPress: () => this._submitToFirebase()}
			],
			{ cancelable: true }
		)
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

	//================================================uploader=============================

	    //imagepcker
	_pickImage = async () => {

		let result = await ImagePicker.launchImageLibraryAsync({
			allowsEditing: true,
			aspect: [4, 3]
		})
	
		if (!result.cancelled) {
			this.setState({ ...this.state, image: result.uri })
		}
	}

	_uploadToFirebase = async () => {
		if(!this.state.image) return 

		this.setState({ ...this.state, uploadImgFlag: false})

		const name = `${uuid.v4()}.jpg`
		const body = new FormData()

		body.append("picture", {
			uri: this.state.image,
			name,
			type: "image/jpg"
		})

		try {
			const res = await fetch("https://us-central1-react-native-firebase-st-d0137.cloudfunctions.net/api/picture", {
				method: "POST",
				body,
				headers: {
					Accept: "application/json",
					"Content-Type": "multipart/form-data"
				}
			})

			const url = await firebase.storage().ref(`images/${name}`).getDownloadURL()
			
			await this.setState({ ...this.state, imageUrl: url , uploadImgFlag: true, uploadImgButtonFlag: false })
			Alert.alert(
				'Your image was suscefully uploaded',
				"Now to submit your new recipe",
				{ cancelable: true }
			)
		}
		catch (err) {
			console.log(err)
		}
	}

	//=====================================================================

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
		} else if (!this.state.secoundStageSubmit) {
			return (
				<View style={styles.page}>
					<Text style={styles.headerText}>Hello and welcome to the Ingredents stage, please input the ingredients that are required for your recipe</Text>
					{this._ingredentBuilder()}
					<TouchableOpacity style={styles.addField} onPress={this._addIngredentTextInput}>
						<View  style={styles.addFieldButton}>
							<Text style={styles.addFieldButtionText}>+</Text>
						</View>
            		</TouchableOpacity>
					<View style={styles.buttonsContainer}>
						{this._renderButton('Back', this._stepBackToStageOne, styles.buttons, styles.buttonsText)}
						{this._renderButton('Next', this._submitRecipeIngreedients, styles.buttons, styles.buttonsText)}
            		</View>
				</View>
			)
		} else if (!this.state.thridStageSubmit) {
			return (
				<View style={styles.page}>
					<Text style={styles.headerText}>Hello and welcome to the Instructions stage, please input the steps that are required for your recipe</Text>
					{this._stepsBuilder()}
					<TouchableOpacity style={styles.addField} onPress={this._addStepsTextInput}>
						<View  style={styles.addFieldButton}>
							<Text style={styles.addFieldButtionText}>+</Text>
						</View>
					</TouchableOpacity>
					<View style={styles.buttonsContainer}>
						{this._renderButton('Back', this._stepBackToStageTwo, styles.buttons, styles.buttonsText)}
						{this._renderButton('Next', this._submitRecipeSteps, styles.buttons, styles.buttonsText)}
					</View>
				</View>
			)
		}
//================================================> Preview stage <=========================================
		else if (!this.state.uploadImgFlag) {
			return (
				<ActivityIndicator
					animating={true}
					style={styles.indicator}
					size="large"
				/>
			)
		}
		else if (!this.previewStage) {
			return (
				<View style={styles.page}>
					<Text style={styles.headerText}>Preview your recipe and add a photo</Text>
					<View style={styles.recipeCard}>
						<View style={styles.textPosition}>
							<View style={styles.overlaptopText}>
								<Text style={[styles.infoText, styles.font]}>Difficulty: {this.state.recipe.difficulty}/5</Text>
								<Text style={[styles.infoText, styles.font]}>Takes: {this.state.recipe.duration}mins</Text>
							</View>
						
			
							<TouchableOpacity style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }} onPress={this._pickImage}>
								
								{this.state.image ? 
									<Image source={{ uri: this.state.image }} style={styles.image} /> 
									: 
									<Text style={styles.headerText}>Click to pick image from camera roll</Text> 
								}
							</TouchableOpacity>
	
							<View style={styles.overlapbottomText}>
								<Text style={[styles.name, styles.font]}>{this.state.recipe.name}</Text>
								<Text style={[styles.snippet, styles.font]}>{this._shortenSnippet(this.state.recipe.snippet)}</Text>
							</View>
						</View>
					</View>
					{this.state.uploadImgButtonFlag && this._renderButton('Upload Photo', this._uploadToFirebase, styles.stage1ButtonContainer, styles.buttonsText) || 					
						<View style={styles.buttonsContainer}>
							{this._renderButton('Back', this._stepBackToStageThree, styles.buttons, styles.buttonsText)}
							<TouchableOpacity style={styles.buttons} onPress={() => this._submitPreviewedRecipe()}>
								<Text style={styles.buttonsText}>Submit</Text>
							</TouchableOpacity>
						</View>
					}
				</View>
			)
		}
	}

	render() {
		return(
			<ImageBackground style={styles.backGround}
				source={require('../assets/images/seigaiha.png')}>
				<KeyboardAvoidingView behavior="padding" style={styles.backGround}>
					<ScrollView >
						{this._renderForm()}
						<Feedback page='New Recipe Screen' />
					</ScrollView>
				</KeyboardAvoidingView> 
			</ImageBackground>
		)
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
	actionSheetContainer: {
		height: 40,
		paddingLeft: 10,
		marginTop: 20,
		marginLeft: '10%',
		width: '80%',
		backgroundColor: '#fff',
	},

	stage1ButtonContainer: {
		padding: 10,
        marginTop: 20,
        maxHeight: 44,
		backgroundColor: '#4097c9',
		width: '60%',
		marginLeft: '20%',
    },



	headerText: {
        color: '#505050',
		marginLeft: '10%',
        width: '80%',
        fontWeight: 'bold',
        marginTop: 20,
	},

    buttonsContainer: {
		flexDirection: 'row',
        flex: 1,
        justifyContent: 'space-between',
        width: '80%',
        marginLeft: '10%',
        maxHeight: 44,
        marginTop: 20,
	},
    buttons: {
		marginBottom: 10,
		marginTop: 15,
		backgroundColor: '#4097c9',
		paddingVertical: 15,
		width: '40%',
	},
    buttonsText: {        
        fontWeight: 'bold',
        color: '#fff',
		textAlign: 'center',
        fontSize: 20,
        paddingBottom: 11,
    },
	
	addField: {
        marginTop: 20,
        width: '80%',
        backgroundColor: '#fff',
        height: 44,
        marginLeft: '10%',
    },
    addFieldButton: {
		paddingBottom: 6,
		backgroundColor: '#4097c9',
		width: '20%',
		justifyContent: 'center',
	},
	addFieldButtionText:{
		color: '#fff',
		fontWeight: 'bold',
		textAlign: 'center',
		fontSize: 34,
	},
	
	recipeCardContainer: {
		backgroundColor: 'transparent',
		maxWidth: ScreenWidth,
		marginTop: 10,
		marginBottom: 10,
	},
	recipeCard: {
        marginTop: 15,
		backgroundColor: 'transparent',
		width: '100%',
		height: 300,
    },
    textPosition: {
		display: 'flex',
		justifyContent: 'space-between',
		top: 0,
		...StyleSheet.absoluteFillObject
	},
	overlaptopText: {
		backgroundColor: "#fff",
		flexDirection: "row",
		justifyContent: "center",
		opacity: 0.7,
		width: ScreenWidth
	},
	overlapbottomText: {
		backgroundColor: "#fff",
		opacity: 0.7,
		width: ScreenWidth,
    },	
    image: {
		backgroundColor: "transparent",
		width: ScreenWidth,
		height: 300,
		opacity: 0.9,
	},
    name: {
		fontWeight: 'bold',
		margin: 5,
	},
	snippet: {
		backgroundColor: 'transparent',
		fontWeight: 'bold',
		margin: 5,
	},
	infoText: {
		backgroundColor: 'transparent',
		fontWeight: 'bold',
		flex: 1,
		textAlign: "center",
		paddingBottom: 8,
	},
    
	indicator: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		height: 80,
		marginTop: '40%',
	},
	backGround: {
		width: ScreenWidth,
		height: ScreenHeight,
	},
	page: {
		backgroundColor: 'transparent',
	},
})

export default NewRecipeScreen
