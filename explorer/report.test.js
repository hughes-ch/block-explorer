const TestErc20 = artifacts.require("TestErc20")
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

contract('calculation of sending addresses', (accounts) => {
  it('should return an empty obj when there are no transactions', () => {
    const report = new TransferReport([])
    expect(report.sendingAddresses).to.be.empty
  })

  it('should return an obj with unique addresses and amounts transferred from them', async () => {
    const transactions = await sendTransactions([
      { from: accounts[0], to: accounts[1], value: web3.utils.toWei('1') },
      { from: accounts[0], to: accounts[2], value: web3.utils.toWei('1') },
      { from: accounts[1], to: accounts[0], value: web3.utils.toWei('1') },
      { from: accounts[2], to: accounts[3], value: web3.utils.toWei('1') },
    ])

    const report = new TransferReport(transactions)
    const addresses = report.sendingAddresses
    expect(addresses[accounts[0]].toString()).to.equal(web3.utils.toWei('2'))
    expect(addresses[accounts[1]].toString()).to.equal(web3.utils.toWei('1'))
    expect(addresses[accounts[2]].toString()).to.equal(web3.utils.toWei('1'))
    expect(Object.entries(addresses).length).to.equal(3)
  })
})

contract('calculation of contracts', (accounts) => {
  it('should return an empty array when there are no contracts', async () => {
    const transactions = await sendTransactions([
      { from: accounts[0], to: accounts[1], value: web3.utils.toWei('1') },
      { from: accounts[1], to: accounts[0], value: web3.utils.toWei('1') },
      { from: accounts[2], to: accounts[3], value: web3.utils.toWei('1') },
    ])

    const report = new TransferReport(transactions)
    expect(await report.contractAddresses(web3.eth)).to.be.empty
  })

  it('should return an array of contract addresses sent to', async () => {
    const contractInstance = await TestErc20.deployed()
    await contractInstance.transfer(accounts[0], 1)
    const block = await web3.eth.getBlock('latest', true)
    const report = new TransferReport(block.transactions)
    const addresses = await report.contractAddresses(web3.eth)
    expect(addresses.length).to.equal(1)
    expect(contractInstance.address).to.include(addresses)
  })
})
