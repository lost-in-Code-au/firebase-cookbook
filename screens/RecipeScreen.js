import React from 'react'
import {
	Dimensions,
	StyleSheet,
	Text, View,
	FlatList,
	ImageBackground,
	Image
} from 'react-native'
import { Button } from 'react-native-elements'

import Feedback from '../components/Utils/AlphaUserFeedback'

var ScreenHeight = Dimensions.get("window").height//not in use now that background has been removed
var ScreenWidth = Dimensions.get("window").width

class RecipeScreen extends React.Component {

	static navigationOptions = ({ navigation }) => ({
		title: navigation.state.params.name,
	})

	_setImage(url) {
		if(!url) {
			return 'https://firebasestorage.googleapis.com/v0/b/react-native-firebase-st-d0137.appspot.com/o/placeholder.jpg?alt=media&token=7a619092-d46f-4162-bea1-4be1f6a5c41f'
		} else {
			return url
		}
	}

	render() {
		const { params: item } = this.props.navigation.state
		const { navigate } = this.props.navigation
		
		return (
			<View style={styles.page}>
				<ImageBackground
				style={styles.backGround}
				source={require('../assets/images/seigaiha.png')}>
					<FlatList
						style={styles.flatlist}
						data={item.instructions}
						renderItem={({item: instruction, index}) => (
							<View key={index} style={styles.recipeCard}>
								<Text style={[styles.name, styles.font]}>Step {index +1}:</Text>
								<Text style={[styles.name, styles.font]}>{instruction}</Text>
							</View>
						)}
						ListHeaderComponent={() => (
							<View style={styles.headerContainer}>
								<Image
									style={styles.recipeImage}
									source={{uri: this._setImage(item.picture) }}
								/>

								<Text style={[styles.name, styles.font]}>{item.name}</Text>
								<Text style={[styles.name, styles.font]}>By: {item.author}</Text>
								<Button
									onPress={() => navigate('Ingredients', item)}
									key={item._id}
									title="Ingredients" ></Button>
								<Text style={[styles.snippet, styles.font]}>{item.snippet}</Text>
								<View style={styles.infoContainer}>
									<Text style={[styles.infoText, styles.font]}>Difficulty: {item.difficulty}/5</Text>
									<Text style={[styles.infoText, styles.font]}>Takes: {item.duration}mins</Text>
								</View>
							</View>
						)}
						keyExtractor={(index) => index}
					/>
				<Feedback page='Recipe Show Screen' />
				</ImageBackground>
			</View>
		)
	}
}//TODO: Extend flatlist CSS to prevent overlap

const styles = StyleSheet.create({
	page: {
		flex: 1,
		backgroundColor: 'transparent',
	},
	flatlist: {
		marginBottom: 80
	},
	font: {
		opacity: 0.9,
	},
	backGround: {
		width: ScreenWidth,
        height: ScreenHeight
	},
	headerContainer: {
		alignItems: 'center',
		margin: 10,
		backgroundColor:'transparent',
	},
	recipeCard: {
		backgroundColor: "#fff",
		width: "100%",
		padding: 10,
		opacity: 0.7,
		borderRadius: .5,
		marginTop: 10,
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
	infoContainer: {
		backgroundColor: "transparent",
		flexDirection: "row",
		justifyContent: "center",
	},
	infoText: {
		backgroundColor: "transparent",
		fontWeight: "bold",
		flex: 1,
		textAlign: "center",
	},
	recipeImage: {
		backgroundColor: "transparent",
		width: ScreenWidth,
		height: 300,
		opacity: 0.9,
	}
})

export default RecipeScreen
