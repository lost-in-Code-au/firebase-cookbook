import React from 'react'
import {
    Dimensions,
    StyleSheet,
    ImageBackground,
    ActivityIndicator,
    Text, TextInput,
    View, Alert,
    FlatList,
    TouchableHighlight,
    TouchableOpacity,
    Image, Button,
    ActionSheetIOS,
    ScrollView,
    KeyboardAvoidingView
} from 'react-native'

//Alpha version feedback
import Feedback from '../components/Utils/AlphaUserFeedback'

import firebase, { createNewObjIn, dataBaseRequest, userSignOut } from '../components/Utils/FirebaseUtil'

var ScreenHeight = Dimensions.get('window').height
var ScreenWidth = Dimensions.get('window').width
const MAX_SNIPPET_LENGTH = 75



import { ImagePicker } from 'expo'// For dev logs through expo XDE
import uuid from 'uuid'

//================================================Staging area for component outer class functions=============================

//================================================Staging area for component outer class functions=============================
//TODO list: 
// 1) reidrect after susscessful submition
// 4) cleanup styles of buttons
// 5) link TextInput(durationInput) to the frist actoinSheet
// 6) lastly move all of stage one/recipe submit to it's own component.(maybe a bit complex)

class StagingScreen extends React.Component {
    constructor() {
        super()
        this.state = {

            //image encoding
			image: null,
			file: null,
			progress: null,
            
			//models
			recipe: {
                name: 'name',
				author: 'test',
				snippet: 'test',
				diet: 'blah',
				difficulty: 5,
				duration: 4,
				rating: null,
			},
			ingredients: [''],
			steps: [''],
            imageUrl: 'http://via.placeholder.com/300.png/09f/fff',
            
            previewStage: true,
			uploadImgFlag: true,
			uploadImgButtonFlag: true
        }
    }

    static navigationOptions = ({ navigation }) => ({
        headerTitle: 'Stagging Area',
		headerStyle: {
			backgroundColor: '#D3D3D3',
			color: 'white'
		}
    })


//====================================== Staging area for component functions =============================

_shortenSnippet(snippet) {
    if(snippet.length > MAX_SNIPPET_LENGTH){
        snippet = snippet.slice(0, MAX_SNIPPET_LENGTH-5) + "..."
    }
    return snippet
}

_setImage(url) {
    if(!url) {
        return 'https://firebasestorage.googleapis.com/v0/b/react-native-firebase-st-d0137.appspot.com/o/placeholder.jpg?alt=media&token=7a619092-d46f-4162-bea1-4be1f6a5c41f'
    } else {
        return url
    }
}

_renderButton = (text, onPress, buttonStyle, textStyle) => (
    <TouchableOpacity  style={buttonStyle} onPress={onPress}>
            <Text style={textStyle}>{text}</Text>
    </TouchableOpacity>
)

_pickImage = async () => {

    let result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [4, 3]
    })

    if (!result.cancelled) {
        this.setState({ ...this.state, image: result.uri })
    }
}

_uploadToFirebase = async () => {
    if(!this.state.image) return 

    this.setState({ ...this.state, uploadImgFlag: false})

    const name = `${uuid.v4()}.jpg`
    const body = new FormData()

    body.append("picture", {
        uri: this.state.image,
        name,
        type: "image/jpg"
    })

    try {
        const res = await fetch("https://us-central1-react-native-firebase-st-d0137.cloudfunctions.net/api/picture", {
            method: "POST",
            body,
            headers: {
                Accept: "application/json",
                "Content-Type": "multipart/form-data"
            }
        })

        const url = await firebase.storage().ref(`images/${name}`).getDownloadURL()
        
        await this.setState({ ...this.state, imageUrl : url, uploadImgFlag: true, uploadImgButtonFlag: false })
        Alert.alert(
            'Your image was suscefully uploaded',
            "Now to submit your new recipe",
            { cancelable: true }
        )
    }
    catch (err) {
        console.log(err)
    }
}

_submitPreviewedRecipe = () => {
    Alert.alert(
        'Hold your horses!',
        'Are you sure your happy with the preview?',
        [
            {text: 'Cancel' },
            {text: 'OK', onPress: () => this._submitToFirebase()}
        ],
        { cancelable: true }
    )
}

_submitToFirebase = async () => {
    this.setState({ ...this.state, uploadImgFlag: false})
    const { navigate } = this.props.navigation
    
    const recipe = this.state.recipe
    const ingredients = this.state.ingredients
    const steps = this.state.steps
    const difficulty = parseInt(recipe.difficulty)
    const duration = parseInt(recipe.duration)
    

    obj = {
        _id: uuid.v4(),
        name: recipe.name,
        author: recipe.author,
        snippet: recipe.snippet,
        difficulty: difficulty,
        duration: duration,
        diet: recipe.diet,
        ingredients: ingredients,
        instructions: steps,
        picture: this.state.imageUrl,
        rating: [this.state.recipe.rating]
    }
    try {
        await createNewObjIn('recipes', obj).then(()=>{
            
            this.setState({ ...this.state, uploadImgFlag: true})

            const { navigate } = this.props.navigation
            const msg = 'Success, please refesh your app to see it'
            navigate('Home', msg)
        }).catch((error) => {
            console.log(error.message)
            Alert.alert(
                'Sorry somehing went wrong!',
                error.message,
                [
                    {text: 'Ok' }
                ],
                { cancelable: true }
            )
        })
    }
    catch (err) {
        console.log(err)
    }
}


