import React from 'react'
import {
	ImageBackground, 
	ActivityIndicator,
	FlatList,
	TouchableOpacity,
	Text, View, 
	Dimensions,
	Image,
	StyleSheet 
} from 'react-native'
import { dataBaseRequest } from '../components/Utils/FirebaseUtil'

const ScreenHeight = Dimensions.get('window').height
const ScreenWidth = Dimensions.get('window').width
const MAX_SNIPPET_LENGTH = 75

import { 
	SearchBar, 
	Button 
} from 'react-native-elements'

import Fuse from 'fuse.js'


export default class MenuScreen extends React.Component {
	constructor() {
		super()
		this.state = {
			inputFlag: null,
			recipes: [],
			loading: true,
			currentUser: null,
			error: null,
			searchResults: null
		}
	}

	componentDidMount() {
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

	_seachInput = (event) => {
		const recipes = this.state.recipes

		console.log(event)
		const options = {
			location: 0,
			distance: 100,
			threshold: 0.2,
			shouldSort: true,
			maxPatternLength: 32,
			minMatchCharLength: 1,
			keys: ['name', 'author', 'snippet']
		  }
		const f = new Fuse(recipes, options)
		const results = f.search(event)
  
		if(!event) this.setState({...this.state, inputFlag: null})
		
		console.log(results)
		if(results) {
			this.setState({ 
				...this.state, 
				searchResults: results,
				inputFlag: true
			})

		}
		console.log(this.state.searchResults)
	}
	
	_clearSeachInput = (event) => {
		this.setState({ ...this.state, inputFlag: null, searchResults: null,})
	}

	_renderer = () => {
		const { navigate } = this.props.navigation
		if (this.state.loading) {
			return (
				<ActivityIndicator
					animating={true}
					style={styles.indicator}
					size="large"
					color="#ff7500"
				/>
			)
		}
		else if(!this.state.inputFlag) {
			return (
				<Button
					title='Add a Recipe'
					onPress={() => {
						return navigate('NewRecipe')
					}}
				/>
			)
		}
		else if(this.state.inputFlag){
			return (
				<FlatList
					data={this.state.searchResults}
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
		return (
			<View>
				<ImageBackground
					style={styles.backGround}
					source={require('../assets/images/seigaiha.png')}>
					<SearchBar
						showLoading
						platform="ios"
						lightTheme
						round
						containerStyle={styles.transparent}
						onChangeText={this._seachInput}
						onClear={this._clearSeachInput}
						placeholder='Seach Recipes Here...' 
					/>
					{this._renderer()}
				</ImageBackground>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	transparent: { backgroundColor: 'transparent' },
	indicator: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		height: ScreenHeight,
		marginTop: 0,
	},
	font: {
		fontSize: 16,
	},
	backGround: {
		height: ScreenHeight,
		width: ScreenWidth,
	},
	loading: {
		backgroundColor:'transparent',
		height: ScreenHeight,
		textAlign:'center',
		fontSize: 28,
		paddingTop: 230,
	},
	recipeCardContainer: {
		backgroundColor: "transparent",
		maxWidth: ScreenWidth,
		marginTop: 10,
		marginBottom: 30,
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
	}
})