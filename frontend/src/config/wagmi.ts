// Wagmi 配置文件
export const supportedChains = [
  {
    id: 1,
    name: 'Ethereum',
    icon: '🔷',
    rpc: 'https://mainnet.infura.io/v3/your-project-id',
    explorer: 'https://etherscan.io',
    currency: 'ETH'
  },
  {
    id: 11155111,
    name: 'Sepolia',
    icon: '🧪',
    rpc: 'https://sepolia.infura.io/v3/your-project-id',
    explorer: 'https://sepolia.etherscan.io',
    currency: 'ETH'
  },
  {
    id: 137,
    name: 'Polygon',
    icon: '💜',
    rpc: 'https://polygon-rpc.com',
    explorer: 'https://polygonscan.com',
    currency: 'MATIC'
  },
  {
    id: 80001,
    name: 'Mumbai',
    icon: '🏙️',
    rpc: 'https://rpc-mumbai.maticvigil.com',
    explorer: 'https://mumbai.polygonscan.com',
    currency: 'MATIC'
  }
];

// 获取默认网络
export const getDefaultNetwork = () => {
  return supportedChains.find(chain => chain.id === 11155111) || supportedChains[0];
};

// 根据 ID 获取网络信息
export const getNetworkById = (id: number) => {
  return supportedChains.find(chain => chain.id === id);
};

// 验证网络是否支持
export const isNetworkSupported = (id: number) => {
  return supportedChains.some(chain => chain.id === id);
};

export default {
  supportedChains,
  getDefaultNetwork,
  getNetworkById,
  isNetworkSupported
};
