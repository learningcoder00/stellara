#!/bin/bash

# Stellara 项目设置脚本
echo "🚀 开始设置 Stellara 项目..."

# 检查 Node.js 版本
echo "📋 检查 Node.js 版本..."
node_version=$(node --version)
echo "✅ Node.js 版本: $node_version"

# 检查 npm 版本
echo "📋 检查 npm 版本..."
npm_version=$(npm --version)
echo "✅ npm 版本: $npm_version"

# 安装依赖
echo "📦 安装项目依赖..."
npm install

# 安装前端依赖
echo "📦 安装前端依赖..."
cd frontend
npm install
cd ..

# 编译智能合约
echo "🔨 编译智能合约..."
npx hardhat compile

# 创建环境变量文件
echo "📝 创建环境变量文件..."
if [ ! -f "frontend/.env.local" ]; then
    cp frontend/env.example frontend/.env.local
    echo "✅ 环境变量文件已创建: frontend/.env.local"
    echo "⚠️  请编辑此文件并填入真实的 API 密钥和合约地址"
else
    echo "✅ 环境变量文件已存在"
fi

# 创建 IPFS 目录
echo "📁 创建 IPFS 目录..."
mkdir -p ipfs/uploads
mkdir -p ipfs/metadata
echo "✅ IPFS 目录已创建"

# 创建文档目录
echo "📚 创建文档目录..."
mkdir -p docs/api
mkdir -p docs/contracts
mkdir -p docs/deployment
echo "✅ 文档目录已创建"

# 检查 Hardhat 配置
echo "🔧 检查 Hardhat 配置..."
if [ -f "hardhat.config.ts" ]; then
    echo "✅ Hardhat 配置文件存在"
else
    echo "❌ Hardhat 配置文件缺失"
fi

# 检查合约文件
echo "📄 检查智能合约..."
if [ -f "contracts/core/StellaraNFT.sol" ] && [ -f "contracts/marketplace/StellaraMarketplace.sol" ]; then
    echo "✅ 智能合约文件存在"
else
    echo "❌ 智能合约文件缺失"
fi

# 检查前端配置
echo "🌐 检查前端配置..."
if [ -f "frontend/next.config.ts" ] && [ -f "frontend/tailwind.config.ts" ]; then
    echo "✅ 前端配置文件存在"
else
    echo "❌ 前端配置文件缺失"
fi

# 运行测试
echo "🧪 运行智能合约测试..."
npx hardhat test

# 显示项目状态
echo ""
echo "🎉 Stellara 项目设置完成！"
echo ""
echo "📋 下一步操作："
echo "1. 编辑 frontend/.env.local 文件，配置 API 密钥"
echo "2. 部署智能合约到测试网络"
echo "3. 更新合约地址配置"
echo "4. 启动前端开发服务器"
echo ""
echo "🚀 启动命令："
echo "  npm run dev          # 启动前端开发服务器"
echo "  npm run frontend:dev # 仅启动前端"
echo "  npx hardhat node     # 启动本地 Hardhat 节点"
echo "  npx hardhat test     # 运行测试"
echo "  npx hardhat deploy   # 部署合约"
echo ""
echo "📚 项目文档："
echo "  - 智能合约: contracts/"
echo "  - 前端代码: frontend/src/"
echo "  - 部署脚本: scripts/"
echo "  - 项目配置: docs/"
echo ""
echo "🔗 有用的链接："
echo "  - Pinata IPFS: https://pinata.cloud/"
echo "  - Sepolia Faucet: https://sepoliafaucet.com/"
echo "  - Mumbai Faucet: https://faucet.polygon.technology/"
echo ""
echo "✅ 设置完成！开始构建你的 NFT 平台吧！"
