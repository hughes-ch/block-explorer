const { addWei } = require('./helpers')
const Web3 = require('web3')

/**
 * Calculates information about transactions that occurred in a block.
 * Currently calculates:
 *   - The total ether amount transferred in the block
 */
class TransferReport {
  /**
   * Constructor
   * @param {Array[Transaction]} transactionList - An array of Transactions
   */
  constructor(transactionList) {
    const fieldNames = [
      'totalEtherTransfer',
      'receivingAddresses',
    ]

    for (const name of fieldNames) {
      const camelCaseName = name[0].toUpperCase() + name.slice(1)
      this[name] = this[`get${camelCaseName}`](transactionList)
    }
  }

  /** Converts the object to an ASCII representation */
  toString() {
    return `Total Ether Transfer: ${this.totalEtherTransfer}`
  }

  /**
   * Gets the total amount of ether transferred in the transactionList
   * @param {Array[Transaction]} transactionList - An array of Transactions
   */
  getTotalEtherTransfer(transactionList) {
    return transactionList.reduce(this.reduceTransactions, Web3.utils.toBN(0))
  }

  /**
   * Gets the receiving addresses (and how much they received)
   * @param {Array[Transaction]} transactionList - An array of Transactions
   */
  getReceivingAddresses(transactionList) {
    const addresses = transactionList.map(tx => tx.to)
    const uniqueAddresses = Array.from(new Set(addresses))
    const receivingAddresses = {}
    for (const address of uniqueAddresses) {
      const txToAddress = transactionList.filter(tx => tx.to === address)
      receivingAddresses[address] = txToAddress.reduce(
        this.reduceTransactions, Web3.utils.toBN(0)
      )
    }

    return receivingAddresses
  }

  /** Reduces transactions to the sum of their values */
  reduceTransactions(prev, curr) {
    return addWei(prev, curr.value)
  }
}

module.exports = TransferReport
