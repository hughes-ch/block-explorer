const TestErc20 = artifacts.require('TestErc20')
const TransactionSummary = require('./summary')
const TransferReport = require('./report')
const { sendTransactions } = require('../test/utils')

contract('the TransferReport', (accounts) => {
  it('generates reports correctly', async () => {
    const transactions = await sendTransactions([
      { from: accounts[0], to: accounts[1], value: web3.utils.toWei('1') },
      { from: accounts[4], to: accounts[3], value: web3.utils.toWei('2') },
      { from: accounts[2], to: accounts[0], value: web3.utils.toWei('3') },
    ])

    const summary = new TransactionSummary(transactions, web3.eth)
    const report = new TransferReport(summary)
    const reportStr = await report.toString()

    expect(reportStr).includes('total of 6 ETH')
    expect(reportStr).includes('3 transactions found')
    expect(reportStr).includes(`${accounts[0]}: 1 ETH`)
    expect(reportStr).includes(`${accounts[1]}: 1 ETH`)
    expect(reportStr).includes(`${accounts[0]}: 3 ETH`)
  })

  it('can handle blocks with no transactions', async () => {
    const summary = new TransactionSummary([], web3.eth)
    const report = new TransferReport(summary)
    const reportStr = await report.toString()

    expect(reportStr).includes('0 transactions found')
  })

  it('displays contracts', async () => {
    const contractInstance = await TestErc20.deployed()
    await contractInstance.transfer(accounts[0], 1)
    const block = await web3.eth.getBlock('latest', true)
    const summary = new TransactionSummary(block.transactions, web3.eth)
    const report = new TransferReport(summary)
    const reportStr = await report.toString()

    expect(reportStr).includes('(contract)')
  })
})
