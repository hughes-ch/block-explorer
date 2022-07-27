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
   * @param {Object} argv - Argv from command line
   */
  async buildReport(argv) {
    const [startBlock, endBlock] = await this.getStartEnd(argv)
    const transactions = await this.getTransactions(startBlock, endBlock)
    const summary = new TransactionSummary(transactions, this.provider)
    return new TransferReport(summary)
  }

  /**
   * Gets the start and stop blocks from the CLI inputs
   * @param {Object} argv
   */
  async getStartEnd(argv) {
    if (!isNaN(argv.last)) {
      return this.getStartEndFromCount(argv.last)
    } else {
      return this.getStartEndFromRange(argv.start, argv.end)
    }
  }

  /**
   * Gets the start and end blocks from the last N blocks
   * @param {Number} count - Number of blocks to backtrack
   */
  async getStartEndFromCount(count) {
    const safeCount = count < 0 ? 0 : count
    const currentBlock = await this.provider.getBlockNumber()
    return [currentBlock - safeCount + 1, currentBlock]
  }

  /**
   * Gets the start and end blocks from a specified range.
   * @param {Number} start - Start block (inclusive)
   * @param {Number} end - End block (inclusive)
   */
  async getStartEndFromRange(start, end) {
    const safeStartBlock = start < 0 ? 0 : start
    let safeEndBlock = end < 0 ? 0 : end

    // Note that only the end block needs to be limited by the
    // currentBlock. If start block is > currentBlock, the loop
    // in getTransactions will never execute.
    const currentBlock = await this.provider.getBlockNumber()
    safeEndBlock = safeEndBlock > currentBlock ? currentBlock : safeEndBlock
    return [safeStartBlock, safeEndBlock]
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
