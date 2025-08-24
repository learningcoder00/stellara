// Web3 服务类
import { ethers } from 'ethers';
import { NFT_ABI, MARKETPLACE_ABI, getContractAddresses } from '@/config/contracts';
import { PROJECT_CONFIG } from '@/config/project';

export interface Web3Provider {
  provider: ethers.Provider;
  signer: ethers.Signer;
  address: string;
  chainId: number;
}

export interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes: {
    clothingType: string;
    rarity: string;
    level: number;
    isWearable: boolean;
    ipfsHash: string;
    [key: string]: any;
  };
}

export interface Listing {
  nftContract: string;
  tokenId: bigint;
  seller: string;
  price: bigint;
  isActive: boolean;
  listingTime: bigint;
}

export class Web3Service {
  private provider: ethers.Provider | null = null;
  private signer: ethers.Signer | null = null;
  private nftContract: ethers.Contract | null = null;
  private marketplaceContract: ethers.Contract | null = null;

  constructor() {
    this.initializeProvider();
  }

  // 初始化 Web3 提供者
  private async initializeProvider() {
    try {
      if (typeof window !== 'undefined' && window.ethereum) {
        // 浏览器环境
        this.provider = new ethers.BrowserProvider(window.ethereum);
        this.signer = await this.provider.getSigner();
        
        // 监听账户变化
        window.ethereum.on('accountsChanged', this.handleAccountsChanged.bind(this));
        window.ethereum.on('chainChanged', this.handleChainChanged.bind(this));
        
        console.log('✅ Web3 提供者初始化成功');
      } else {
        console.warn('⚠️ MetaMask 未安装或未连接');
      }
    } catch (error) {
      console.error('❌ Web3 提供者初始化失败:', error);
    }
  }

  // 处理账户变化
  private handleAccountsChanged(accounts: string[]) {
    if (accounts.length === 0) {
      console.log('🔌 请连接 MetaMask');
    } else {
      console.log('👤 账户已切换:', accounts[0]);
      this.initializeProvider();
    }
  }

  // 处理网络变化
  private handleChainChanged(chainId: string) {
    console.log('🌐 网络已切换:', chainId);
    window.location.reload();
  }

  // 获取当前账户信息
  async getAccountInfo(): Promise<Web3Provider | null> {
    try {
      if (!this.provider || !this.signer) {
        await this.initializeProvider();
      }

      if (!this.provider || !this.signer) {
        return null;
      }

      const address = await this.signer.getAddress();
      const network = await this.provider.getNetwork();
      const chainId = Number(network.chainId);

      return {
        provider: this.provider,
        signer: this.signer,
        address,
        chainId
      };
    } catch (error) {
      console.error('❌ 获取账户信息失败:', error);
      return null;
    }
  }

  // 初始化合约
  private async initializeContracts() {
    try {
      const accountInfo = await this.getAccountInfo();
      if (!accountInfo) return;

      const addresses = getContractAddresses(accountInfo.chainId);
      
      if (addresses.nft === '0x0000000000000000000000000000000000000000') {
        console.warn('⚠️ NFT 合约地址未配置');
        return;
      }

      this.nftContract = new ethers.Contract(
        addresses.nft,
        NFT_ABI,
        accountInfo.signer
      );

      this.marketplaceContract = new ethers.Contract(
        addresses.marketplace,
        MARKETPLACE_ABI,
        accountInfo.signer
      );

      console.log('✅ 智能合约初始化成功');
    } catch (error) {
      console.error('❌ 智能合约初始化失败:', error);
    }
  }

  // 铸造 NFT
  async mintNFT(
    clothingType: string,
    rarity: string,
    level: number,
    metadataURI: string
  ): Promise<{ success: boolean; tokenId?: bigint; error?: string }> {
    try {
      if (!this.nftContract) {
        await this.initializeContracts();
      }

      if (!this.nftContract) {
        return { success: false, error: '合约未初始化' };
      }

      const accountInfo = await this.getAccountInfo();
      if (!accountInfo) {
        return { success: false, error: '请先连接钱包' };
      }

      console.log('🎨 开始铸造 NFT...');
      const tx = await this.nftContract.mintClothing(
        accountInfo.address,
        clothingType,
        rarity,
        level,
        metadataURI
      );

      console.log('⏳ 等待交易确认...');
      const receipt = await tx.wait();
      
      // 解析事件获取 tokenId
      const event = receipt.logs.find(log => {
        try {
          const parsed = this.nftContract?.interface.parseLog(log);
          return parsed?.name === 'ClothingMinted';
        } catch {
          return false;
        }
      });

      let tokenId: bigint | undefined;
      if (event) {
        const parsed = this.nftContract?.interface.parseLog(event);
        tokenId = parsed?.args[0];
      }

      console.log('✅ NFT 铸造成功!');
      return { success: true, tokenId };
    } catch (error) {
      console.error('❌ NFT 铸造失败:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : '铸造失败' 
      };
    }
  }

