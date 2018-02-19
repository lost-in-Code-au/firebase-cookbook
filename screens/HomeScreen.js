import React from 'react'
import {
	AsyncStorage,
	Dimensions,
	StyleSheet,
	ImageBackground,
	Text,
	View,
	FlatList,
	TouchableHighlight,
	Image,
	Button,
} from 'react-native'
import { SearchBar } from 'react-native-elements'
import PropTypes from 'prop-types'

// import styles from '../styles.js'//TODO: need to import styles somehow without losing connection to window object

import firebase, { userCheck, userSignOut, requestRecipes, requestUsers } from './Utils/FirebaseUtil'

var ScreenHeight = Dimensions.get("window").height//not in use now that background has been removed
var ScreenWidth = Dimensions.get("window").Width
const MAX_SNIPPET_LENGTH = 75

const logout = () => {
		userSignOut().then(function() {
		console.log('scuuessful logout')
	  }, function(error) {
		console.log(error.message)
	})
}

const BackButton = ({ navigation: { navigate } }) => (
	<Button title="Logout" onPress={() => {
		return (navigate('Login') && logout())
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
			users: [],
			recipes: [],
			loading: true,
			error: null,
		}
	}

	static navigationOptions = ({ navigation }) => ({
		headerTitle: 'grEat',
        headerLeft: <BackButton navigation={navigation} />,
		headerRight: <NewRecipeButton navigation={navigation} />
	})

	componentDidMount = () => {
		
		requestRecipes().then((snapshot) => {
			const data = snapshot.val()
			
			this.setState({
				...this.state,
				recipes: data,
				loading: !this.state.loading,
			})
		}).catch((error) => {
			console.log(error.message)
		})

		requestUsers().then((snapshot) => {
			const data = snapshot.val()
			
			this.setState({
				...this.state,
				users: data,
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
				<ImageBackground style={styles.backGround}
				source={require('../assets/images/seigaiha.png')}>
					<FlatList
						data={this.state.recipes}
						renderItem={({ item }) => (
						<TouchableHighlight
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
						</TouchableHighlight>
					)}
					keyExtractor={(item, index) => index}
					/>
				</ImageBackground>
			)
		}
	}

	render() {
		return (
			<View>
				{this._renderHomePage()}
			</View>
		)
	}
}

const styles = StyleSheet.create({
	font: {
		fontFamily: 'American Typewriter',
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
