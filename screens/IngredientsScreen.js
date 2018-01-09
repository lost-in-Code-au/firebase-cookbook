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

class IngredientsScreen extends React.Component {

  static navigationOptions = ({ navigation }) => ({
    title: navigation.state.params.name,
  })

  render() {
    const { params: item } = this.props.navigation.state

    return (
        <View>
          <ImageBackground
          style={styles.backGround}
          source={require('../assets/images/seigaiha.png')}>
            <FlatList
              data={item.ingredients}
              renderItem={({item: ingredients}) => (
                <View key={ingredients.id} style={styles.recipeCard}>
                  <Text style={[styles.name, styles.font]}>{ingredients.name}</Text>
                </View>
              )}
              ListHeaderComponent={() => (
                <View style={styles.headerContainer}>
                  <Text  style={[styles.header, styles.font]}>Ingredients</Text>
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
    fontSize: 28,
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


export default IngredientsScreen
