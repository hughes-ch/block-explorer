const Web3 = require('web3')

/**
 * Calculates information about transactions that occurred in a block.
 * Currently calculates:
 *   - The total ether amount transferred in the block
 */
class TransferReport {
  /**
   * Constructor
   * @param {List[TransactionResponse]} transactionList - A list of TransactionResponses
   */
  constructor(transactionList) {
    this.totalEtherTransfer = this.getTotalEtherTransfer(transactionList)
  }

  /** Converts the object to an ASCII representation */
  toString() {
    return `Total Ether Transfer: ${this.totalEtherTransfer}`
  }

  /**
   * Gets the total amount of ether transferred in the transactionList
   * @param {List[TransactionResponse]} transactionList - A list of TransactionResponses
   */
  getTotalEtherTransfer(transactionList) {
    const sum = (prev, curr) => this.addWei(prev, curr.value)
    return transactionList.reduce(sum, Web3.utils.toBN(0))
  }

  /** Adds two Wei values, represented as strings */
  addWei(a, b) {
    return Web3.utils.toBN(a).add(Web3.utils.toBN(b))
  }
}

module.exports = TransferReport
