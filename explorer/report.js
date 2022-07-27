const Web3 = require('web3')

/**
 * Calculates information about transactions that occurred in a block.
 * Currently calculates:
 *   - The total ether amount transferred in the block
 */
class TransferReport {
  /**
   * Constructor
   * @param {TransactionSummary} summary - TransactionSummary instance to report
   */
  constructor(summary) {
    this.summary = summary
  }

  /** Converts the object to an ASCII representation */
  async toString() {
    const txCount = this.summary.transactions.length
    const trailingS = txCount === 1 ? '' : 's'
    const ethTransferred = Web3.utils.fromWei(this.summary.totalEtherTransfer)

    const senders = this.summary.sendingAddresses
    const receivers = this.summary.receivingAddresses
    const contracts = await this.summary.contractAddresses()

    const sendersStr = this.buildAccountListStr(senders, contracts)
    const receiversStr = this.buildAccountListStr(receivers, contracts)

    const template = `
${txCount} transaction${trailingS} found for total of ${ethTransferred} ETH transferred.

There were ${Object.keys(senders).length} senders:
${sendersStr}

... and ${Object.keys(receivers).length} receivers:
${receiversStr}
`
    return template
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
