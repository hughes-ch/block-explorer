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
    this.transactionList = transactionList
  }

  /** Converts the object to an ASCII representation */
  async generateReport(provider) {
    const txCount = this.transactionList.length
    const ethTransferred = Web3.utils.fromWei(this.totalEtherTransfer)

    const senders = this.sendingAddresses
    const receivers = this.receivingAddresses
    const contracts = await this.contractAddresses(provider)

    const sendersStr = this.buildAccountListStr(senders, contracts)
    const receiversStr = this.buildAccountListStr(receivers, contracts)

    const template = `
${txCount} transactions found for total of ${ethTransferred} ETH transferred.

There were ${Object.keys(senders).length} senders:
${sendersStr}

... and ${Object.keys(receivers).length} receivers:
${receiversStr}
`
    return template
  }

  /** Gets the total amount of ether transferred */
  get totalEtherTransfer() {
    return this.transactionList.reduce(
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
  async contractAddresses(provider) {
    const allAddresses = this.transactionList.map(tx => [tx.to, tx.from])
    const uniqueAddresses = Array.from(new Set(allAddresses.flat()))
    const isCodeAtAddress = await Promise.all(
      uniqueAddresses.map(async (address) => {
        const codeAtAddress = await provider.getCode(address)
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
    const addresses = this.transactionList.map(tx => txAddressLookup(tx))
    const uniqueAddresses = new Set(addresses)
    const txAmounts = {}
    for (const address of uniqueAddresses) {
      const transactionsWithAddress = this.transactionList.filter(
        tx => txAddressLookup(tx) === address
      )

      txAmounts[address] = transactionsWithAddress.reduce(
        this.reduceTransactions, Web3.utils.toBN(0)
      )
    }

    return txAmounts
  }

  /**
   * Builds a string representing a list of accounts. Contracts are highlighted.
   * @param {Object} accounts - Object representing accounts and ETH values
   * @param {Array[String]} contractAddresses - Array of known contracts
   */
  buildAccountListStr(accounts, contractAddresses) {
    const lines = Object.entries(accounts).map(([account, value]) => {
      const contractIndicator = (
        contractAddresses.includes(account) ? '(contract)' : ''
      )

      const ethValue = Web3.utils.fromWei(value)
      return `\t${account}: ${ethValue} ETH ${contractIndicator}`
    })

    return lines.join('\n')
  }
}

module.exports = TransferReport
