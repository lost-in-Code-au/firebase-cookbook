import {
  StyleSheet,
  Dimensions
} from 'react-native'

// var ScreenHeight = Dimensions.get("window").height//not in use now that background has been removed
// var ScreenWidth = Dimensions.get("window").Width

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
    // height: ScreenHeight,
    // width: ScreenWidth,
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
    // width: ScreenWidth,
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
    // width: ScreenWidth,
    height: 300,
    borderRadius: 50,
  }
})
