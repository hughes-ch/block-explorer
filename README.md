# CLI Block Explorer
A CLI block explorer that can quickly display stats about a group of blocks. 

It has two easy-to-use command-line switches so users are quickly able to access the data they need:
```
explore --start <block_num> --end <block_num>
```
```
explore --last <N blocks>
```

In both cases, users get an easy-to-digest report that looks similar to:
```
3 transactions found for total of 2 ETH transferred.

There were 3 senders:
	0x54C4c5d163BBEfaDE776cf35cfE1D3e9053d2D42: 1 ETH 
	0xdB105B338199e647cB2747AaEa7CCE9De47cB816: 1 ETH 
	0x368599f57c3aBE7B496c339E3C27E6D1582d8e55: 0 ETH 

... and 3 receivers:
	0x368599f57c3aBE7B496c339E3C27E6D1582d8e55: 1 ETH 
	0x109B80383f6d8077581b95384Af264eCBd52965b: 1 ETH 
	0xeC8FDCeE16c09bE98F9CAfa2AC8D88933bDd8730: 0 ETH (contract)
```

## Installation
Installation can be done with yarn or npm:
```
>> npm i @hughes-ch/block-explorer
```
```
>> yarn add @hughes-ch/block-explorer
```

If not installed globally, running the script can be done like so:
```
>> npm exec explore --last 10
```
```
>> yarn run explore --last 10
```

## Development
This project uses the yarn package manager. To install a local copy, first pull from this repo and then run in your local directory:
```
yarn install
```

To run local testing, a instance of Ganache must be running on the local machine on port 7545. Running unit tests can be done with:
```
yarn test
```

To run the full command line tool with the local changes, type:
```
explorer/cli.js <args>
```

Before pushing, make sure to run `yarn lint` to ensure code style matches.