//====================================== Staging area for component functions=============================

_renderForm = () => {
    const { navigate } = this.props.navigation
    if (!this.state.uploadImgFlag) {
        return (
            <ActivityIndicator
                animating={true}
                style={styles.indicator}
                size="large"
            />
        )
    }
    else if (!this.previewStage) {
        return (
            <View style={styles.page}>
                <Text style={styles.headerText}>Preview your recipe and add a photo</Text>
                <View style={styles.recipeCard}>
                    <View style={styles.textPosition}>
                        <View style={styles.overlaptopText}>
                            <Text style={[styles.infoText, styles.font]}>Difficulty: {this.state.recipe.difficulty}/5</Text>
                            <Text style={[styles.infoText, styles.font]}>Takes: {this.state.recipe.duration}mins</Text>
                        </View>
                    
        
                        <TouchableOpacity style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }} onPress={this._pickImage}>
                            {this.state.image ? 
                                <Image source={{ uri: this.state.image }} style={styles.recipeImage} /> 
                                : 
                                <Text style={styles.headerText}>Click to pick image from camera roll</Text> 
                            }
                        </TouchableOpacity>

                        <View style={styles.overlapbottomText}>
                            <Text style={[styles.name, styles.font]}>{this.state.recipe.name}</Text>
                            <Text style={[styles.snippet, styles.font]}>{this._shortenSnippet(this.state.recipe.snippet)}</Text>
                        </View>
                    </View>
                </View>
                {this.state.uploadImgButtonFlag && this._renderButton('Upload Photo', this._uploadToFirebase, styles.stage1ButtonContainer, styles.buttonsText) || 					
                    <View style={styles.buttonsContainer}>
                        {this._renderButton('Back', this._stepBackToStageThree, styles.buttons, styles.buttonsText)}
                        <TouchableOpacity style={styles.buttons} onPress={() => this._submitPreviewedRecipe()}>
                            <Text style={styles.buttonsText}>Submit</Text>
                        </TouchableOpacity>
                    </View>
                }
            </View>
        )
    }
}



//====================================== Staging of JSX component area ===================================
    render() {
        return (
            <ImageBackground style={styles.backGround}
            source={require('../assets/images/seigaiha.png')}>
				<KeyboardAvoidingView behavior="padding" style={styles.backGround}>
					<ScrollView >
                        {this._renderForm()}
                    </ScrollView>
				</KeyboardAvoidingView> 
            </ImageBackground>
        )
    }
    //====================================== Staging of JSX component area ===================================
}


const styles = StyleSheet.create({
    backGround: {
        width: ScreenWidth,
        height: ScreenHeight
    },
    page: {
        backgroundColor: 'transparent',
    },

    //Staging of JSX component styles

    headerText: {
        color: '#505050',
		marginLeft: '10%',
        width: '80%',
        fontWeight: 'bold',
        marginTop: 20,
    },

    indicator: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
        height: 80,
        marginTop: '40%'
	},
    
	recipeCardContainer: {
		backgroundColor: 'transparent',
		maxWidth: ScreenWidth,
		marginTop: 10,
		marginBottom: 10,
	},
	recipeCard: {
        marginTop: 15,
		backgroundColor: 'transparent',
		width: '100%',
		height: 300,
    },
    textPosition: {
		display: 'flex',
		justifyContent: 'space-between',
		top: 0,
		...StyleSheet.absoluteFillObject
	},
	overlaptopText: {
		backgroundColor: "#fff",
		flexDirection: "row",
		justifyContent: "center",
		opacity: 0.7,
		width: ScreenWidth
	},
	overlapbottomText: {
		backgroundColor: "#fff",
		opacity: 0.7,
		width: ScreenWidth,
    },	
    recipeImage: {
		backgroundColor: "transparent",
		width: ScreenWidth,
		height: 300,
		opacity: 0.9,
	},
    name: {
		fontWeight: 'bold',
		margin: 5,
	},
	snippet: {
		backgroundColor: 'transparent',
		fontWeight: 'bold',
		margin: 5,
	},
	infoText: {
		backgroundColor: 'transparent',
		fontWeight: 'bold',
		flex: 1,
		textAlign: "center",
		paddingBottom: 8,
	},
    

	stage1ButtonContainer: {
		padding: 10,
        marginTop: 20,
        maxHeight: 44,
		backgroundColor: '#4097c9',
		width: '60%',
		marginLeft: '20%',
    },

    buttonsContainer: {
		flexDirection: 'row',
        flex: 1,
        justifyContent: 'space-between',
        width: '80%',
        marginLeft: '10%',
        maxHeight: 44,
        marginTop: 20,
	},
    buttons: {
		marginBottom: 10,
		marginTop: 15,
		backgroundColor: '#4097c9',
		paddingVertical: 15,
		width: '40%',
	},
    buttonsText: {        
        fontWeight: 'bold',
        color: '#fff',
		textAlign: 'center',
        fontSize: 20,
        paddingBottom: 11,
    },
    
})


export default StagingScreen
