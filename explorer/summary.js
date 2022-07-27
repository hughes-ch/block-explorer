const Web3 = require('web3')
const { addWei } = require('./helpers')

class TransactionSummary {
  /**
   * Constructor
   * @param {Array[Transaction]} transactions
   * @param {Web3.provider} provider
   */
  constructor(transactions, provider) {
    this.transactions = transactions
    this.provider = provider
  }

  /** Gets the total amount of ether transferred */
  get totalEtherTransfer() {
    return this.transactions.reduce(
      this.reduceTransactions, Web3.utils.toBN(0)
    )
  }

  /** Gets the receiving addresses and how much they received */
  get receivingAddresses() {
    const txAddressLookup = tx => tx.to
    return this.txAmountPerAddress(txAddressLookup)
  }

  /** Gets the sending addresses and how much they received */
  get sendingAddresses() {
    const txAddressLookup = tx => tx.from
    return this.txAmountPerAddress(txAddressLookup)
  }

  /**
   * Gets a list of contract addresses involved in the transactions
   * @param {Web3.provider} provider - Web3 ether provider
   */
  async contractAddresses() {
    const allAddresses = this.transactions.map(tx => [tx.to, tx.from])
    const uniqueAddresses = Array.from(new Set(allAddresses.flat()))
    const isCodeAtAddress = await Promise.all(
      uniqueAddresses.map(async (address) => {
        const codeAtAddress = await this.provider.getCode(address)
        return codeAtAddress !== '0x'
      })
    )

    return uniqueAddresses.filter((_, idx) => isCodeAtAddress[idx])
  }

  /** Reduces transactions to the sum of their values */
  reduceTransactions(prev, curr) {
    return addWei(prev, curr.value)
  }

  /**
   * Finds the amount of transactions for each address
   * @param {Function} txAddressLookup - Outputs an address for a transaction
   */
  txAmountPerAddress(txAddressLookup) {
    const addresses = this.transactions.map(tx => txAddressLookup(tx))
    const uniqueAddresses = new Set(addresses)
    const txAmounts = {}
    for (const address of uniqueAddresses) {
      const transactionsWithAddress = this.transactions.filter(
        tx => txAddressLookup(tx) === address
      )

      txAmounts[address] = transactionsWithAddress.reduce(
        this.reduceTransactions, Web3.utils.toBN(0)
      )
    }

    return txAmounts
  }
}

module.exports = TransactionSummary
