import 'expo'
import { AppLoading, Asset } from 'expo'
import React from 'react'
import { StackNavigator } from 'react-navigation'

import RootScreen from './screens/RootScreen'
import LoginScreen from './screens/LoginScreen'
import SignUpScreen from './screens/SignUpScreen'
import HomeScreen from './screens/HomeScreen'
import RecipeScreen from './screens/RecipeScreen'
import IngredientsScreen from './screens/IngredientsScreen'
import NewRecipeScreen from './screens/NewRecipeScreen'
import MenuScreen from './screens/MenuScreen'
// import StagingScreen from './screens/StagingScreen'

const CookBookApp = StackNavigator({
	// Stage: { screen: StagingScreen },//Hash out when no components are being worked on in the staging screen
	Root: { screen: RootScreen },
	Login: { screen: LoginScreen },
	Signup: { screen: SignUpScreen },
	Home: { screen: HomeScreen },
	Recipe: { screen: RecipeScreen },
	Ingredients: { screen: IngredientsScreen },
	Menu: { screen: MenuScreen },
	NewRecipe: { screen: NewRecipeScreen },
})

function cacheImages(images) {
	return images.map(image => {
		if (typeof image === 'string') {
			return Image.prefetch(image)
		} else {
			return Asset.fromModule(image).downloadAsync()
		}
	})
}

export default class App extends React.Component {
	constructor() {
		super()
		this.state = {
			isReady: false,
		}
	}
	
	_loadAssetsAsync = async () => {//was async _loadAssetsAsync() {
		const imageAssets = cacheImages([
		  require('./assets/images/seigaiha.png'),
		])
	
		await Promise.all([...imageAssets]);
	}

	render() {
		if (!this.state.isReady) {
			return (
			  <AppLoading
				startAsync={this._loadAssetsAsync}
				onFinish={() => this.setState({ isReady: true })}
				onError={console.warn}
			  />
			);
		}

		return <CookBookApp /> 
	}
}