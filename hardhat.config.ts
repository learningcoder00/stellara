import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem";
import "@nomicfoundation/hardhat-ignition";

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  networks: {
    hardhat: {
      type: "http",
      url: "http://127.0.0.1:8545",
      gas: 30000000,
      gasPrice: 20000000000
    },
    localhost: {
      type: "http",
      url: "http://127.0.0.1:8545",
      gas: 30000000,
      gasPrice: 20000000000
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  }
};

export default config;