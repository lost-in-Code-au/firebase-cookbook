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
} from 'react-native'
import PropTypes from 'prop-types'

//Alpha version feedback
import Feedback from '../components/Utils/AlphaUserFeedback'

import { ImagePicker } from 'expo'// For dev logs through expo XDE
import uuid from 'uuid'
import RNFetchBlob from 'react-native-fetch-blob'

// import atob from 'atob' //broke yo
// import base64js from 'base64-js'
// import TextDecoder from 'text-encoding'
// import TextDecoderLight from 'text-encoder-lite'


import firebase, { createNewObjIn, dataBaseRequest, userSignOut } from '../components/Utils/FirebaseUtil'

var ScreenHeight = Dimensions.get('window').height
var ScreenWidth = Dimensions.get('window').width
const MAX_SNIPPET_LENGTH = 75


const BackButton = ({ navigation: { navigate } }) => (
	<Button title="Logout" onPress={() => {
		return (		userSignOut().then(function() {
			console.log('scuuessful logout')
		  }, function(error) {
			console.log(error.message)
		}))
	}} />
)

const NewRecipeButton = ({ navigation: { navigate } }) => (
	<Button title="Add" onPress={() => {
		return navigate('NewRecipe')
	}} />
)

class HomeScreen extends React.Component {
	constructor() {
		super()
		this.state = {
			currentUser: null,
			recipes: [],
			loading: true,
			error: null,

			//image encoding
			image: null,
			file: null,
			progress: null,
		}
	}

	static navigationOptions = ({ navigation }) => ({
		headerTitle: 'grEat',
        headerLeft: <BackButton navigation={navigation} />,
		headerRight: <NewRecipeButton navigation={navigation} />
	})

	componentDidMount = () => {	
		dataBaseRequest('recipes').then((data) => {
			this.setState({
				...this.state,
				recipes: data,
				loading: !this.state.loading,
			})
		}).catch((error) => {
			console.log(error.message)
		})
	}

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

	_renderHomePage = () => {
		const { navigate } = this.props.navigation
		const text = this.state.loading ? 'Loading...' : 'Loaded'

		if(this.state.loading) {			
			return (
				<ImageBackground
				style={styles.backGround}
				source={require('../assets/images/seigaiha.png')}>
					<Text style={[styles.loading, styles.font]}>{text}</Text>
				</ImageBackground>
			)
		}
		else if (this.state.error) {
			return <View><Text style={styles.font}>Error</Text></View>
		}
		else if (this.state.recipes.length === 0) {
			return <View><Text style={styles.font}>No recipes</Text></View>
		}
		else {
			return (
				<FlatList
					data={this.state.recipes}
					keyExtractor={(item, index) => index} 
					renderItem={({ item }) => (
						<TouchableOpacity
					onPress={() => navigate('Recipe', item)}
					activeOpacity={.5}
					underlayColor={"#DDDDDD"}
					key={item._id} style={styles.recipeCardContainer}>
						<View style={styles.recipeCard}>
							<Image
							style={styles.recipeImage}
							source={{uri: this._setImage(item.picture) }}
							/>
							<View style={styles.textPosition}>
							<View style={styles.overlaptopText}>
								<Text style={[styles.infoText, styles.font]}>Difficulty: {item.difficulty}/5</Text>
								<Text style={[styles.infoText, styles.font]}>Takes: {item.duration}mins</Text>
							</View>
							<View style={styles.overlapbottomText}>
								<Text style={[styles.name, styles.font]}>{item.name}</Text>
								<Text style={[styles.snippet, styles.font]}>{this._shortenSnippet(item.snippet)}</Text>
							</View>
							</View>
						</View>
					</TouchableOpacity>
					)}
				/>
			)
		}
	}

	//================================================uploader=============================

