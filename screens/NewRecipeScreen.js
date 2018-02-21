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
			loading: true,
			error: null,
			dietTypes: null,

			name: null,
			author: null,
			snippet: null,
			diet: null,
			difficulty: null,
			duration: null,
			ingredients: [],
			instructions: [],
			picture: 'http://via.placeholder.com/300.png/09f/fff',
			
			selectedDiet: 'No diet',
			
			selectedDif: '0',
			
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
				this.setState({...this.state, selectedDiet: toArray[buttonIndex], diet: toArray[buttonIndex]})
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
				this.setState({...this.state, selectedDif: defTypes[buttonIndex], difficulty: defTypes[buttonIndex]})
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
		
		const newId = uuid()
		
		console.log(newKey)
		
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
		let updates = {}
  		updates[newKey] = newRecipe


		console.log(updates)

		createRecipe('recipes', updates)
	}

	_renderForm = () => {
		const text = this.state.loading ? 'Loading...' : 'Loaded'

		if(this.state.loading) {			
			return (
				<ImageBackground
				style={styles.backGround}
				source={require('../assets/images/seigaiha.png')}>
					<Text style={[styles.loading, styles.font]}>{text}</Text>
				</ImageBackground>
			)
		} else if(!this.state.firstStageSubmit) {			
			return (
				<KeyboardAvoidingView behavior="padding" style={styles.backGround}>
					<ScrollView >
						<ImageBackground style={styles.backGround}
						source={require('../assets/images/seigaiha.png')}>
							<View style={styles.container}>
								<TextInput 
								style = {styles.textInput} 
								maxLength={35}
								onSubmitEditing={() => this.authorInput.focus()} 
								onChangeText={(nameInput) => this.setState({ ...this.state, name: nameInput })}
								autoCorrect={true} 
								returnKeyType="next" 
								placeholder='Name of recipe' 
								value={this.state.name}
								placeholderTextColor='#505050' />

								<TextInput 
								style = {styles.textInput} 
								maxLength={30}
								ref={(input)=> this.authorInput = input} 
								onSubmitEditing={() => this.snippetInput.focus()} 
								onChangeText={(authorName) => this.setState({ ...this.state, author: authorName })}
								autoCorrect={false} 
								returnKeyType="next" 
								placeholder='Name of author' 
								value={this.state.author}
								placeholderTextColor='#505050' />
								

								<TextInput 
								style = {styles.snippetInput} 
								maxLength={120}
								ref={(input)=> this.snippetInput = input} 
								onSubmitEditing={() => this.snippetInput.focus()} 
								onChangeText={(snippetInput) => this.setState({ ...this.state, snippet: snippetInput })}
								autoCorrect={true} 
								multiline={false}
								returnKeyType="next" 
								placeholder='Snippet of Recipe' 
								value={this.state.snippet}
								placeholderTextColor='#505050' />

								<TouchableOpacity style={styles.actionSheetContainer}  onPress={this._dietActionSheet}>
									<Text style={styles.buttonText}>{this.state.selectedDiet}</Text>
								</TouchableOpacity>

								<TouchableOpacity style={styles.actionSheetContainer}  onPress={this._difActionSheet}>
									<Text style={styles.buttonText}>{this.state.selectedDif}</Text>
								</TouchableOpacity>

								<TouchableOpacity style={styles.actionSheetContainer}  onPress={this._submitStageOne}>
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
					<Text>Hello stage 2</Text>
					<View style={styles.stageButtons}>
						<TouchableOpacity style={styles.actionSheetContainer}  onPress={this._stepBackToStageOne}>
							<Text style={styles.buttonText}>Back</Text>
						</TouchableOpacity>
						<TouchableOpacity style={styles.actionSheetContainer}  onPress={this._submitStageTwo}>
							<Text style={styles.buttonText}>Next</Text>
						</TouchableOpacity>
					</View>
				</View>
			)
		}
		else if (!this.state.thridStageSubmit) {
			return (
				<View>
					<Text>Hello stage 3</Text>
					<View style={styles.stageButtons}>
						<TouchableOpacity style={styles.actionSheetContainer}  onPress={this._stepBackToStageTwo}>
							<Text style={styles.buttonText}>back</Text>
						</TouchableOpacity>
						<TouchableOpacity style={styles.actionSheetContainer}  onPress={this._submitStageThree}>
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
						<TouchableOpacity style={styles.actionSheetContainer}  onPress={this._stepBackToStageThree}>
							<Text style={styles.buttonText}>back</Text>
						</TouchableOpacity>
						<TouchableOpacity style={styles.actionSheetContainer}  onPress={this._submitToFirebase}>
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
	textInput: {
		color: '#000',
		height: 40,
		paddingLeft: 15,
		margin: 20,
		width: '90%',
		backgroundColor: '#fff',
	},
	snippetInput: {
		color: '#000',
		height: 80,
		paddingTop: 15,
		paddingLeft: 15,
		margin: 20,
		width: '90%',
		backgroundColor: '#fff',
	},
	actionSheetContainer: {
		height: 40,
		paddingLeft: 15,
		margin: 20,
		width: '90%',
		backgroundColor: '#fff',
	},
	backGround: {
	 width: ScreenWidth,
	 height: ScreenHeight,
	},
	buttonContainer:{
		marginTop: 15,
		backgroundColor: '#2980b6',
		paddingVertical: 15,
		width: "90%",
	},
	buttonText:{
		color: '#505050',
	},
	loading: {
		backgroundColor:'transparent',
		height: ScreenHeight,
		textAlign:'center',
		fontSize: 28,
		paddingTop: 230,
	},	
	font: {
		fontFamily: 'American Typewriter',
		fontSize: 16,
	},
})

export default NewRecipeScreen
