const TransferReport = require('./report')
const Web3 = require('web3')

/** Fetches requested block information and builds a TransferReport */
class TransferReportBuilder {
  /**
   * Constructor
   * @param {int} startBlock - Starting block number
   * @param {int} endBlock - Ending block Number
   */
  constructor(startBlock, endBlock) {
    this.startBlock = startBlock
    this.endBlock = endBlock
    this.provider = new Web3(Web3.givenProvider || 'ws://localhost:7545').eth
  }

  /** Creates a TransferReport by fetching data off of the chain */
  async fromChain() {
    const transactions = await this.getTransactions()
    return new TransferReport(transactions)
  }

  /** Gets a list of all transactions between start/end blocks */
  async getTransactions() {
    const blockPromises = []
    for (let blockNum = this.startBlock; blockNum <= this.endBlock; blockNum++) {
      blockPromises.push(this.provider.getBlock(blockNum, true))
    }

    const blocks = await Promise.all(blockPromises)
    const transactions = []
    for (const block of blocks) {
      if (block) {
        transactions.concat(block.transactions)
      }
    }

    return transactions
  }
}

module.exports = TransferReportBuilder
