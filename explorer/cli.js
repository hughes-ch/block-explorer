#!/usr/bin/env node
const TransferReportBuilder = require('./builder')
const Web3Provider = require('./provider')
const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')

require('dotenv').config()

const argv = yargs(hideBin(process.argv))
  .options({
    start: {
      alias: 's',
      describe: 'Starting block of explorer'
    },
    end: {
      alias: 'e',
      describe: 'Ending block of explorer (inclusive)'
    },
    last: {
      alias: 'l',
      describe: 'Explore a specified number of blocks from the end'
    }
  })
  .check((argv, options) => {
    if (!isNaN(argv.last)) {
      return true
    } else if (!isNaN(argv.start) && !isNaN(argv.end)) {
      return true
    } else {
      throw new Error('A start and stop block must be specified')
    }
  })
  .argv

new Web3Provider().run(async (provider) => {
  const builder = new TransferReportBuilder(provider)
  const report = await builder.buildReport(argv)
  console.log(await report.toString())
})
