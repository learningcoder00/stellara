import { expect } from "chai";
import { ethers } from "hardhat";
import { StellaraNFT } from "../typechain-types";

describe("StellaraNFT", function () {
  let stellaraNFT: StellaraNFT;
  let owner: any;
  let user1: any;
  let user2: any;

  beforeEach(async function () {
    // 获取测试账户
    [owner, user1, user2] = await ethers.getSigners();

    // 部署合约
    const StellaraNFT = await ethers.getContractFactory("StellaraNFT");
    stellaraNFT = await StellaraNFT.deploy();
  });

  describe("部署", function () {
    it("应该正确设置合约名称和符号", async function () {
      expect(await stellaraNFT.name()).to.equal("Stellara Clothing");
      expect(await stellaraNFT.symbol()).to.equal("STELLARA");
    });

    it("应该正确设置合约所有者", async function () {
      expect(await stellaraNFT.owner()).to.equal(owner.address);
    });
  });

  describe("铸造NFT", function () {
    it("所有者应该能够铸造NFT", async function () {
      const clothingType = "上衣";
      const rarity = "稀有";
      const level = 5;
      const ipfsHash = "QmTestHash123";

      await expect(
        stellaraNFT.mintClothing(user1.address, clothingType, rarity, level, ipfsHash)
      )
        .to.emit(stellaraNFT, "ClothingMinted")
        .withArgs(1, user1.address, clothingType, rarity);

      expect(await stellaraNFT.ownerOf(1)).to.equal(user1.address);
      expect(await stellaraNFT.tokenURI(1)).to.equal(ipfsHash);
    });

    it("非所有者不能铸造NFT", async function () {
      const clothingType = "裤子";
      const rarity = "普通";
      const level = 1;
      const ipfsHash = "QmTestHash456";

      await expect(
        stellaraNFT.connect(user1).mintClothing(user2.address, clothingType, rarity, level, ipfsHash)
      ).to.be.revertedWithCustomError(stellaraNFT, "OwnableUnauthorizedAccount");
    });

    it("应该正确存储服装属性", async function () {
      const clothingType = "鞋子";
      const rarity = "史诗";
      const level = 10;
      const ipfsHash = "QmTestHash789";

      await stellaraNFT.mintClothing(user1.address, clothingType, rarity, level, ipfsHash);

      const attributes = await stellaraNFT.getClothingAttributes(1);
      expect(attributes.clothingType).to.equal(clothingType);
      expect(attributes.rarity).to.equal(rarity);
      expect(attributes.level).to.equal(level);
      expect(attributes.isWearable).to.be.true;
      expect(attributes.ipfsHash).to.equal(ipfsHash);
    });
  });

  describe("更新元数据", function () {
    beforeEach(async function () {
      // 先铸造一个NFT
      await stellaraNFT.mintClothing(
        user1.address,
        "上衣",
        "普通",
        1,
        "QmOriginalHash"
      );
    });

    it("NFT所有者应该能够更新元数据", async function () {
      const newIpfsHash = "QmNewHash123";

      await expect(
        stellaraNFT.connect(user1).updateClothingMetadata(1, newIpfsHash)
      )
        .to.emit(stellaraNFT, "ClothingUpdated")
        .withArgs(1, newIpfsHash);

      expect(await stellaraNFT.tokenURI(1)).to.equal(newIpfsHash);
      
      const attributes = await stellaraNFT.getClothingAttributes(1);
      expect(attributes.ipfsHash).to.equal(newIpfsHash);
    });

    it("合约所有者应该能够更新任何NFT的元数据", async function () {
      const newIpfsHash = "QmOwnerHash456";

      await expect(
        stellaraNFT.updateClothingMetadata(1, newIpfsHash)
      )
        .to.emit(stellaraNFT, "ClothingUpdated")
        .withArgs(1, newIpfsHash);

      expect(await stellaraNFT.tokenURI(1)).to.equal(newIpfsHash);
    });

    it("非所有者不能更新元数据", async function () {
      const newIpfsHash = "QmUnauthorizedHash";

      await expect(
        stellaraNFT.connect(user2).updateClothingMetadata(1, newIpfsHash)
      ).to.be.revertedWith("Not authorized");
    });
  });

  describe("查询功能", function () {
    beforeEach(async function () {
      // 铸造多个NFT
      await stellaraNFT.mintClothing(user1.address, "上衣", "普通", 1, "QmHash1");
      await stellaraNFT.mintClothing(user1.address, "裤子", "稀有", 3, "QmHash2");
      await stellaraNFT.mintClothing(user2.address, "鞋子", "史诗", 5, "QmHash3");
    });

    it("应该正确检查NFT是否可穿戴", async function () {
      expect(await stellaraNFT.isWearable(1)).to.be.true;
      expect(await stellaraNFT.isWearable(2)).to.be.true;
      expect(await stellaraNFT.isWearable(3)).to.be.true;
    });

    it("应该正确获取服装属性", async function () {
      const attributes1 = await stellaraNFT.getClothingAttributes(1);
      expect(attributes1.clothingType).to.equal("上衣");
      expect(attributes1.rarity).to.equal("普通");
      expect(attributes1.level).to.equal(1);

      const attributes2 = await stellaraNFT.getClothingAttributes(2);
      expect(attributes2.clothingType).to.equal("裤子");
      expect(attributes2.rarity).to.equal("稀有");
      expect(attributes2.level).to.equal(3);
    });

    it("查询不存在的NFT应该失败", async function () {
      await expect(stellaraNFT.getClothingAttributes(999)).to.be.revertedWith("NFT does not exist");
      await expect(stellaraNFT.isWearable(999)).to.be.revertedWith("NFT does not exist");
    });
  });

  describe("ERC721标准功能", function () {
    beforeEach(async function () {
      await stellaraNFT.mintClothing(user1.address, "上衣", "普通", 1, "QmHash1");
    });

    it("应该支持ERC721接口", async function () {
      const erc721InterfaceId = "0x80ac58cd"; // ERC721接口ID
      expect(await stellaraNFT.supportsInterface(erc721InterfaceId)).to.be.true;
    });

    it("应该支持ERC721URIStorage接口", async function () {
      const uriStorageInterfaceId = "0x5b5e139f"; // ERC721Metadata接口ID
      expect(await stellaraNFT.supportsInterface(uriStorageInterfaceId)).to.be.true;
    });
  });
});
