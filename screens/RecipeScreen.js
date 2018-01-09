import React from 'react'
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
} from 'react-native'

// import styles from '../styles.js'//TODO: need to import styles somehow without losing connection to window object

var ScreenHeight = Dimensions.get("window").height//not in use now that background has been removed
var ScreenWidth = Dimensions.get("window").Width
const MAX_SNIPPET_LENGTH = 75

class RecipeScreen extends React.Component {

  static navigationOptions = ({ navigation }) => ({
    title: navigation.state.params.name,
  })

  render() {
    const { params: item } = this.props.navigation.state
    const { navigate } = this.props.navigation

    return (
      <View>
        <ImageBackground
        style={styles.backGround}
        source={require('../assets/images/seigaiha.png')}>
          <FlatList
            data={item.instructions}
            renderItem={({item: instruction}) => (
              <View key={instruction.step} style={styles.recipeCard}>
                <Text style={[styles.name, styles.font]}>{instruction.text}</Text>
              </View>
            )}
            ListHeaderComponent={() => (
              <View style={styles.headerContainer}>
                <Text style={[styles.name, styles.font]}>{item.name}</Text>
                <Text style={[styles.name, styles.font]}>{item.author}</Text>
                <Button
                onPress={() => navigate('Ingredients', item)}
                key={item._id}
                title="Ingredients" ></Button>
                <Text style={[styles.snippet, styles.font]}>{item.snippet}</Text>
                <View style={styles.infoContainer}>
                  <Text style={[styles.infoText, styles.font]}>Difficulty: {item.difficulty}/5</Text>
                  <Text style={[styles.infoText, styles.font]}>Duration: {item.duration}mins</Text>
                </View>
              </View>
            )}
          />
        </ImageBackground>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  font: {
    fontFamily: 'Baskerville',
  },
  footer: {
  },
  loading: {
    textAlign:'center',
    fontSize: 28,
    backgroundColor:'transparent',
  },
  container: {
    flex: 1,
  },
  backGround: {
    height: ScreenHeight,
    width: ScreenWidth,
  },
  header: {
    color: '#fff'
  },
  headerContainer: {
    alignItems: 'center',
    margin: 10,
    backgroundColor:'transparent',
  },
  recipeCardContainer: {
    backgroundColor: "transparent",
    borderRadius: 50,
    width: ScreenWidth,
    borderWidth: 1,
    margin: 10,
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
    borderRadius: 50,
  }
})

export default RecipeScreen
