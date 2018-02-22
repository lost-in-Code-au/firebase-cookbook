import { 
	Alert
} from 'react-native'

export const submitionAlert = (options, callback) => {
	const isfalse = (currentValue) => {
		return currentValue
	}//needs to be tested a bit

	if( options.every(isfalse) === false ){
		Alert.alert(
			'Wait up!',
			'Something is missing from your recipe brief, please double chack',
			{ cancelable: true }
		)
	} else {
		return callback
	}
}

export default Util