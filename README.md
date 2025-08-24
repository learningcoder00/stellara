# 🌟 Stellara - 去中心化虚拟服装 NFT 交易平台

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-15.5.0-black)](https://nextjs.org/)
[![Solidity](https://img.shields.io/badge/Solidity-0.8.24-363636)](https://soliditylang.org/)

Stellara 是一个基于区块链技术的去中心化虚拟服装 NFT 交易平台，让用户可以创建、交易和收集独特的虚拟服装 NFT。

## ✨ 主要功能

- 🎨 **NFT 创建** - 上传图片并创建独特的虚拟服装 NFT
- 🏪 **去中心化市场** - 安全透明的 NFT 交易平台
- 💰 **多链支持** - 支持 Ethereum、Polygon、Sepolia、Mumbai 等网络
- 🔐 **钱包集成** - 支持 MetaMask 等多种钱包连接
- 🌐 **IPFS 存储** - 去中心化存储 NFT 图片和元数据
- 📱 **响应式设计** - 支持桌面和移动设备

## 🏗️ 技术架构

### 前端技术栈
- **Next.js 15.5.0** - React 全栈框架
- **TypeScript** - 类型安全的 JavaScript
- **Tailwind CSS** - 实用优先的 CSS 框架
- **Wagmi** - React Hooks for Ethereum

### 智能合约
- **Solidity 0.8.24** - 智能合约开发语言
- **Hardhat** - 以太坊开发环境
- **OpenZeppelin** - 安全的智能合约库

### 去中心化存储
- **IPFS** - 星际文件系统
- **Pinata** - IPFS 固定服务

## 🚀 快速开始

### 环境要求
- Node.js 18+ 
- npm 或 yarn
- Git

### 安装步骤

1. **克隆项目**
```bash
git clone https://github.com/your-username/stellara.git
cd stellara
```

2. **安装依赖**
```bash
# 安装根目录依赖
npm install

# 安装前端依赖
cd frontend
npm install
cd ..
```

3. **配置环境变量**
```bash
# 复制环境变量模板
cp frontend/env.example frontend/.env.local

# 编辑 .env.local 文件，填入你的配置
```

4. **启动开发服务器**
```bash
npm run dev
```

5. **访问应用**
打开浏览器访问 [http://localhost:3000](http://localhost:3000)

## 📁 项目结构

```
stellara/
├── contracts/           # 智能合约
│   ├── core/           # 核心 NFT 合约
│   └── marketplace/    # 市场合约
├── frontend/           # 前端应用
│   ├── src/
│   │   ├── app/        # 页面路由
│   │   ├── components/ # React 组件
│   │   ├── config/     # 配置文件
│   │   └── services/   # 服务类
│   └── public/         # 静态资源
├── scripts/            # 部署和设置脚本
├── test/              # 智能合约测试
└── docs/              # 项目文档
```

## 🔧 开发命令

```bash
# 启动前端开发服务器
npm run dev

# 构建前端应用
npm run frontend:build

# 启动前端生产服务器
npm run frontend:start

# 编译智能合约
npm run compile

# 部署智能合约
npm run deploy:contracts

# 运行测试
npm run test

# 代码检查
npm run lint
```

## 🌐 网络配置

### 支持的网络
- **Ethereum Mainnet** - 主网
- **Sepolia Testnet** - 测试网
- **Polygon Mainnet** - Polygon 主网
- **Mumbai Testnet** - Polygon 测试网

### 环境变量配置
```bash
# 网络配置
NEXT_PUBLIC_DEFAULT_NETWORK=sepolia
NEXT_PUBLIC_RPC_URL=https://sepolia.infura.io/v3/YOUR_PROJECT_ID

# IPFS 配置
NEXT_PUBLIC_PINATA_API_KEY=your_pinata_api_key
NEXT_PUBLIC_PINATA_SECRET_KEY=your_pinata_secret_key

# 智能合约地址
NEXT_PUBLIC_NFT_CONTRACT_ADDRESS=0x...
NEXT_PUBLIC_MARKETPLACE_CONTRACT_ADDRESS=0x...
```

## 📖 使用指南

### 创建 NFT
1. 连接钱包
2. 上传图片文件
3. 填写 NFT 信息（名称、描述、属性等）
4. 确认创建并支付 Gas 费用

### 交易 NFT
1. 浏览市场中的 NFT
2. 选择心仪的 NFT
3. 确认价格和交易详情
4. 完成购买

## 🧪 测试

```bash
# 运行智能合约测试
npm run test

# 运行前端测试
cd frontend
npm run test
```

## 🚀 部署

### 智能合约部署
```bash
# 部署到测试网
npm run deploy:contracts -- --network sepolia

# 部署到主网
npm run deploy:contracts -- --network mainnet
```

### 前端部署
```bash
# 构建生产版本
npm run frontend:build

# 部署到 Vercel
vercel --prod
```

## 🤝 贡献指南

我们欢迎所有形式的贡献！请查看 [CONTRIBUTING.md](CONTRIBUTING.md) 了解详情。

### 贡献方式
- 🐛 报告 Bug
- 💡 提出新功能建议
- 📝 改进文档
- 🔧 提交代码修复

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 📞 联系我们

- **项目主页**: [https://github.com/your-username/stellara](https://github.com/your-username/stellara)
- **问题反馈**: [Issues](https://github.com/your-username/stellara/issues)
- **讨论区**: [Discussions](https://github.com/your-username/stellara/discussions)

## 🙏 致谢

感谢所有为这个项目做出贡献的开发者和社区成员！

---

⭐ 如果这个项目对你有帮助，请给我们一个星标！
