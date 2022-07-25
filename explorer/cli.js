#!/usr/bin/env node
const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");

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

if (argv.start && argv.end) {
  console.log(`Exploring blocks ${argv.start} to ${argv.end}`)
} else {
  console.log("Must specify start and end block")
}
