const Store = require('electron-store');
const log = require('./log')

//TODO: Schema validation
const store = new Store();

//keys
const LAB_DETAILS = 'lab_details'

const setLabDetails = (name, address, contactNumbers, email, labBanner) => {
	try {
		store.set(LAB_DETAILS, {
			name,
			address,
			contactNumbers,
			email,
			labBanner
		})
	} catch (error) {
		log.error(`Error in setting lab details: ${error}`)
		throw error
	}

}

const getLabDetails = () => {
	try {
		const details = store.get(LAB_DETAILS)
		if (!details) {
			return {
				name: '',
				address: '',
				contactNumbers: [],
				email: '',
				labBanner: null
			}
		}
		return store.get(LAB_DETAILS)
	} catch (error) {
		log.error(`Error in getting lab details: ${error}`)
		return {
			name: '',
			address: '',
			contactNumbers: [],
			email: '',
			labBanner: null
		}
	}

}

module.exports = {
	setLabDetails,
	getLabDetails
}