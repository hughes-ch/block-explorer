/**
 * Send transactions and return transaction objects
 * @param {Array[Transaction]} transaction - Array of transactions
 */
async function sendTransactions(transactions) {
  const hashes = await Promise.all(
    transactions.map(transaction => web3.eth.sendTransaction(transaction))
  )

  return await Promise.all(
    hashes.map(hash => web3.eth.getTransaction(hash.transactionHash))
  )
}

module.exports = {
  sendTransactions,
}
