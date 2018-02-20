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

const CookBookApp = StackNavigator({
	Root: { screen: RootScreen },
	Login: { screen: LoginScreen },
	Signup: { screen: SignUpScreen },
	NewRecipe: { screen: NewRecipeScreen },
	Home: { screen: HomeScreen },
	Recipe: { screen: RecipeScreen },
	Ingredients: { screen: IngredientsScreen },
	Search: { screen: SearchScreen },
})

export default class App extends React.Component {
	render() {
		return <CookBookApp /> 
	}
}