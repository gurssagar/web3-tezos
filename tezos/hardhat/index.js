const { Web3 } = require('web3');

const web3 = new Web3('http://127.0.0.1:8545/');

// Log the chain ID to the console
web3.eth
	.getChainId()
	.then(result => {
		console.log('Chain ID: ' + result);
	})
	.catch(error => {
		console.error(error);
	});