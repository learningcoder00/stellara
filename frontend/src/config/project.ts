// 项目配置文件
export const PROJECT_CONFIG = {
  // 项目基本信息
  name: 'Stellara',
  version: '1.0.0',
  description: '去中心化的虚拟服装 NFT 交易平台',
  
  // 网络配置
  networks: {
    ethereum: {
      id: 1,
      name: 'Ethereum Mainnet',
      rpc: 'https://mainnet.infura.io/v3/your-project-id',
      explorer: 'https://etherscan.io',
      currency: 'ETH'
    },
    sepolia: {
      id: 11155111,
      name: 'Sepolia Testnet',
      rpc: 'https://sepolia.infura.io/v3/your-project-id',
      explorer: 'https://sepolia.etherscan.io',
      currency: 'ETH'
    },
    polygon: {
      id: 137,
      name: 'Polygon Mainnet',
      rpc: 'https://polygon-rpc.com',
      explorer: 'https://polygonscan.com',
      currency: 'MATIC'
    },
    mumbai: {
      id: 80001,
      name: 'Mumbai Testnet',
      rpc: 'https://rpc-mumbai.maticvigil.com',
      explorer: 'https://mumbai.polygonscan.com',
      currency: 'MATIC'
    }
  },
  
  // 默认网络
  defaultNetwork: 'sepolia',
  
  // IPFS 配置
  ipfs: {
    gateway: 'https://ipfs.io/ipfs/',
    pinata: {
      apiKey: process.env.NEXT_PUBLIC_PINATA_API_KEY || '',
      secretKey: process.env.NEXT_PUBLIC_PINATA_SECRET_KEY || '',
      gateway: 'https://gateway.pinata.cloud/ipfs/'
    }
  },
  
  // 智能合约配置
  contracts: {
    nft: {
      name: 'StellaraNFT',
      symbol: 'STELLARA',
      description: 'Stellara Virtual Clothing NFT'
    },
    marketplace: {
      name: 'StellaraMarketplace',
      fee: 2.5, // 2.5% 平台费用
      description: 'Stellara NFT Marketplace'
    }
  },
  
  // UI 配置
  ui: {
    theme: {
      primary: '#3b82f6',
      secondary: '#8b5cf6',
      accent: '#06b6d4',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444'
    },
    animations: {
      duration: 200,
      easing: 'ease-out'
    }
  }
};

// 环境变量验证
export const validateEnvironment = () => {
  const required = [
    'NEXT_PUBLIC_PINATA_API_KEY',
    'NEXT_PUBLIC_PINATA_SECRET_KEY'
  ];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.warn('缺少环境变量:', missing.join(', '));
    return false;
  }
  
  return true;
};

export default PROJECT_CONFIG;