  // 获取用户 NFT 列表
  async getUserNFTs(): Promise<{ success: boolean; nfts?: any[]; error?: string }> {
    try {
      if (!this.nftContract) {
        await this.initializeContracts();
      }

      if (!this.nftContract) {
        return { success: false, error: '合约未初始化' };
      }

      const accountInfo = await this.getAccountInfo();
      if (!accountInfo) {
        return { success: false, error: '请先连接钱包' };
      }

      const balance = await this.nftContract.balanceOf(accountInfo.address);
      const nfts = [];

      for (let i = 0; i < balance; i++) {
        try {
          const tokenId = await this.nftContract.tokenOfOwnerByIndex(accountInfo.address, i);
          const tokenURI = await this.nftContract.tokenURI(tokenId);
          const attributes = await this.nftContract.getClothingAttributes(tokenId);
          
          nfts.push({
            tokenId: tokenId.toString(),
            tokenURI,
            attributes: {
              clothingType: attributes[0],
              rarity: attributes[1],
              level: attributes[2].toString(),
              isWearable: attributes[3]
            }
          });
        } catch (error) {
          console.warn(`获取 NFT ${i} 信息失败:`, error);
        }
      }

      return { success: true, nfts };
    } catch (error) {
      console.error('❌ 获取用户 NFT 失败:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : '获取失败' 
      };
    }
  }

  // 获取市场挂单列表
  async getMarketplaceListings(): Promise<{ success: boolean; listings?: Listing[]; error?: string }> {
    try {
      if (!this.marketplaceContract) {
        await this.initializeContracts();
      }

      if (!this.marketplaceContract) {
        return { success: false, error: '合约未初始化' };
      }

      const listings = await this.marketplaceContract.getActiveListings();
      
      return { 
        success: true, 
        listings: listings.map((listing: any) => ({
          nftContract: listing[0],
          tokenId: listing[1],
          seller: listing[2],
          price: listing[3],
          isActive: listing[4],
          listingTime: listing[5]
        }))
      };
    } catch (error) {
      console.error('❌ 获取市场挂单失败:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : '获取失败' 
      };
    }
  }

  // 购买 NFT
  async buyNFT(
    nftContract: string,
    tokenId: bigint,
    price: bigint
  ): Promise<{ success: boolean; error?: string }> {
    try {
      if (!this.marketplaceContract) {
        await this.initializeContracts();
      }

      if (!this.marketplaceContract) {
        return { success: false, error: '合约未初始化' };
      }

      console.log('💰 开始购买 NFT...');
      const tx = await this.marketplaceContract.buyNFT(nftContract, tokenId, {
        value: price
      });

      console.log('⏳ 等待交易确认...');
      await tx.wait();
      
      console.log('✅ NFT 购买成功!');
      return { success: true };
    } catch (error) {
      console.error('❌ NFT 购买失败:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : '购买失败' 
      };
    }
  }

  // 挂单出售 NFT
  async listNFT(
    nftContract: string,
    tokenId: bigint,
    price: bigint
  ): Promise<{ success: boolean; error?: string }> {
    try {
      if (!this.marketplaceContract) {
        await this.initializeContracts();
      }

      if (!this.marketplaceContract) {
        return { success: false, error: '合约未初始化' };
      }

      console.log('📋 开始挂单 NFT...');
      const tx = await this.marketplaceContract.listNFT(nftContract, tokenId, price);
      
      console.log('⏳ 等待交易确认...');
      await tx.wait();
      
      console.log('✅ NFT 挂单成功!');
      return { success: true };
    } catch (error) {
      console.error('❌ NFT 挂单失败:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : '挂单失败' 
      };
    }
  }

  // 取消挂单
  async cancelListing(
    nftContract: string,
    tokenId: bigint
  ): Promise<{ success: boolean; error?: string }> {
    try {
      if (!this.marketplaceContract) {
        await this.initializeContracts();
      }

      if (!this.marketplaceContract) {
        return { success: false, error: '合约未初始化' };
      }

      console.log('❌ 开始取消挂单...');
      const tx = await this.marketplaceContract.cancelListing(nftContract, tokenId);
      
      console.log('⏳ 等待交易确认...');
      await tx.wait();
      
      console.log('✅ 挂单取消成功!');
      return { success: true };
    } catch (error) {
      console.error('❌ 取消挂单失败:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : '取消失败' 
      };
    }
  }

  // 检查网络连接
  async checkNetwork(): Promise<{ success: boolean; network?: string; error?: string }> {
    try {
      const accountInfo = await this.getAccountInfo();
      if (!accountInfo) {
        return { success: false, error: '请先连接钱包' };
      }

      const network = await accountInfo.provider.getNetwork();
      const networkName = network.name === 'unknown' ? `Chain ID: ${network.chainId}` : network.name;
      
      return { success: true, network: networkName };
    } catch (error) {
      console.error('❌ 检查网络失败:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : '检查失败' 
      };
    }
  }

  // 切换网络
  async switchNetwork(chainId: number): Promise<{ success: boolean; error?: string }> {
    try {
      if (typeof window !== 'undefined' && window.ethereum) {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: `0x${chainId.toString(16)}` }]
        });
        
        console.log('✅ 网络切换成功');
        return { success: true };
      } else {
        return { success: false, error: 'MetaMask 未安装' };
      }
    } catch (error) {
      console.error('❌ 网络切换失败:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : '切换失败' 
      };
    }
  }
}

// 创建全局实例
export const web3Service = new Web3Service();
export default web3Service;
