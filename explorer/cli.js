#!/usr/bin/env node
const TransferReportBuilder = require('./builder')
const Web3 = require('web3')
const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')

/**
 * Returns a new TransferReport
 * @param {int} startBlock - Starting block of the report
 * @param {int} endBlock - Ending block of the report (inclusive)
 */
async function fetchTransferReport(startBlock, endBlock) {
  const web3 = new Web3(Web3.givenProvider || 'ws://localhost:7545')
  const builder = new TransferReportBuilder(web3.eth)
  return builder.buildReport(startBlock, endBlock)
}

const argv = yargs(hideBin(process.argv))
  .options({
    start: {
      alias: 's',
      describe: 'Starting block of explorer'
    },
    end: {
      alias: 'e',
      describe: 'Ending block of explorer (inclusive)'
    }
  })
  .argv

if (isNaN(argv.start) || isNaN(argv.end)) {
  console.log('Must specify start and end block')
} else {
  fetchTransferReport(argv.start, argv.end).then(report => {
    console.log(report.toString())
  })
}
