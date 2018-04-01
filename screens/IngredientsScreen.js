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

var ScreenHeight = Dimensions.get("window").height//not in use now that background has been removed
var ScreenWidth = Dimensions.get("window").width

class IngredientsScreen extends React.Component {

	static navigationOptions = ({ navigation }) => ({
		title: navigation.state.params.name,
		// headerRight: <Button title="Rate" />,//TODO: Create rating Component
	})

	_ingredents = (item) => {		
		return (
			<FlatList
				data={item.ingredients}
				style={styles.flatList}
				renderItem={({item: ingredient}) => (
					<View key={ingredient.index} style={styles.recipeCard}>
						<Text style={styles.name}>{ingredient}</Text>
					</View>
				)}
				ListHeaderComponent={() => (
					<View style={styles.headerContainer}>
						<Text  style={[styles.header, styles.font]}>Ingredients</Text>
					</View>
				)}
				keyExtractor={(item, index) => index}
			/>
		)
	}//TODO: Double check the FlatList isn't underscrolling

	render() {
		const { params: item } = this.props.navigation.state

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
