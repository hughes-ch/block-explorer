#!/usr/bin/env node
const TransferReportBuilder = require('./builder')
const Web3Provider = require('./provider')
const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')

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
  new Web3Provider().run(async (provider) => {
    const builder = new TransferReportBuilder(provider)
    const report = await builder.buildReport(argv.start, argv.end)
    console.log(await report.toString(provider))
  })
}
