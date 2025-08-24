// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../contracts/marketplace/StellaraMarketplace.sol";
import "../contracts/core/StellaraNFT.sol";

contract StellaraMarketplaceTest is Test {
    StellaraMarketplace public marketplace;
    StellaraNFT public nftContract;
    address public owner;
    address public user1;
    address public user2;
    address public user3;
    
    // 允许测试合约接收 ETH
    receive() external payable {}

    function setUp() public {
        owner = address(0x1234);
        user1 = address(0x1);
        user2 = address(0x2);
        user3 = address(0x3);
        
        marketplace = new StellaraMarketplace();
        nftContract = new StellaraNFT();
        
        // 配置市场支持NFT合约
        marketplace.setNFTContractSupport(address(nftContract), true);
        
        // 给用户分配ETH余额
        vm.deal(user1, 10 ether);
        vm.deal(user2, 10 ether);
        vm.deal(user3, 10 ether);
        
        // 给owner分配ETH余额
        vm.deal(owner, 100 ether);
        
        // 给用户铸造一些NFT
        nftContract.mintClothing(user1, "Shirt", "Rare", 5, "QmHash1");
        nftContract.mintClothing(user2, "Pants", "Epic", 8, "QmHash2");
    }

    function test_Constructor() public {
        assertEq(marketplace.owner(), address(this));
    }

    function test_SetNFTContractSupport() public {
        address newNFTContract = address(0x123);
        marketplace.setNFTContractSupport(newNFTContract, true);
        assertTrue(marketplace.supportedNFTs(newNFTContract));
        
        marketplace.setNFTContractSupport(newNFTContract, false);
        assertFalse(marketplace.supportedNFTs(newNFTContract));
    }

    function test_ListNFT() public {
        uint256 tokenId = 1;
        uint256 price = 1 ether;
        
        vm.startPrank(user1);
        nftContract.setApprovalForAll(address(marketplace), true);
        uint256 listingId = marketplace.listNFT(address(nftContract), tokenId, price);
        vm.stopPrank();
        
        assertEq(listingId, 0);
        assertEq(marketplace.getListing(listingId).price, price);
        assertTrue(marketplace.getListing(listingId).isActive);
        assertEq(marketplace.getListing(listingId).seller, user1);
    }

    function test_ListNFTNotSupported() public {
        address unsupportedContract = address(0x999);
        vm.startPrank(user1);
        vm.expectRevert("NFT contract not supported");
        marketplace.listNFT(unsupportedContract, 1, 1 ether);
        vm.stopPrank();
    }

    function test_ListNFTNotOwner() public {
        vm.startPrank(user2);
        vm.expectRevert("Not the owner of this NFT");
        marketplace.listNFT(address(nftContract), 1, 1 ether);
        vm.stopPrank();
    }

    function test_BuyNFT() public {
        uint256 tokenId = 1;
        uint256 price = 1 ether;
        
        // 先挂单
        vm.startPrank(user1);
        nftContract.setApprovalForAll(address(marketplace), true);
        uint256 listingId = marketplace.listNFT(address(nftContract), tokenId, price);
        vm.stopPrank();
        
        // 购买NFT
        uint256 buyerBalanceBefore = user2.balance;
        uint256 sellerBalanceBefore = user1.balance;
        uint256 ownerBalanceBefore = address(this).balance;
        
        vm.prank(user2);
        marketplace.buyNFT{value: price}(listingId);
        
        // 验证NFT转移
        assertEq(nftContract.ownerOf(tokenId), user2);
        
        // 验证挂单状态
        assertFalse(marketplace.getListing(listingId).isActive);
        
        // 验证资金转移
        uint256 marketplaceFee = (price * 250) / 10000; // 2.5%
        uint256 sellerAmount = price - marketplaceFee;
        
        assertEq(user1.balance, sellerBalanceBefore + sellerAmount);
        assertEq(address(this).balance, ownerBalanceBefore + marketplaceFee);
    }

    function test_BuyNFTIncorrectPrice() public {
        uint256 tokenId = 1;
        uint256 price = 1 ether;
        
        // 先挂单
        vm.startPrank(user1);
        nftContract.setApprovalForAll(address(marketplace), true);
        uint256 listingId = marketplace.listNFT(address(nftContract), tokenId, price);
        vm.stopPrank();
        
        // 尝试用错误价格购买
        vm.prank(user2);
        vm.expectRevert("Incorrect price");
        marketplace.buyNFT{value: 0.5 ether}(listingId);
    }

    function test_CancelListing() public {
        uint256 tokenId = 1;
        uint256 price = 1 ether;
        
        // 先挂单
        vm.startPrank(user1);
        nftContract.setApprovalForAll(address(marketplace), true);
        uint256 listingId = marketplace.listNFT(address(nftContract), tokenId, price);
        vm.stopPrank();
        
        // 取消挂单
        vm.prank(user1);
        marketplace.cancelListing(listingId);
        
        // 验证NFT返还
        assertEq(nftContract.ownerOf(tokenId), user1);
        
        // 验证挂单状态
        assertFalse(marketplace.getListing(listingId).isActive);
    }

    function test_CancelListingNotSeller() public {
        uint256 tokenId = 1;
        uint256 price = 1 ether;
        
        // 先挂单
        vm.startPrank(user1);
        nftContract.setApprovalForAll(address(marketplace), true);
        uint256 listingId = marketplace.listNFT(address(nftContract), tokenId, price);
        vm.stopPrank();
        
        // 非卖家尝试取消
        vm.prank(user2);
        vm.expectRevert("Only seller can cancel listing");
        marketplace.cancelListing(listingId);
    }

    function test_GetActiveListingsCount() public {
        assertEq(marketplace.getActiveListingsCount(), 0);
        
        // 挂单一个NFT
        vm.startPrank(user1);
        nftContract.setApprovalForAll(address(marketplace), true);
        marketplace.listNFT(address(nftContract), 1, 1 ether);
        vm.stopPrank();
        
        assertEq(marketplace.getActiveListingsCount(), 1);
        
        // 再挂单一个
        vm.startPrank(user2);
        nftContract.setApprovalForAll(address(marketplace), true);
        marketplace.listNFT(address(nftContract), 2, 2 ether);
        vm.stopPrank();
        
        assertEq(marketplace.getActiveListingsCount(), 2);
    }
}
