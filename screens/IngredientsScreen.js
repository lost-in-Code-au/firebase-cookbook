import React from 'react'
import {
	Dimensions,
	StyleSheet,
	Text,
	View,
	FlatList,
	ImageBackground,
	Button,
} from 'react-native'

import Feedback from '../components/Utils/AlphaUserFeedback'
import { CheckBox } from 'react-native-elements'

var ScreenHeight = Dimensions.get("window").height//not in use now that background has been removed
var ScreenWidth = Dimensions.get("window").width



class IngredientsScreen extends React.Component {

	static navigationOptions = ({ navigation }) => ({
		title: navigation.state.params.name,
	})

	constructor(props){
		super(props)
		const ingredients = props.navigation.state.params.ingredients
		const counter = ingredients.map((obj, index)=>{
			return index = false
		})
		this.state = {
			checked: counter
		}
	}
	
	_checkThisBox = (index) => {
		const checked = [...this.state.checked]
		checked[index] = !checked[index]

		this.setState({ checked })
	}

	_ingredents = (item) => {		
		return (
			<FlatList
				data={item.ingredients}
				style={styles.flatList}
				renderItem={({ item: ingredient, index: index }) => (
					<CheckBox
						key={index}
						style={styles.recipeCard}
						title={ingredient}//expecting to see the index show in the list field then will know if checkbox can see index of string arrays
						onPress={() => this._checkThisBox(index)}
						checked={this.state.checked[index]}
					/>					
				)}
				ListHeaderComponent={() => (
					<View style={styles.headerContainer}>
						<Text  style={[styles.header, styles.font]}>Ingredients</Text>
					</View>
				)}
				keyExtractor={(item, index) => index}
			/>
		)
	}

	render() {
		const { params: item } = this.props.navigation.state
		console.log(this.state)
		return (
			<ImageBackground
				style={styles.backGround}
				source={require('../assets/images/seigaiha.png')}>
				{this._ingredents(item)}
				<Feedback page='Ingredent Screen' />
			</ImageBackground>
		)
	}
}


const styles = StyleSheet.create({
	flatList: {
		backgroundColor:'transparent',
		marginBottom: 80
	},
	backGround: {
		width: ScreenWidth,
        height: ScreenHeight
	},
	header: {
		fontSize: 28,
	},
	headerContainer: {
		alignItems: 'center',
		margin: 10,
		backgroundColor:'transparent',
	},
	recipeCard: {
		backgroundColor: "transparent",
		width: "100%",
		padding: 10,
	},
	name: {
		fontWeight: "bold",
		margin: 5,
	},
})


export default IngredientsScreen
