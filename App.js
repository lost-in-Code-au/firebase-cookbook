import 'expo'// For dev logs through expo XDE
import React from 'react'
import { StackNavigator } from 'react-navigation' // 1.0.0-beta.23

// import styles from './styles'
import RootScreen from './screens/RootScreen'
import LoginScreen from './screens/LoginScreen'
import SignUpScreen from './screens/SignUpScreen'
import HomeScreen from './screens/HomeScreen'
import RecipeScreen from './screens/RecipeScreen'
import IngredientsScreen from './screens/IngredientsScreen'
import SearchScreen from './screens/SearchScreen'
import NewRecipeScreen from './screens/NewRecipeScreen'

import firebase from './screens/Utils/FirebaseUtil'//to start FB instance and check if a user is logged in already.

const CookBookApp = (props) => {
	const Navigator = StackNavigator({
		Login: { screen: LoginScreen },
		Signup: { screen: SignUpScreen },
		NewRecipe: { screen: NewRecipeScreen },
		Home: { screen: HomeScreen },
		Recipe: { screen: RecipeScreen },
		Ingredients: { screen: IngredientsScreen },
		Search: { screen: SearchScreen },
	}, {
		initialRouteName: props.route
	})

	return <Navigator />
}

export default class App extends React.Component {

	constructor(props) {
		super(props)

		const user = firebase.auth().currentUser
		
		if (user) {
			this.state = {
				currentUser: user,
				loading: false
			}

		} else {
			this.state = {
				loading: false
			}
		}
	}

	render = () => {

		if ( this.state.loading ) {
			return <RootScreen />
		}

		return <CookBookApp route={this.state.currentUser ? 'Home' : 'Login'} /> 
	}
}