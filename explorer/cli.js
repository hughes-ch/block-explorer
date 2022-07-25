#!/usr/bin/env node
const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");
const { fetchTransferReport } = require("./helpers")

const argv = yargs(hideBin(process.argv))
      .options({
        'start': {
          alias: 's',
          describe: 'Starting block of explorer',
        },
        'end': {
          alias: 'e',
          describe: 'Ending block of explorer (inclusive)',
        },
      })
      .argv

if (argv.start != null && argv.end != null) {
  fetchTransferReport(argv.start, argv.end).then(report => {
    console.log(report.toString())
  })
} else {
  console.log("Must specify start and end block")
}
