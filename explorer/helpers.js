const Web3 = require('web3')

/** Adds two Wei values, represented as strings */
function addWei(a, b) {
  return Web3.utils.toBN(a).add(Web3.utils.toBN(b))
}

module.exports = {
  addWei,
}
