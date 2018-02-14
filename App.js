import 'expo'// For dev logs through expo XDE
import React from 'react'
import { StackNavigator } from 'react-navigation' // 1.0.0-beta.23

import firebase, { userCheck, userLogin } from './screens/Utils/FirebaseUtil'//to start FB instance and check if a user is logged in already.

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

const UserCookBookApp = StackNavigator({
	Home: { screen: HomeScreen },
	Login: { screen: LoginScreen },
	Signup: { screen: SignUpScreen },
	Recipe: { screen: RecipeScreen },
	Ingredients: { screen: IngredientsScreen },
	Search: { screen: SearchScreen },
})

export default class App extends React.Component {
	constructor() {
		super()
		this.state = {
			currentUser: null,
			email: null,
			recipes: [],
			loading: true,
			error: null,
		}
	}
	//Velan Answer: state mangment. 
	// 1) So this state is to be made for the main required props,
	// 2) then passed down to the important components

	render() {
		const user = userCheck()
		// console.log(user)
		
			
		if(user) {	
			console.log('user is already logged in')
			this.setState({
				...this.state,
				currentUser: user.uid
			})
			
			return <UserCookBookApp /> 
		} else {
			return <CookBookApp /> 
		}//Have NOOOOOO idea if this is working
	}
}