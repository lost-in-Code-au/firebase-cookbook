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
			recipes: [],
			loading: true,
			error: null,
			message: null
		}
	}

	static navigationOptions = ({ navigation }) => ({
		headerTitle: 'grEats',
        headerLeft: <BackButton navigation={navigation} />,
		headerRight: <NewRecipeButton navigation={navigation} />
	})

	componentDidMount = () => {
		dataBaseRequest('recipes').then((data) => {
			const msg = this.props.navigation.state.params
			// console.log(msg);
		
			this.setState({
				...this.state,
				recipes: data,
				message: msg,
				loading: !this.state.loading,
			})
		}).catch((error) => {
			console.log(error.message)
		})
	}

	_msgCheck = () => {
		const msg = this.state.message
		Alert.alert(
			msg,
			[
				{text: 'Ok' }
			],
			{ cancelable: true }
		)
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

	render() {
		// const { navigate } = this.props.navigation
		// console.log(this.props.navigation.state.params);
		// const msg = this.props.navigation.state.params
		// console.log(msg);
		// if(msg) {this._msgCheck(msg)}
		
		// this.state.message ? this._msgCheck() : 
		return (
			<ImageBackground style={styles.backGround}
			source={require('../assets/images/seigaiha.png')}>
				{this._renderHomePage()}
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
