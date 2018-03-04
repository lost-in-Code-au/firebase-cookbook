import React from 'react'
import {
	Dimensions,
	StyleSheet,
	ImageBackground,
	ActionSheetIOS,
	View, ScrollView,
	TextInput,
	FlatList, Text,
	TouchableOpacity, 
	KeyboardAvoidingView,
	Button, Alert, Image
} from 'react-native'


import { ImagePicker } from 'expo'// For dev logs through expo XDE
import uuid from 'uuid'
// import RNFetchBlob from 'react-native-fetch-blob'//possible linking issue

// import atob from 'atob' //broke yo
// import base64js from 'base64-js'
// import TextDecoder from 'text-encoding'
// import TextDecoderLight from 'text-encoder-lite'


import Feedback from '../components/Utils/AlphaUserFeedback'
import firebase, { dataBaseRequest, createNewObjIn } from '../components/Utils/FirebaseUtil'

var ScreenHeight = Dimensions.get("window").height
var ScreenWidth = Dimensions.get("window").Width
const MAX_SNIPPET_LENGTH = 75

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
				key={index}
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
				{text: 'OK', onPress: this._saveImageTofirebase}
			],
			{ cancelable: true }
		)
	}

	_saveImageTofirebase = () => {
		var storageRef = firebase.storage().ref()
		var file = this.state.file
		file.name = `${uuid()}.jpg`

		console.log(file)
		

		var metadata = {
			contentType: 'image/jpeg'
		}

		var uploadTask = storageRef.child('images/' + file.name).put(file, metadata)

		uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,function(snapshot) {
			var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
			console.log('Upload is ' + progress + '% done')
			switch (snapshot.state) {
			  case firebase.storage.TaskState.PAUSED: // or 'paused'
				console.log('Upload is paused')
				break;
			  case firebase.storage.TaskState.RUNNING: // or 'running'
				console.log('Upload is running')
				break;
			}
		  }, function(error) {
		
		  // A full list of error codes is available at
		  // https://firebase.google.com/docs/storage/web/handle-errors
		  switch (error.code) {
			case 'storage/unauthorized':
			  // User doesn't have permission to access the object
			  break;
		
			case 'storage/canceled':
			  // User canceled the upload
			  break;
		
			// ...
		
			case 'storage/unknown':
			  // Unknown error occurred, inspect error.serverResponse
			  break;
		  }
		}, function() {
		  // Upload completed successfully, now we can get the download URL
		  var downloadURL = uploadTask.snapshot.downloadURL
		})
		
		// saveToFirebase().then((data) => {
		// 	this._submitToFirebase(url)
		// }).catch((error) => {
		// 	console.log(error.message)
		// })

		
	}


	_submitToFirebase = (url) => {
		
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
			picture: url,
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

	//================================================uploader=============================

	// //helper functions
	// convertToByteArray = (input) => {
	// 	// var encoding = 'utf-8'
	// 	// var bytes = base64js.toByteArray(input)
	// 	// return new TextDecoder(encoding).decode(bytes)

	// 	const Blob = RNFetchBlob.polyfill.Blob

	// 	// create Blob using base64 encoded string 
	// 	return Blob.build(input, { type : 'image/png;BASE64' })
	// 		.then((blob) => {
	// 			var storageRef = firebase.storage().ref();
	// 			var ref = storageRef.child(`images/${uuid()}.jpg`)
	// 			var metadata = {
	// 				contentType: 'image/png',
	// 			}
			  
	// 			console.log(blob)
	  
	// 			let uploadTask = ref.put(blob, metadata)
	// 		} )
	// }

	// //uploader encoder
	// // _uploadAsByteArray = async (pickerResultAsByteArray, progressCallback) => {

	// // 	try {
	
	// // 	//   var metadata = {
	// // 	// 	contentType: 'image/jpeg',
	// // 	//   }
	
	// // 	  var storageRef = firebase.storage().ref();
	// // 	  var ref = storageRef.child(`images/${uuid()}.jpg`)
		
	// // 	  console.log(pickerResultAsByteArray)

	// // 	  let uploadTask = ref.put(pickerResultAsByteArray)
	
	// // 	  uploadTask.on('state_changed', function (snapshot) {
	
	// // 		progressCallback && progressCallback(snapshot.bytesTransferred / snapshot.totalBytes)
	
	// // 		var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
	// // 		console.log('Upload is ' + progress + '% done')
	
	// // 	  }, function (error) {
	// // 		console.log("in _uploadAsByteArray ", error)
	// // 	  }, function () {
	// // 		var downloadURL = uploadTask.snapshot.downloadURL
	// // 		console.log("_uploadAsByteArray ", uploadTask.snapshot.downloadURL)
	// // 	  })
	
	
	// // 	} catch (ee) {
	// // 	  console.log("when trying to load _uploadAsByteArray ", ee)
	// // 	}
	// // }

	// //imagepcker
	// _pickImage = async () => {

	// 	let result = await ImagePicker.launchImageLibraryAsync({
	// 		allowsEditing: true,
	// 		aspect: [4, 3],
	// 		base64: true,
	// 	})
	
	// 	if (!result.cancelled) {
	// 		this.setState({ ...this.state, image: result.uri, file: result.base64 })
	// 		convertToByteArray(result)
	// 		// this._uploadAsByteArray(this.convertToByteArray(result.base64), (progress) => {
	// 		// console.log(progress)
	// 		// this.setState({ progress })
	// 		// })

	// 	}
	// }
	//+=====================================================================

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
					<Text>Hello and welcome to the Ingredents stage, please input the ingredients that are required for your recipe</Text>
					{this._ingredentBuilder()}
					{this._renderButton('+', this._addIngredentTextInput, styles.addField, styles.addFieldText)}
					<View style={styles.stageButtons}>
						{this._renderButton('Back', this._stepBackToStageOne, styles.buttonContainer, styles.buttonText)}
						{this._renderButton('Next', this._submitRecipeIngreedients, styles.buttonContainer, styles.buttonText)}
					</View>
				</View>
			)
		} else if (!this.state.thridStageSubmit) {
			return (
				<View style={styles.page}>
					<Text>Hello and welcome to the Instructions stage, please input the steps that are required for your recipe</Text>
					{this._stepsBuilder()}
					{this._renderButton('+', this._addStepsTextInput, styles.addField, styles.addFieldText)}
					<View style={styles.stageButtons}>
						{this._renderButton('Back', this._stepBackToStageTwo, styles.buttonContainer, styles.buttonText)}
						{this._renderButton('Next', this._submitRecipeSteps, styles.buttonContainer, styles.buttonText)}
					</View>
				</View>
			)
		}
