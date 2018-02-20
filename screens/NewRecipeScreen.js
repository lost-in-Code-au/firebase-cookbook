import React from 'react'
import {
	Dimensions,
	StyleSheet,
	ImageBackground,
	Text, PickerIOS,
	Animated, Picker,
	ActionSheetIOS,
	View, ScrollView,
	TextInput,
	FlatList,
	TouchableOpacity, 
	KeyboardAvoidingView,
} from 'react-native'

import firebase, { createRecipe, dataBaseRequest } from './Utils/FirebaseUtil'

var ScreenHeight = Dimensions.get("window").height
var ScreenWidth = Dimensions.get("window").Width
const MAX_SNIPPET_LENGTH = 75

class NewRecipeScreen extends React.Component {
	static navigationOptions = {
		title: 'New grEat meal!'
	}
	
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
			difficulty: null,
			duration: null,
			ingredients: [],
			instructions: [],
			picture: '',
			
			selectedDiet: 'No diet',
			
			selectedDif: '0',
			
			firstStageSubmit: false,
			secoundStageSubmit: false,
			thridStageSubmit: false
		}
	}

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
				this.setState({...this.state, selectedDiet: toArray[buttonIndex]})
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
				this.setState({...this.state, selectedDif: defTypes[buttonIndex]})
			}
		}) 
	}

	_submitStageOne = () =>{
		
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
								multiline={true}
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
			}
			// else if (!this.state.secoundStageSubmit) {
			//   return (
			//     //put 2nd stage here
			//   )
			// }
			// else if (!this.state.thridStageSubmit) {
			//   return (
			//     //Put final form here
			//   )
			// }
		// )
	}

	_writeDataToCloud = () => {
		data = this.state
		createRecipe(data)
	}


	render() {
		return this._renderForm()
	}
}

const styles = StyleSheet.create({
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
