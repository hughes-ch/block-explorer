#!/usr/bin/env node
const TransferReportBuilder = require('./builder')
const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')

/**
 * Returns a new TransferReport
 * @param {int} startBlock - Starting block of the report
 * @param {int} endBlock - Ending block of the report (inclusive)
 */
async function fetchTransferReport(startBlock, endBlock) {
  const builder = new TransferReportBuilder(startBlock, endBlock)
  return builder.fromChain()
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

if (argv.start != null && argv.end != null) {
  fetchTransferReport(argv.start, argv.end).then(report => {
    console.log(report.toString())
  })
} else {
  console.log('Must specify start and end block')
}