	//helper functions
	convertToByteArray = (input) => {
		// var encoding = 'utf-8'
		// var bytes = base64js.toByteArray(input)
		// return new TextDecoder(encoding).decode(bytes)

		const Blob = RNFetchBlob.polyfill.Blob

		// create Blob using base64 encoded string 
		return Blob.build(input, { type : 'image/png;BASE64' })
			.then((blob) => {
				var storageRef = firebase.storage().ref();
				var ref = storageRef.child(`images/${uuid()}.jpg`)
				var metadata = {
					contentType: 'image/jpeg',
				}
			  
				console.log(blob)
	  
				let uploadTask = ref.put(blob, metadata)
			} )
	}

	//uploader encoder
	// _uploadAsByteArray = async (pickerResultAsByteArray, progressCallback) => {

	// 	try {
	
	// 	//   var metadata = {
	// 	// 	contentType: 'image/jpeg',
	// 	//   }
	
	// 	  var storageRef = firebase.storage().ref();
	// 	  var ref = storageRef.child(`images/${uuid()}.jpg`)
		
	// 	  console.log(pickerResultAsByteArray)

	// 	  let uploadTask = ref.put(pickerResultAsByteArray)
	
	// 	  uploadTask.on('state_changed', function (snapshot) {
	
	// 		progressCallback && progressCallback(snapshot.bytesTransferred / snapshot.totalBytes)
	
	// 		var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
	// 		console.log('Upload is ' + progress + '% done')
	
	// 	  }, function (error) {
	// 		console.log("in _uploadAsByteArray ", error)
	// 	  }, function () {
	// 		var downloadURL = uploadTask.snapshot.downloadURL
	// 		console.log("_uploadAsByteArray ", uploadTask.snapshot.downloadURL)
	// 	  })
	
	
	// 	} catch (ee) {
	// 	  console.log("when trying to load _uploadAsByteArray ", ee)
	// 	}
	// }

	//imagepcker
	_pickImage = async () => {

		let result = await ImagePicker.launchImageLibraryAsync({
			allowsEditing: true,
			aspect: [4, 3],
			base64: true,
		})
	
		if (!result.cancelled) {
			this.setState({ ...this.state, image: result.uri, file: result.base64 })
			convertToByteArray(result)
			// this._uploadAsByteArray(this.convertToByteArray(result.base64), (progress) => {
			// console.log(progress)
			// this.setState({ progress })
			// })

		}
	}


	render() {
		return (
			<ImageBackground style={styles.backGround}
			source={require('../assets/images/seigaiha.png')}>
				{/* {this._renderHomePage()} */}


				<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
					<Button
					title="Pick an image from camera roll"
					onPress={this._pickImage}
					/>
					{this.state.image &&
					<Image source={{ uri: this.state.image }} style={{ width: 200, height: 200 }} />}
				</View>


				<Feedback page='homescreen' />
			</ImageBackground>
		)
	}
}

const styles = StyleSheet.create({
	buttonImage: {
		padding: 16,
		borderRadius: 8,
		backgroundColor: '#fff'	
	},
	modalButtons: {
		flexDirection: "row",
	},
	container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalButton: {
		position: 'absolute',
		alignSelf: 'flex-end',
        backgroundColor: 'transparent',
        padding: 16,
		marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: 'rgba(0, 0, 0, 0.1)',
	},
	button: {
        backgroundColor: 'lightblue',
        padding: 12,
        margin: 16,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        borderColor: 'rgba(0, 0, 0, 0.1)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 22,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        borderColor: 'rgba(0, 0, 0, 0.1)',
    },
    textInputContainer: {
        color: '#505050',
        height: 40,
        paddingLeft: 10,
        marginTop: 20,
        width: '90%',
        backgroundColor: '#ededed',
    },
	font: {
		fontSize: 16,
	},
	backGround: {
		width: ScreenWidth,
	},
	loading: {
		backgroundColor:'transparent',
		height: ScreenHeight,
		textAlign:'center',
		fontSize: 28,
		paddingTop: 230,
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


export default HomeScreen
