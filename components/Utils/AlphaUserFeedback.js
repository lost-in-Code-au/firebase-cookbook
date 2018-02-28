import React, { Component } from 'react'
import { Text, TouchableOpacity, ImageBackground, StyleSheet, View, TextInput, Alert } from 'react-native'
import Modal from 'react-native-modal' // 2.4.0

import firebase, { createNewObjIn } from './FirebaseUtil'


export default class Feedback extends Component {
	constructor() {
		super()
		this.state = {
            visibleModal: null,
            userFeedback: null
        }
    }

	_postCommentToFirebase = () => {
		this.setState({ visibleModal: null })

		const newObject = {
			page: this.props.page,
			feedback: this.state.userFeedback
		}
		createNewObjIn('feedback', newObject).then((res)=>{
			console.log(res.message)
			Alert.alert(
				'Great! thank you for the feedback you beautiful person!',
				res.message,
				[
					{text: 'Ok' }
				],
				{ cancelable: true }
			)
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

    _renderButton = (text, onPress) => (
        <TouchableOpacity  style={styles.modalButton} onPress={onPress}>
            <ImageBackground style={styles.buttonImage}
                source={require('../../assets/images/feedback.png')}>
                <Text style={styles.text}>{text}</Text>
            </ImageBackground>
        </TouchableOpacity>
    )

    _renderModalContent = () => (
        <View style={styles.modalContent}>
            <Text>Hello, please leave a comment on how this page can be better!</Text>
            <TextInput
                style={styles.textInputContainer} 
                maxLength={90} 
                onChangeText={(input) => this.setState({ ...this.state, userFeedback: input })}
                autoCorrect={true} 
                returnKeyType='done'
                placeholder='Add comment(max 90 char pls).' 
                value={this.state.userFeedback}
                placeholderTextColor='#505050' />
            <View style={styles.modalButtons}>
                <TouchableOpacity  style={styles.button} onPress={() => this.setState({ visibleModal: null })}>
                        <Text>Close</Text>
                </TouchableOpacity>
                <TouchableOpacity  style={styles.button} onPress={this._postCommentToFirebase}>
                        <Text>Submit</Text>
                </TouchableOpacity>
            </View>			
        </View>
    )

    render() {
        return (
            <View style={styles.box}>
                {this._renderButton('    ', () => this.setState({ visibleModal: 1 }))}
                <Modal isVisible={this.state.visibleModal === 1}>
                    {this._renderModalContent()}
                </Modal>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    box: {
        ...StyleSheet.absoluteFillObject,
        width: 16,
        height:16,
        marginLeft: '80%'
    },  
    text: {
        backgroundColor: 'transparent',
        color: '#505050',
        fontSize: 20,
    },
	buttonImage: {
		padding: 16,
		borderRadius: 10,
		backgroundColor: '#fff'		
	},
	modalButtons: {
		flexDirection: "row",
	},
	container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalButton: {
        borderRadius: 10,
		position: 'absolute',
		alignSelf: 'flex-end',
        padding: 16,
		marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center',
	},
	button: {
        backgroundColor: 'lightblue',
        padding: 12,
        margin: 16,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        borderColor: 'rgba(0, 0, 0, 0.1)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 22,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        borderColor: 'rgba(0, 0, 0, 0.1)',
    },
    textInputContainer: {
        color: '#505050',
        height: 40,
        paddingLeft: 10,
        marginTop: 20,
        width: '90%',
        backgroundColor: '#ededed',
    },
})