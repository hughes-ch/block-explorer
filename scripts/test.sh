#!/bin/bash
export GANACHE_PORT=7545
yarn run ganache-cli --port $GANACHE_PORT --quiet &
GANACHE_PID=$!
sleep 5
yarn run truffle test explorer/**.test.js
kill $GANACHE_PID
