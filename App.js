import React, { Component } from 'react'
import {
	Dimensions,
	StyleSheet,
	Text,
	View,
	FlatList,
	TouchableHighlight,
	ImageBackground,
	Image,
	Button,
	StatusBar
} from 'react-native'
import { StackNavigator } from 'react-navigation' // 1.0.0-beta.23
import 'expo'// For dev logs through expo XDE

// import styles from './styles'

import LoginScreen from './screens/LoginScreen'
import SignUpScreen from './screens/SignUpScreen'
import HomeScreen from './screens/HomeScreen'
import RecipeScreen from './screens/RecipeScreen'
import IngredientsScreen from './screens/IngredientsScreen'
import SearchScreen from './screens/SearchScreen'

const CookBookApp = StackNavigator({
	Login: { screen: LoginScreen },
	Signup: { screen: SignUpScreen },
	Home: { screen: HomeScreen },
	Recipe: { screen: RecipeScreen },
	Ingredients: { screen: IngredientsScreen },
	Search: { screen: SearchScreen },
})

export default class App extends Component<{}> {
	constructor() {
		super()
		this.state = {
			isLoggedIn: false,
			email: null,
			recipes: [],
			loading: true,
			error: null,
		}
	}
	//Velan Answer: state mangment. 
	// 1) So this state is to be made for the main required props,
	// 2) then passed down to the important components

	static navigationOptions = {
	header: ({ navigate }) => {
		return {
			titleStyle: {
				fontFamily: 'American Typewriter'
				},
			}
		},
	}//TODO: Maybe doing nothing, need to be checked.

	render() {
		return <CookBookApp />
	}
}