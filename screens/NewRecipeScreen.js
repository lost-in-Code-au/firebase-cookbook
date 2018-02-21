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

import firebase, { createRecipe, dataBaseRequest, createKeyForPost } from './Utils/FirebaseUtil'

var ScreenHeight = Dimensions.get("window").height
var ScreenWidth = Dimensions.get("window").Width
const MAX_SNIPPET_LENGTH = 75

class NewRecipeScreen extends React.Component {
	
	constructor() {
		super()
		this.state = {

			//setup
			error: null,
			dietTypes: null,

			name: null,
			author: null,
			snippet: null,
			diet: 'No diet',
			difficulty: 1,
			duration: null,
			ingredients: [],
			instructions: [],
			picture: 'http://via.placeholder.com/300.png/09f/fff',
			
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
		let diets = this.state.dietTypes
		const toArray = Object.values(diets)
		const arrayLength = diets.length

		ActionSheetIOS.showActionSheetWithOptions({
			options: toArray,
			destructiveButtonIndex: arrayLength,
			cancelButtonIndex: arrayLength,
		},
		(buttonIndex) => {
			if(toArray[buttonIndex] === 'cancel' ) { return }
			else {
				this.setState({...this.state, diet: toArray[buttonIndex]})
			}
		}) 
	}
	
	_difActionSheet = () => {
		const defTypes = [ '1', '2', '3', '4', '5', 'cancel']

		ActionSheetIOS.showActionSheetWithOptions({
			options: defTypes,
			destructiveButtonIndex: 5,
			cancelButtonIndex: 5,
		},
		(buttonIndex) => {
			if(defTypes[buttonIndex] === 'cancel' ) { return }
			else {
				this.setState({...this.state, difficulty: defTypes[buttonIndex]})
			}
		}) 
	}
 
	//This submitStage's needs to be made into a dynamic function, but having some trouble with the setStage accepting dynamic input.
	_submitStageOne = () =>{
		const s = this.state

		console.log('stage1')
		console.log(s)

		if(!s.name || !s.author || !s.snippet || !s.diet || !s.difficulty){
			Alert.alert(
                'Wait up!',
                "Something's is missing from your recipe brief",
                { cancelable: true }
            )
		} else {
			this.setState({ ...this.state, firstStageSubmit: true })
		}
	}

	_submitStageTwo = () => {
		const s = this.state
		// console.log('stage2')
		// console.log(s)

		// if(!ingredients){
		// 	Alert.alert(
        //         'Wait up!',
        //         "You need to add ingredients to your recipe",
        //         { cancelable: true }
        //     )
		// } else {
		this.setState({ ...this.state, secoundStageSubmit: true })
		// }
	}

	_submitStageThree = () => {
		const s = this.state
		// console.log('stage3')
		// console.log(s)

		// if(!ingredients){
		// 	Alert.alert(
        //         'Wait up!',
        //         "You need to add the steps for your recipe",
        //         { cancelable: true }
        //     )
		// } else {
		this.setState({ ...this.state, thridStageSubmit: true })
		// }
	}
	//same thing as above, having some trouble with the setStage accepting dynamic input.
	_stepBackToStageOne = () => {
		this.setState({ ...this.state, firstStageSubmit: false })
	}

	_stepBackToStageTwo = () => {
		this.setState({ ...this.state, secoundStageSubmit: false })
	}

	_stepBackToStageThree = () => {
		this.setState({ ...this.state, thridStageSubmit: false })
	}
	/////////////////////////////////////////////////////////////////

	_submitToFirebase = () => {
		const s = this.state
		const newKey = createKeyForPost('recipes')
		console.log(newKey)
		const newId = uuid()
		let updates = {}
		newRecipe = {
			_id: newId,
			name: s.name,
			author: s.author,
			snippet: s.snippet,
			difficulty: s.difficulty,
			duration: s.duration,
			ingredients: s.ingredients,
			instructions: s.instructions,
			picture: s.picture
		}
  		updates[newKey] = newRecipe
		createRecipe('recipes', updates)
	}

	_renderForm = () => {
		//First landing page for creating a recipe, it includes the basic data info such as:
		// Name, Author, Snippet, Diet, Difficulty, Duration.
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
									onChangeText={(nameInput) => this.setState({ ...this.state, name: nameInput })}
									autoCorrect={true} 
									returnKeyType='next'
									placeholder='Name of recipe' 
									value={this.state.name}
									placeholderTextColor='#505050' />

								<TextInput 
									style = {styles.textInputContainer} 
									maxLength={30}
									ref={(input)=> this.authorInput = input} 
									onSubmitEditing={() => this.snippetInput.focus()} 
									onChangeText={(authorName) => this.setState({ ...this.state, author: authorName })}
									autoCorrect={true} 
									returnKeyType='next'
									placeholder='Name of author' 
									value={this.state.author}
									placeholderTextColor='#505050' />
								

								<TextInput 
									style = {styles.textInputContainer} 
									maxLength={100}
									ref={(input)=> this.snippetInput = input} 
									onSubmitEditing={() => this.durationInput.focus()} 
									onChangeText={(snippetInput) => this.setState({ ...this.state, snippet: snippetInput })}
									autoCorrect={true} 
									returnKeyType='next'
									placeholder='Snippet of Recipe' 
									value={this.state.snippet}
									placeholderTextColor='#505050' />

								<TextInput 
									style = {styles.textInputContainer} 
									maxLength={3}
									ref={(input)=> this.durationInput = input} 
									onSubmitEditing={() => this.durationInput.focus()} 
									onChangeText={(durationInput) => this.setState({ ...this.state, duration: durationInput })}
									autoCorrect={false} 
									keyboardType='numeric'
									returnKeyType='done'
									placeholder='Duration of Recipe' 
									value={this.state.duration}
									placeholderTextColor='#505050' />

								<TouchableOpacity style={styles.actionSheetContainer}  onPress={this._dietActionSheet}>
									<Text style={styles.buttonText}>{this.state.diet}</Text>
								</TouchableOpacity>

								<TouchableOpacity style={styles.actionSheetContainer}  onPress={this._difActionSheet}>
									<Text style={styles.buttonText}>{this.state.difficulty}</Text>
								</TouchableOpacity>


								<TouchableOpacity style={styles.stage1ButtonContainer}  onPress={this._submitStageOne}>
									<Text style={styles.buttonText}>Next</Text>
								</TouchableOpacity>


							</View>
						</ImageBackground>
					</ScrollView>
				</KeyboardAvoidingView>
			)
		}//TODO: add duration into stage one.//////////////////////////////////////////////////// <===
		else if (!this.state.secoundStageSubmit) {
			return (
				<View>
					<Text>Hello and welcome to stage 2, please input the ingredients that are required for your recipe</Text>
					<View style={styles.stageButtons}>
						<TouchableOpacity style={styles.buttonContainer}  onPress={this._stepBackToStageOne}>
							<Text style={styles.buttonText}>Back</Text>
						</TouchableOpacity>
						<TouchableOpacity style={styles.buttonContainer}  onPress={this._submitStageTwo}>
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
						<TouchableOpacity style={styles.buttonContainer}  onPress={this._submitStageThree}>
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
		marginLeft: '50%',
		marginTop: 20,
		backgroundColor: '#2980b6',
		// paddingVertical: 15,
		width: "35%",
	},
	buttonContainer: {
		marginBottom: 10,
		paddingLeft: '50%',
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
