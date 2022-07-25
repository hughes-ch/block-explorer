const TransferReportBuilder = require('./builder')

/**
 * Returns a new TransferReport
 * @param {int} startBlock - Starting block of the report
 * @param {int} endBlock - Ending block of the report (inclusive)
 */
async function fetchTransferReport(startBlock, endBlock) {
  const builder = new TransferReportBuilder(startBlock, endBlock)
  return builder.fromChain()
}

module.exports = {
  fetchTransferReport
}
