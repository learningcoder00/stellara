import { ethers } from "hardhat";
import { PROJECT_CONFIG } from "../frontend/src/config/project";

async function main() {
  console.log("🚀 开始部署 Stellara 智能合约...");

  // 获取部署账户
  const [deployer] = await ethers.getSigners();
  console.log("📝 部署账户:", deployer.address);
  console.log("💰 账户余额:", ethers.formatEther(await deployer.provider.getBalance(deployer.address)), "ETH");

  // 部署 StellaraNFT 合约
  console.log("\n🎨 部署 StellaraNFT 合约...");
  const StellaraNFT = await ethers.getContractFactory("StellaraNFT");
  const nftContract = await StellaraNFT.deploy();
  await nftContract.waitForDeployment();
  
  const nftAddress = await nftContract.getAddress();
  console.log("✅ StellaraNFT 部署成功:", nftAddress);

  // 部署 StellaraMarketplace 合约
  console.log("\n🏪 部署 StellaraMarketplace 合约...");
  const StellaraMarketplace = await ethers.getContractFactory("StellaraMarketplace");
  const marketplaceContract = await StellaraMarketplace.deploy(nftAddress);
  await marketplaceContract.waitForDeployment();
  
  const marketplaceAddress = await marketplaceContract.getAddress();
  console.log("✅ StellaraMarketplace 部署成功:", marketplaceAddress);

  // 设置市场合约为 NFT 合约的授权操作者
  console.log("\n🔐 设置市场合约权限...");
  const setApprovalTx = await nftContract.setApprovalForAll(marketplaceAddress, true);
  await setApprovalTx.wait();
  console.log("✅ 市场合约权限设置成功");

  // 验证合约
  console.log("\n🔍 验证合约...");
  const nftName = await nftContract.name();
  const nftSymbol = await nftContract.symbol();
  const marketplaceFee = await marketplaceContract.MARKETPLACE_FEE();
  
  console.log("📋 合约信息:");
  console.log("  NFT 名称:", nftName);
  console.log("  NFT 符号:", nftSymbol);
  console.log("  市场费率:", ethers.formatUnits(marketplaceFee, 2), "%");

  // 输出部署结果
  console.log("\n🎉 部署完成！");
  console.log("=".repeat(50));
  console.log("📋 部署结果:");
  console.log("  StellaraNFT:", nftAddress);
  console.log("  StellaraMarketplace:", marketplaceAddress);
  console.log("  网络:", (await ethers.provider.getNetwork()).name);
  console.log("=".repeat(50));

  // 生成前端配置
  console.log("\n📝 生成前端配置...");
  const frontendConfig = `
// 自动生成的合约配置 - 部署时间: ${new Date().toISOString()}
export const DEPLOYED_CONTRACTS = {
  nft: "${nftAddress}",
  marketplace: "${marketplaceAddress}",
  network: "${(await ethers.provider.getNetwork()).name}",
  deployer: "${deployer.address}"
};
  `;
  
  console.log("✅ 前端配置已生成，请更新以下文件:");
  console.log("  frontend/src/config/contracts.ts");
  console.log("  frontend/.env.local");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ 部署失败:", error);
    process.exit(1);
  });
