const TransactionSummary = require('./summary')
const TransferReport = require('./report')

/** Fetches requested block information and builds a TransferReport */
class TransferReportBuilder {
  /**
   * Constructor
   * @param {Web3.provider} provider - Web3 provider
   */
  constructor(provider) {
    this.provider = provider
  }

  /**
   * Creates a TransferReport by fetching data off of the chain
   * @param {int} startBlock - Starting block number
   * @param {int} endBlock - Ending block Number
   */
  async buildReport(startBlock, endBlock) {
    const currentBlock = await this.provider.getBlockNumber()
    const cappedEndBlock = (endBlock > currentBlock) ? currentBlock : endBlock

    let transactions
    if (startBlock > currentBlock) {
      transactions = []
    } else {
      transactions = await this.getTransactions(startBlock, cappedEndBlock)
    }

    const summary = new TransactionSummary(transactions, this.provider)
    return new TransferReport(summary)
  }

  /**
   * Gets a list of all transactions between start/end blocks
   * @param {int} startBlock - Starting block number
   * @param {int} endBlock - Ending block Number
   */
  async getTransactions(startBlock, endBlock) {
    const blockPromises = []
    for (let blockNum = startBlock; blockNum <= endBlock; blockNum++) {
      blockPromises.push(this.provider.getBlock(blockNum, true))
    }

    const blocks = await Promise.all(blockPromises)
    const transactions = blocks.map(block => block.transactions)
    return transactions.flat()
  }
}

module.exports = TransferReportBuilder
