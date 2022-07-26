const TransferReportBuilder = require('./builder')
const Web3 = require('web3')

/**
 * Returns a new TransferReport
 * @param {int} startBlock - Starting block of the report
 * @param {int} endBlock - Ending block of the report (inclusive)
 */
async function fetchTransferReport(startBlock, endBlock) {
  const builder = new TransferReportBuilder(startBlock, endBlock)
  return builder.fromChain()
}

/** Adds two Wei values, represented as strings */
function addWei(a, b) {
  return Web3.utils.toBN(a).add(Web3.utils.toBN(b))
}

module.exports = {
  addWei,
  fetchTransferReport,
}
