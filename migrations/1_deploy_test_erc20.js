const TestErc20 = artifacts.require("TestErc20");

module.exports = function(deployer) {
  deployer.deploy(TestErc20);
};
