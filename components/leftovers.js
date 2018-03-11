


//============================================================================================

// A dynamic button renderer that takes in 2 params(text, onPress) and a image if you like.

{this._renderButton('Next', this._submitRecipe)}

_renderButton = (text, onPress) => (
    <TouchableOpacity  style={styles.modalButton} onPress={onPress}>
        <ImageBackground style={styles.buttonImage}
            source={commementImage}>
            <Text style={styles.text}>{text}</Text>
        </ImageBackground>
    </TouchableOpacity>
)

//Output = a button with the text='Next' and will submitRecipe as it's action

//============================================================================================