// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title StellaraNFT
 * @dev 虚拟服装NFT合约，支持元数据存储和IPFS集成
 */
contract StellaraNFT is ERC721, ERC721URIStorage, Ownable {
    uint256 private _nextTokenId = 1;
    
    // NFT属性结构
    struct ClothingAttributes {
        string clothingType;    // 服装类型：上衣、裤子、鞋子等
        string rarity;          // 稀有度：普通、稀有、史诗、传说
        uint256 level;          // 等级
        bool isWearable;        // 是否可穿戴
        string ipfsHash;        // IPFS元数据哈希
    }
    
    // 映射：tokenId => 属性
    mapping(uint256 => ClothingAttributes) public clothingAttributes;
    
    // 事件
    event ClothingMinted(uint256 indexed tokenId, address indexed owner, string clothingType, string rarity);
    event ClothingUpdated(uint256 indexed tokenId, string newIpfsHash);
    
    constructor() ERC721("Stellara Clothing", "STELLARA") Ownable(msg.sender) {}
    
    /**
     * @dev 铸造新的虚拟服装NFT
     * @param to 接收者地址
     * @param clothingType 服装类型
     * @param rarity 稀有度
     * @param level 等级
     * @param ipfsHash IPFS元数据哈希
     */
    function mintClothing(
        address to,
        string memory clothingType,
        string memory rarity,
        uint256 level,
        string memory ipfsHash
    ) public onlyOwner returns (uint256) {
        uint256 newTokenId = _nextTokenId++;
        
        _mint(to, newTokenId);
        _setTokenURI(newTokenId, ipfsHash);
        
        clothingAttributes[newTokenId] = ClothingAttributes({
            clothingType: clothingType,
            rarity: rarity,
            level: level,
            isWearable: true,
            ipfsHash: ipfsHash
        });
        
        emit ClothingMinted(newTokenId, to, clothingType, rarity);
        return newTokenId;
    }
    
    /**
     * @dev 更新NFT的IPFS元数据
     * @param tokenId NFT ID
     * @param newIpfsHash 新的IPFS哈希
     */
    function updateClothingMetadata(uint256 tokenId, string memory newIpfsHash) public {
        require(_ownerOf(tokenId) != address(0), "NFT does not exist");
        require(ownerOf(tokenId) == msg.sender || owner() == msg.sender, "Not authorized");
        
        clothingAttributes[tokenId].ipfsHash = newIpfsHash;
        _setTokenURI(tokenId, newIpfsHash);
        
        emit ClothingUpdated(tokenId, newIpfsHash);
    }
    
    /**
     * @dev 获取服装属性
     * @param tokenId NFT ID
     */
    function getClothingAttributes(uint256 tokenId) public view returns (ClothingAttributes memory) {
        require(_ownerOf(tokenId) != address(0), "NFT does not exist");
        return clothingAttributes[tokenId];
    }
    
    /**
     * @dev 检查NFT是否可穿戴
     * @param tokenId NFT ID
     */
    function isWearable(uint256 tokenId) public view returns (bool) {
        require(_ownerOf(tokenId) != address(0), "NFT does not exist");
        return clothingAttributes[tokenId].isWearable;
    }
    
    // 重写必要的函数
    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }
    
    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
