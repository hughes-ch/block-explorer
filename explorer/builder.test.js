const TransferReportBuilder = require('./builder')
const { sendTransactions } = require('../test/utils')

contract('the transfer report builder', (accounts) => {
  it('creates an empty TransferReport when there are no transactions', async () => {
    const builder = new TransferReportBuilder(web3.eth)
    const report = await builder.buildReport(0, 0)
    expect(report.transactionList).to.be.empty
  })

  it('creates an empty TransferReport when given invalid starting block', async () => {
    await sendTransactions([
      { from: accounts[0], to: accounts[1], value: web3.utils.toWei('1') },
      { from: accounts[4], to: accounts[3], value: web3.utils.toWei('1') },
      { from: accounts[2], to: accounts[0], value: web3.utils.toWei('1') },
    ])

    const currentBlockNum = await web3.eth.getBlockNumber()
    const builder = new TransferReportBuilder(web3.eth)
    const report = await builder.buildReport(
      currentBlockNum + 10,
      currentBlockNum + 15
    )

    expect(report.transactionList).to.be.empty
  })

  it('creates TransferReport with list of all transactions in a block', async () => {
    await sendTransactions([
      { from: accounts[0], to: accounts[1], value: web3.utils.toWei('1') },
      { from: accounts[4], to: accounts[3], value: web3.utils.toWei('1') },
      { from: accounts[2], to: accounts[0], value: web3.utils.toWei('1') },
    ])

    const currentBlockNum = await web3.eth.getBlockNumber()
    const builder = new TransferReportBuilder(web3.eth)
    const report = await builder.buildReport(
      currentBlockNum - 2,
      currentBlockNum
    )

    expect(report.transactionList.length).to.equal(3)
  })

  it('can handle invalid ending block', async () => {
    await sendTransactions([
      { from: accounts[0], to: accounts[1], value: web3.utils.toWei('1') },
      { from: accounts[4], to: accounts[3], value: web3.utils.toWei('1') },
      { from: accounts[2], to: accounts[0], value: web3.utils.toWei('1') },
    ])

    const currentBlockNum = await web3.eth.getBlockNumber()
    const builder = new TransferReportBuilder(web3.eth)
    const report = await builder.buildReport(
      currentBlockNum - 2,
      currentBlockNum + 15,
    )

    expect(report.transactionList.length).to.equal(3)
  })
})
