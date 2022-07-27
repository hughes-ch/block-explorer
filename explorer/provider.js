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
    const web3 = this.createInstance()
    await func(web3.eth)
    if (web3.currentProvider.connection) {
      web3.currentProvider.connection.close()
    }
  }

  /**
   * Creates an instance of Web3
   *
   * If GANACHE_PORT is found, create an instance at localhost. Otherwise,
   * create an instance that connects to INFURA.
   */
  createInstance() {
    if (process.env.GANACHE_PORT) {
      return new Web3(`ws://localhost:${process.env.GANACHE_PORT}`)
    } else {
      const network = process.env.ETHEREUM_NETWORK
      const projectId = process.env.INFURA_API_KEY
      return new Web3(
        new Web3.providers.HttpProvider(
          `https://${network}.infura.io/v3/${projectId}`
        )
      )
    }
  }
}

module.exports = Web3Provider
