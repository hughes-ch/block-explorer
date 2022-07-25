const TransferReportBuilder = require("./builder")

async function fetchTransferReport(startBlock, endBlock) {
  builder = new TransferReportBuilder(startBlock, endBlock);
  return builder.fromChain()
}

module.exports = {
  fetchTransferReport,
}
