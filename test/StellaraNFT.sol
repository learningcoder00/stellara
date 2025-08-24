// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../contracts/core/StellaraNFT.sol";

contract StellaraNFTTest is Test {
    StellaraNFT public stellaraNFT;
    address public owner;
    address public user1;
    address public user2;

    function setUp() public {
        owner = address(this);
        user1 = address(0x1);
        user2 = address(0x2);
        
        stellaraNFT = new StellaraNFT();
    }

    function test_Constructor() public {
        assertEq(stellaraNFT.name(), "Stellara Clothing");
        assertEq(stellaraNFT.symbol(), "STELLARA");
        assertEq(stellaraNFT.owner(), owner);
    }

    function test_MintClothing() public {
        string memory clothingType = "Shirt";
        string memory rarity = "Rare";
        uint256 level = 5;
        string memory ipfsHash = "QmTestHash123";

        uint256 tokenId = stellaraNFT.mintClothing(user1, clothingType, rarity, level, ipfsHash);
        
        assertEq(tokenId, 1);
        assertEq(stellaraNFT.ownerOf(tokenId), user1);
        assertEq(stellaraNFT.tokenURI(tokenId), ipfsHash);
    }

    function test_OnlyOwnerCanMint() public {
        vm.prank(user1);
        vm.expectRevert();
        stellaraNFT.mintClothing(user2, "Pants", "Common", 1, "QmHash");
    }

    function test_ClothingAttributes() public {
        string memory clothingType = "Shoes";
        string memory rarity = "Epic";
        uint256 level = 10;
        string memory ipfsHash = "QmTestHash789";

        uint256 tokenId = stellaraNFT.mintClothing(user1, clothingType, rarity, level, ipfsHash);

        StellaraNFT.ClothingAttributes memory attributes = stellaraNFT.getClothingAttributes(tokenId);
        assertEq(attributes.clothingType, clothingType);
        assertEq(attributes.rarity, rarity);
        assertEq(attributes.level, level);
        assertTrue(attributes.isWearable);
        assertEq(attributes.ipfsHash, ipfsHash);
    }

    function test_UpdateMetadata() public {
        uint256 tokenId = stellaraNFT.mintClothing(user1, "Shirt", "Common", 1, "QmOriginalHash");
        
        string memory newIpfsHash = "QmNewHash123";
        vm.prank(user1);
        stellaraNFT.updateClothingMetadata(tokenId, newIpfsHash);
        
        assertEq(stellaraNFT.tokenURI(tokenId), newIpfsHash);
        
        StellaraNFT.ClothingAttributes memory attributes = stellaraNFT.getClothingAttributes(tokenId);
        assertEq(attributes.ipfsHash, newIpfsHash);
    }

    function test_OnlyOwnerOrNFTOwnerCanUpdateMetadata() public {
        uint256 tokenId = stellaraNFT.mintClothing(user1, "Shirt", "Common", 1, "QmHash");
        
        vm.prank(user2);
        vm.expectRevert("Not authorized");
        stellaraNFT.updateClothingMetadata(tokenId, "QmUnauthorizedHash");
    }

    function test_IsWearable() public {
        uint256 tokenId = stellaraNFT.mintClothing(user1, "Pants", "Rare", 3, "QmHash");
        
        assertTrue(stellaraNFT.isWearable(tokenId));
    }

    function test_GetClothingAttributes() public {
        uint256 tokenId = stellaraNFT.mintClothing(user1, "Shirt", "Common", 1, "QmHash1");
        
        StellaraNFT.ClothingAttributes memory attributes = stellaraNFT.getClothingAttributes(tokenId);
        assertEq(attributes.clothingType, "Shirt");
        assertEq(attributes.rarity, "Common");
        assertEq(attributes.level, 1);
    }

    function test_QueryNonExistentNFT() public {
        vm.expectRevert("NFT does not exist");
        stellaraNFT.getClothingAttributes(999);
        
        vm.expectRevert("NFT does not exist");
        stellaraNFT.isWearable(999);
    }
}
