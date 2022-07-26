const TransferReport = require('./report')

/**
 * Send transactions and return transaction objects
 * @param {Array[Transaction]} transaction - Array of transactions
 */
async function sendTransactions(transactions) {
  const hashes = await Promise.all(
    transactions.map(transaction => web3.eth.sendTransaction(transaction))
  )

  return await Promise.all(
    hashes.map(hash => web3.eth.getTransaction(hash.transactionHash))
  )
}

contract('calculation of ether transfer', (accounts) => {
  it('should return 0 with no transactions', () => {
    const report = new TransferReport([])
    expect(report.totalEtherTransfer.toString()).to.equal('0')
  })

  it('should sum amount of multiple transactions', async () => {
    const transactions = await sendTransactions([
      { from: accounts[0], to: accounts[1], value: web3.utils.toWei('1') },
      { from: accounts[4], to: accounts[3], value: web3.utils.toWei('1') },
      { from: accounts[2], to: accounts[0], value: web3.utils.toWei('1') },
    ])

    const report = new TransferReport(transactions)
    expect(report.totalEtherTransfer.toString()).to.equal(web3.utils.toWei('3'))
  })
})

contract('calculation of receiving addresses', (accounts) => {
  it('should return an empty obj when there are no transactions', () => {
    const report = new TransferReport([])
    expect(report.receivingAddresses).to.be.empty
  })

  it('should return an obj with unique addresses and amounts transferred to them', async () => {
    const transactions = await sendTransactions([
      { from: accounts[0], to: accounts[1], value: web3.utils.toWei('1') },
      { from: accounts[4], to: accounts[1], value: web3.utils.toWei('1') },
      { from: accounts[2], to: accounts[0], value: web3.utils.toWei('1') },
      { from: accounts[8], to: accounts[2], value: web3.utils.toWei('1') },
    ])

    const report = new TransferReport(transactions)
    const addresses = report.receivingAddresses
    expect(addresses[accounts[0]].toString()).to.equal(web3.utils.toWei('1'))
    expect(addresses[accounts[1]].toString()).to.equal(web3.utils.toWei('2'))
    expect(addresses[accounts[2]].toString()).to.equal(web3.utils.toWei('1'))
    expect(Object.entries(addresses).length).to.equal(3)
  })
})
