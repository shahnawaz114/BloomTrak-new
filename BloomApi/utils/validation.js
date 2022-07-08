var aesjs = require('aes-js');

const Cryptr = require('cryptr');
const cryptr = new Cryptr('2ydTj9JIbitomatic8CLJNlwJsecure');

var isRealString = (str) => {
	return typeof str === 'string' && str.trim().length > 0;
};

const KEY_256 = [
	520,
	521,
	522,
	523,
	524,
	525,
	526,
	527,
	528,
	529,
	530,
	531,
	532,
	533,
	534,
	535,
	536,
	537,
	538,
	539,
	540,
	541,
	542,
	543,
	544,
	545,
	546,
	547,
	548,
	549,
	550,
	551
];

const initializationVector = [
	51,
	52,
	53,
	54,
	55,
	56,
	57,
	58,
	59,
	60,
	61,
	62,
	63,
	64,
	65,
	66
];
const keys = { KEY_256, initializationVector }

const KEY_256_BUFFER = new Uint8Array(keys.KEY_256);

const encryptData = function (text) {
	const textBytes = aesjs.utils.utf8.toBytes(text);
	const aesCbc = new aesjs.ModeOfOperation.ofb(
		KEY_256_BUFFER,
		keys.initializationVector,
	);
	const encryptedBytes = aesCbc.encrypt(textBytes);
	const encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes);
	return encryptedHex;
};

const decryptData = function (value) {
	var encryptedBytes = aesjs.utils.hex.toBytes(value);
	var aesOfb = new aesjs.ModeOfOperation.ofb(
		KEY_256_BUFFER,
		keys.initializationVector,
	);
	var decryptedBytes = aesOfb.decrypt(encryptedBytes);

	// Convert our bytes back into text
	var decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes);
	return decryptedText;
};

module.exports = {
	isRealString,
	encryptData,
	decryptData,
};
