// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import "../core/StellaraNFT.sol";

/**
 * @title StellaraMarketplace
 * @dev 虚拟服装NFT交易市场合约
 */
contract StellaraMarketplace is ReentrancyGuard, Ownable, ERC721Holder {
    // 市场费用（2.5%）
    uint256 public constant MARKETPLACE_FEE = 250; // 2.5% = 250/10000
    uint256 public constant FEE_DENOMINATOR = 10000;
    
    // 支持的NFT合约
    mapping(address => bool) public supportedNFTs;
    
    // 挂单结构
    struct Listing {
        address nftContract;
        uint256 tokenId;
        address seller;
        uint256 price;
        bool isActive;
        uint256 listingTime;
    }
    
    // 挂单ID => 挂单信息
    mapping(uint256 => Listing) public listings;
    uint256 public nextListingId;
    
    // 事件
    event NFTListed(uint256 indexed listingId, address indexed nftContract, uint256 indexed tokenId, address seller, uint256 price);
    event NFTSold(uint256 indexed listingId, address indexed nftContract, uint256 indexed tokenId, address seller, address buyer, uint256 price);
    event ListingCancelled(uint256 indexed listingId, address indexed nftContract, uint256 indexed tokenId);
    event NFTContractSupported(address indexed nftContract, bool supported);
    
    constructor() Ownable(msg.sender) {}
    
    /**
     * @dev 添加或移除支持的NFT合约
     */
    function setNFTContractSupport(address nftContract, bool supported) public onlyOwner {
        supportedNFTs[nftContract] = supported;
        emit NFTContractSupported(nftContract, supported);
    }
    
    /**
     * @dev 挂单NFT
     * @param nftContract NFT合约地址
     * @param tokenId NFT ID
     * @param price 价格（以wei为单位）
     */
    function listNFT(address nftContract, uint256 tokenId, uint256 price) public returns (uint256) {
        require(supportedNFTs[nftContract], "NFT contract not supported");
        require(price > 0, "Price must be greater than 0");
        
        IERC721 nft = IERC721(nftContract);
        require(nft.ownerOf(tokenId) == msg.sender, "Not the owner of this NFT");
        require(nft.isApprovedForAll(msg.sender, address(this)), "NFT not approved for marketplace");
        
        uint256 listingId = nextListingId++;
        
        listings[listingId] = Listing({
            nftContract: nftContract,
            tokenId: tokenId,
            seller: msg.sender,
            price: price,
            isActive: true,
            listingTime: block.timestamp
        });
        
        // 转移NFT到市场合约
        nft.safeTransferFrom(msg.sender, address(this), tokenId);
        
        // 确保市场合约有权限转移这个NFT
        nft.approve(address(this), tokenId);
        
        emit NFTListed(listingId, nftContract, tokenId, msg.sender, price);
        return listingId;
    }
    
    /**
     * @dev 购买NFT
     * @param listingId 挂单ID
     */
    function buyNFT(uint256 listingId) public payable nonReentrant {
        Listing storage listing = listings[listingId];
        require(listing.isActive, "Listing is not active");
        require(msg.value == listing.price, "Incorrect price");
        require(msg.sender != listing.seller, "Seller cannot buy their own NFT");
        
        // 计算费用
        uint256 marketplaceFeeAmount = (listing.price * MARKETPLACE_FEE) / FEE_DENOMINATOR;
        uint256 sellerAmount = listing.price - marketplaceFeeAmount;
        
        // 转移NFT给买家
        IERC721 nft = IERC721(listing.nftContract);
        nft.safeTransferFrom(address(this), msg.sender, listing.tokenId);
        
        // 转移资金
        (bool success1, ) = payable(listing.seller).call{value: sellerAmount}("");
        require(success1, "Failed to transfer to seller");
        
        (bool success2, ) = payable(owner()).call{value: marketplaceFeeAmount}("");
        require(success2, "Failed to transfer to owner");
        
        // 更新挂单状态
        listing.isActive = false;
        
        emit NFTSold(listingId, listing.nftContract, listing.tokenId, listing.seller, msg.sender, listing.price);
    }
    
    /**
     * @dev 取消挂单
     * @param listingId 挂单ID
     */
    function cancelListing(uint256 listingId) public {
        Listing storage listing = listings[listingId];
        require(listing.isActive, "Listing is not active");
        require(listing.seller == msg.sender, "Only seller can cancel listing");
        
        // 返还NFT给卖家
        IERC721 nft = IERC721(listing.nftContract);
        nft.safeTransferFrom(address(this), listing.seller, listing.tokenId);
        
        listing.isActive = false;
        
        emit ListingCancelled(listingId, listing.nftContract, listing.tokenId);
    }
    
    /**
     * @dev 获取挂单信息
     */
    function getListing(uint256 listingId) public view returns (Listing memory) {
        return listings[listingId];
    }
    
    /**
     * @dev 获取活跃挂单数量
     */
    function getActiveListingsCount() public view returns (uint256) {
        uint256 count = 0;
        for (uint256 i = 0; i < nextListingId; i++) {
            if (listings[i].isActive) {
                count++;
            }
        }
        return count;
    }
    
    /**
     * @dev 紧急提取NFT（仅合约所有者）
     */
    function emergencyWithdrawNFT(address nftContract, uint256 tokenId, address to) public onlyOwner {
        IERC721 nft = IERC721(nftContract);
        nft.safeTransferFrom(address(this), to, tokenId);
    }
}
