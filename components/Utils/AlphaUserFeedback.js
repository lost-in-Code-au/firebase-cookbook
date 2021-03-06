import React, { Component } from 'react'
import { Text, TouchableOpacity, ImageBackground, StyleSheet, View, TextInput, Alert } from 'react-native'
import Modal from 'react-native-modal' // 2.4.0

import firebase, { createNewObjIn, userCheck } from './FirebaseUtil'

import commementImage from '../../assets/images/feedback.png'
import timestamp from 'time-stamp'


export default class Feedback extends Component {
	constructor() {
		super()
		this.state = {
            visibleModal: false,
            userFeedback: null
        }
    }

	_postCommentToFirebase = async () => {
        
        if(!this.state.userFeedback) return
        
        const user = userCheck().email
        const newObject = {
            page: this.props.page,
            feedback: this.state.userFeedback,
            Date_n_time: timestamp('YYYY/MM/DD @HH:mm'),
            user: user
		}
		await createNewObjIn('feedback', newObject).then((res)=>{
            Alert.alert(
                'Great! thank you for the feedback, you beautiful person!',
                'Have a nice day',
				[
                    {text: 'Ok' }
				],
				{ cancelable: true }
            )
            this.setState({ ...this.state, visibleModal: false })
		}).catch((error) => {
			console.log(error.message)
			Alert.alert(
				'Sorry somehing went wrong!, please try again',
				error.message,
				[
					{text: 'Ok'}
				],
				{ cancelable: true }
            )
            this.setState({ ...this.state, visibleModal: false }) 
		})
	}

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
                <TouchableOpacity  style={styles.button} onPress={() => this.setState({ visibleModal: false })}>
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
                <TouchableOpacity  style={styles.modalButton} onPress={() => this.setState({ visibleModal: true })}>
                    <ImageBackground style={styles.buttonImage}
                        source={commementImage}>
                    </ImageBackground>
                </TouchableOpacity>
                <Modal isVisible={this.state.visibleModal === true}>
                    {this._renderModalContent()}
                </Modal>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    //Trigger button styles
    box: {
        ...StyleSheet.absoluteFillObject,
        width: 16,
        height:16,
        marginLeft: '80%'
    },  
	buttonImage: {
		padding: 24,
		borderRadius: 10,
		backgroundColor: '#fff'		
    },
    //Inside the modal styles
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