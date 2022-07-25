class TransferReport {
  constructor(transactionList) {
    this.totalEtherTransfer = this.getTotalEtherTransfer(transactionList);
  }

  toString() {
    return `Total Ether Transfer: ${this.totalEtherTransfer}`;
  }

  getTotalEtherTransfer(transactionList) {
    const sum = (prev, curr) => prev.value.add(curr.value);
    return transactionList.reduce(sum, 0);
  }
}

module.exports = TransferReport;
