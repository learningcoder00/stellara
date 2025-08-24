// 智能合约配置文件
import { PROJECT_CONFIG } from './project';

// 合约 ABI 定义
export const NFT_ABI = [
  // ERC721 标准函数
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address owner) view returns (uint256)",
  "function ownerOf(uint256 tokenId) view returns (address)",
  "function tokenURI(uint256 tokenId) view returns (string)",
  "function approve(address to, uint256 tokenId)",
  "function getApproved(uint256 tokenId) view returns (address)",
  "function setApprovalForAll(address operator, bool approved)",
  "function isApprovedForAll(address owner, address operator) view returns (bool)",
  "function transferFrom(address from, address to, uint256 tokenId)",
  "function safeTransferFrom(address from, address to, uint256 tokenId)",
  
  // StellaraNFT 特有函数
  "function mintClothing(address to, string memory clothingType, string memory rarity, uint256 level, string memory metadataURI) returns (uint256)",
  "function updateClothingMetadata(uint256 tokenId, string memory metadataURI)",
  "function getClothingAttributes(uint256 tokenId) view returns (string memory clothingType, string memory rarity, uint256 level, bool isWearable)",
  "function isWearable(uint256 tokenId) view returns (bool)",
  
  // 事件
  "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)",
  "event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId)",
  "event ApprovalForAll(address indexed owner, address indexed operator, bool approved)",
  "event ClothingMinted(uint256 indexed tokenId, address indexed owner, string clothingType, string rarity, uint256 level)",
  "event MetadataUpdated(uint256 indexed tokenId, string metadataURI)"
];

export const MARKETPLACE_ABI = [
  // 市场合约函数
  "function listNFT(address nftContract, uint256 tokenId, uint256 price)",
  "function buyNFT(address nftContract, uint256 tokenId)",
  "function cancelListing(address nftContract, uint256 tokenId)",
  "function getListing(address nftContract, uint256 tokenId) view returns (address seller, uint256 price, bool isActive, uint256 listingTime)",
  "function getAllListings() view returns (tuple(address nftContract, uint256 tokenId, address seller, uint256 price, bool isActive, uint256 listingTime)[])",
  "function getActiveListings() view returns (tuple(address nftContract, uint256 tokenId, address seller, uint256 price, bool isActive, uint256 listingTime)[])",
  "function getListingsBySeller(address seller) view returns (tuple(address nftContract, uint256 tokenId, address seller, uint256 price, bool isActive, uint256 listingTime)[])",
  "function getListingsByNFT(address nftContract) view returns (tuple(address nftContract, uint256 tokenId, address seller, uint256 price, bool isActive, uint256 listingTime)[])",
  
  // 管理函数
  "function setMarketplaceFee(uint256 newFee)",
  "function getMarketplaceFee() view returns (uint256)",
  "function addSupportedNFT(address nftContract)",
  "function removeSupportedNFT(address nftContract)",
  "function isSupportedNFT(address nftContract) view returns (bool)",
  
  // 事件
  "event NFTListed(address indexed nftContract, uint256 indexed tokenId, address indexed seller, uint256 price, uint256 listingTime)",
  "event NFTSold(address indexed nftContract, uint256 indexed tokenId, address indexed seller, address buyer, uint256 price, uint256 saleTime)",
  "event ListingCancelled(address indexed nftContract, uint256 indexed tokenId, address indexed seller, uint256 cancelTime)",
  "event MarketplaceFeeUpdated(uint256 oldFee, uint256 newFee)"
];

// 合约地址配置
export const CONTRACT_ADDRESSES = {
  // 测试网络地址 (部署后更新)
  sepolia: {
    nft: process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000',
    marketplace: process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000'
  },
  mumbai: {
    nft: process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000',
    marketplace: process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000'
  },
  // 主网地址 (部署后更新)
  ethereum: {
    nft: process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000',
    marketplace: process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000'
  },
  polygon: {
    nft: process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000',
    marketplace: process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000'
  }
};

// 获取当前网络的合约地址
export const getContractAddresses = (networkId?: number) => {
  const network = networkId ? 
    Object.values(PROJECT_CONFIG.networks).find(n => n.id === networkId)?.name?.toLowerCase() :
    PROJECT_CONFIG.defaultNetwork;
  
  return CONTRACT_ADDRESSES[network as keyof typeof CONTRACT_ADDRESSES] || CONTRACT_ADDRESSES.sepolia;
};

// 合约配置验证
export const validateContractConfig = () => {
  const addresses = getContractAddresses();
  const isValid = addresses.nft !== '0x0000000000000000000000000000000000000000' && 
                  addresses.marketplace !== '0x0000000000000000000000000000000000000000';
  
  if (!isValid) {
    console.warn('⚠️ 智能合约地址未配置，请先部署合约并更新环境变量');
  }
  
  return isValid;
};

export default {
  NFT_ABI,
  MARKETPLACE_ABI,
  CONTRACT_ADDRESSES,
  getContractAddresses,
  validateContractConfig
};
