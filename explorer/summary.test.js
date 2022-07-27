const TestErc20 = artifacts.require("TestErc20")
const TransactionSummary = require('./summary')
const { sendTransactions } = require('../test/utils')

contract('calculation of ether transfer', (accounts) => {
  it('should return 0 with no transactions', () => {
    const summary = new TransactionSummary([], web3.eth)
    expect(summary.totalEtherTransfer.toString()).to.equal('0')
  })

  it('should sum amount of multiple transactions', async () => {
    const transactions = await sendTransactions([
      { from: accounts[0], to: accounts[1], value: web3.utils.toWei('1') },
      { from: accounts[4], to: accounts[3], value: web3.utils.toWei('1') },
      { from: accounts[2], to: accounts[0], value: web3.utils.toWei('1') },
    ])

    const summary = new TransactionSummary(transactions, web3.eth)
    expect(summary.totalEtherTransfer.toString()).to.equal(web3.utils.toWei('3'))
  })
})

contract('calculation of receiving addresses', (accounts) => {
  it('should return an empty obj when there are no transactions', () => {
    const summary = new TransactionSummary([], web3.eth)
    expect(summary.receivingAddresses).to.be.empty
  })

  it('should return an obj with unique addresses and amounts transferred to them', async () => {
    const transactions = await sendTransactions([
      { from: accounts[0], to: accounts[1], value: web3.utils.toWei('1') },
      { from: accounts[4], to: accounts[1], value: web3.utils.toWei('1') },
      { from: accounts[2], to: accounts[0], value: web3.utils.toWei('1') },
      { from: accounts[8], to: accounts[2], value: web3.utils.toWei('1') },
    ])

    const summary = new TransactionSummary(transactions, web3.eth)
    const addresses = summary.receivingAddresses
    expect(addresses[accounts[0]].toString()).to.equal(web3.utils.toWei('1'))
    expect(addresses[accounts[1]].toString()).to.equal(web3.utils.toWei('2'))
    expect(addresses[accounts[2]].toString()).to.equal(web3.utils.toWei('1'))
    expect(Object.entries(addresses).length).to.equal(3)
  })
})

contract('calculation of sending addresses', (accounts) => {
  it('should return an empty obj when there are no transactions', () => {
    const summary = new TransactionSummary([], web3.eth)
    expect(summary.sendingAddresses).to.be.empty
  })

  it('should return an obj with unique addresses and amounts transferred from them', async () => {
    const transactions = await sendTransactions([
      { from: accounts[0], to: accounts[1], value: web3.utils.toWei('1') },
      { from: accounts[0], to: accounts[2], value: web3.utils.toWei('1') },
      { from: accounts[1], to: accounts[0], value: web3.utils.toWei('1') },
      { from: accounts[2], to: accounts[3], value: web3.utils.toWei('1') },
    ])

    const summary = new TransactionSummary(transactions, web3.eth)
    const addresses = summary.sendingAddresses
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

    const summary = new TransactionSummary(transactions, web3.eth)
    expect(await summary.contractAddresses(web3.eth)).to.be.empty
  })

  it('should return an array of contract addresses sent to', async () => {
    const contractInstance = await TestErc20.deployed()
    await contractInstance.transfer(accounts[0], 1)
    const block = await web3.eth.getBlock('latest', true)
    const summary = new TransactionSummary(block.transactions, web3.eth)
    const addresses = await summary.contractAddresses()
    expect(addresses.length).to.equal(1)
    expect(contractInstance.address).to.include(addresses)
  })
})
