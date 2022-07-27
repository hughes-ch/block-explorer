const Web3 = require('web3')

/**
 * Wraps the Web3 creation and closure within a run method.
 */
class Web3Provider {
  /**
   * Runs the given function within the context of a Web3 provider.
   * The provider is given as a single argument to the function. After
   * the function completes, the Web3 connection is closed.
   * @param {Function} func - The function to run. Takes 1 arg: provider
   */
  async run(func) {
    const web3 = new Web3(Web3.givenProvider || 'ws://localhost:7545')
    await func(web3.eth)
    web3.currentProvider.connection.close()
  }
}

module.exports = Web3Provider
