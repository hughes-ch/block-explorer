const ethers = require("ethers");
const TransferReport = require("./report");

class TransferReportBuilder {
  constructor(startBlock, endBlock) {
    this.startBlock = startBlock;
    this.endBlock = endBlock;
    this.provider = ethers.getDefaultProvider("http://127.0.0.1:7545");
  }

  async fromChain() {
    const transactions = await this.getTransactions();
    return new TransferReport(transactions);
  }

  async getTransactions() {
    const blockPromises = [];
    for (let blockNum = this.startBlock; blockNum <= this.endBlock; blockNum++) {
      blockPromises.push(this.provider.getBlockWithTransactions(blockNum));
    }

    const blocks = await Promise.all(blockPromises);
    const transactions = [];
    for (const block of blocks) {
      if (block) {
        transactions.concat(block.transactions);
      }
    }

    return transactions;
  }
}

module.exports = TransferReportBuilder;