//================================================> Preview stage <=========================================
		
		else if (!this.previewStage) {
			return (
				<View style={styles.page}>
					<Text>Preview your recipe and add a photo</Text>
					<View style={styles.recipeCard}>
						<View style={styles.textPosition}>
							<View style={styles.overlaptopText}>
								<Text style={[styles.infoText, styles.font]}>Difficulty: {this.state.recipe.difficulty}/5</Text>
								<Text style={[styles.infoText, styles.font]}>Takes: {this.state.recipe.duration}mins</Text>
							</View>
						<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
							<Button
							title="Pick an image from camera roll"
							onPress={this._pickImage}
							/>
							{this.state.image &&
							<Image source={{ uri: this.state.image }} style={{ width: 200, height: 200 }} />}
						</View>
							<View style={styles.overlapbottomText}>
								<Text style={[styles.name, styles.font]}>{this.state.recipe.name}</Text>
								<Text style={[styles.snippet, styles.font]}>{this._shortenSnippet(this.state.recipe.snippet)}</Text>
							</View>
						</View>
					</View>
					<View style={styles.stageButtons}>
						{this._renderButton('Back', this._stepBackToStageThree, styles.buttonContainer, styles.buttonText)}
						{this._renderButton('Submit Recipe', this._submitPreviewedRecipe, styles.buttonContainer, styles.buttonText)}
					</View>
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
		width: '100%',
	},
	buttonText: {
		fontWeight: 'bold',
		textAlign: 'center',
		color: '#505050',
	},
	addField: {
		padding: 10,
		marginTop: 20,
		backgroundColor: '#4097c9',
		width: '20%',
		height: 48,
		justifyContent: 'center',
		marginLeft: '40%'
	},
	addFieldText:{
		color: '#fff',
		fontWeight: 'bold',
		textAlign: 'center',
		fontSize: 34,
	},
	buttonContainer: {
		marginBottom: 10,
		marginLeft: '16%',
		marginTop: 15,
		backgroundColor: '#4097c9',
		paddingVertical: 15,
		width: '100%',
	},
	backGround: {
		width: ScreenWidth,
		height: ScreenHeight,
	},
	page: {
		backgroundColor: 'transparent',
	},
	recipeCardContainer: {
		backgroundColor: 'transparent',
		maxWidth: ScreenWidth,
		marginTop: 10,
		marginBottom: 10,
	},
	recipeCard: {
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
	recipeImage: {
		backgroundColor: "transparent",
		width: ScreenWidth,
		height: 300,
		opacity: 0.9,
	}
})

export default NewRecipeScreen
