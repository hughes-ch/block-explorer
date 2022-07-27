const TransferReportBuilder = require('./builder')
const { sendTransactions } = require('../test/utils')

contract('the transfer report builder', (accounts) => {
  it('creates an empty TransferReport when there are no transactions', async () => {
    const builder = new TransferReportBuilder(web3.eth)
    const report = await builder.buildReport({start: 0, end: 0})
    expect(report.summary.transactions).to.be.empty
  })

  it('creates an empty TransferReport when given invalid starting block', async () => {
    await sendTransactions([
      { from: accounts[0], to: accounts[1], value: web3.utils.toWei('1') },
      { from: accounts[4], to: accounts[3], value: web3.utils.toWei('1') },
      { from: accounts[2], to: accounts[0], value: web3.utils.toWei('1') },
    ])

    const currentBlockNum = await web3.eth.getBlockNumber()
    const builder = new TransferReportBuilder(web3.eth)
    const report = await builder.buildReport({
      start: currentBlockNum + 10,
      end: currentBlockNum + 15
    })

    expect(report.summary.transactions).to.be.empty
  })

  it('creates TransferReport with list of all transactions in a block', async () => {
    await sendTransactions([
      { from: accounts[0], to: accounts[1], value: web3.utils.toWei('1') },
      { from: accounts[4], to: accounts[3], value: web3.utils.toWei('1') },
      { from: accounts[2], to: accounts[0], value: web3.utils.toWei('1') },
    ])

    const currentBlockNum = await web3.eth.getBlockNumber()
    const builder = new TransferReportBuilder(web3.eth)
    const report = await builder.buildReport({
      start: currentBlockNum - 2,
      end: currentBlockNum
    })

    expect(report.summary.transactions.length).to.equal(3)
  })

  it('can handle invalid ending block', async () => {
    await sendTransactions([
      { from: accounts[0], to: accounts[1], value: web3.utils.toWei('1') },
      { from: accounts[4], to: accounts[3], value: web3.utils.toWei('1') },
      { from: accounts[2], to: accounts[0], value: web3.utils.toWei('1') },
    ])

    const currentBlockNum = await web3.eth.getBlockNumber()
    const builder = new TransferReportBuilder(web3.eth)
    const report = await builder.buildReport({
      start: currentBlockNum - 2,
      end: currentBlockNum + 15,
    })

    expect(report.summary.transactions.length).to.equal(3)
  })

  it('creates TransferReport when specifying number of blocks from end', async () => {
    await sendTransactions([
      { from: accounts[0], to: accounts[1], value: web3.utils.toWei('1') },
      { from: accounts[4], to: accounts[3], value: web3.utils.toWei('1') },
      { from: accounts[2], to: accounts[0], value: web3.utils.toWei('1') },
    ])

    const currentBlockNum = await web3.eth.getBlockNumber()
    const builder = new TransferReportBuilder(web3.eth)
    const report = await builder.buildReport({last: 3})
    expect(report.summary.transactions.length).to.equal(3)
  })
})
