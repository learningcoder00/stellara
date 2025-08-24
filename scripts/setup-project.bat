@echo off
chcp 65001 >nul
echo 🚀 开始设置 Stellara 项目...

REM 检查 Node.js 版本
echo 📋 检查 Node.js 版本...
node --version
if %errorlevel% neq 0 (
    echo ❌ Node.js 未安装，请先安装 Node.js
    pause
    exit /b 1
)

REM 检查 npm 版本
echo 📋 检查 npm 版本...
npm --version
if %errorlevel% neq 0 (
    echo ❌ npm 未安装，请先安装 npm
    pause
    exit /b 1
)

REM 安装依赖
echo 📦 安装项目依赖...
call npm install
if %errorlevel% neq 0 (
    echo ❌ 依赖安装失败
    pause
    exit /b 1
)

REM 安装前端依赖
echo 📦 安装前端依赖...
cd frontend
call npm install
if %errorlevel% neq 0 (
    echo ❌ 前端依赖安装失败
    pause
    exit /b 1
)
cd ..

REM 编译智能合约
echo 🔨 编译智能合约...
call npx hardhat compile
if %errorlevel% neq 0 (
    echo ❌ 合约编译失败
    pause
    exit /b 1
)

REM 创建环境变量文件
echo 📝 创建环境变量文件...
if not exist "frontend\.env.local" (
    copy "frontend\env.example" "frontend\.env.local"
    echo ✅ 环境变量文件已创建: frontend\.env.local
    echo ⚠️  请编辑此文件并填入真实的 API 密钥和合约地址
) else (
    echo ✅ 环境变量文件已存在
)

REM 创建 IPFS 目录
echo 📁 创建 IPFS 目录...
if not exist "ipfs\uploads" mkdir "ipfs\uploads"
if not exist "ipfs\metadata" mkdir "ipfs\metadata"
echo ✅ IPFS 目录已创建

REM 创建文档目录
echo 📚 创建文档目录...
if not exist "docs\api" mkdir "docs\api"
if not exist "docs\contracts" mkdir "docs\contracts"
if not exist "docs\deployment" mkdir "docs\deployment"
echo ✅ 文档目录已创建

REM 检查 Hardhat 配置
echo 🔧 检查 Hardhat 配置...
if exist "hardhat.config.ts" (
    echo ✅ Hardhat 配置文件存在
) else (
    echo ❌ Hardhat 配置文件缺失
)

REM 检查合约文件
echo 📄 检查智能合约...
if exist "contracts\core\StellaraNFT.sol" (
    if exist "contracts\marketplace\StellaraMarketplace.sol" (
        echo ✅ 智能合约文件存在
    ) else (
        echo ❌ 市场合约文件缺失
    )
) else (
    echo ❌ NFT 合约文件缺失
)

REM 检查前端配置
echo 🌐 检查前端配置...
if exist "frontend\next.config.ts" (
    if exist "frontend\tailwind.config.ts" (
        echo ✅ 前端配置文件存在
    ) else (
        echo ❌ Tailwind 配置文件缺失
    )
) else (
    echo ❌ Next.js 配置文件缺失
)

REM 运行测试
echo 🧪 运行智能合约测试...
call npx hardhat test
if %errorlevel% neq 0 (
    echo ⚠️  测试运行失败，但项目设置继续
)

REM 显示项目状态
echo.
echo 🎉 Stellara 项目设置完成！
echo.
echo 📋 下一步操作：
echo 1. 编辑 frontend\.env.local 文件，配置 API 密钥
echo 2. 部署智能合约到测试网络
echo 3. 更新合约地址配置
echo 4. 启动前端开发服务器
echo.
echo 🚀 启动命令：
echo   npm run dev          # 启动前端开发服务器
echo   npm run frontend:dev # 仅启动前端
echo   npx hardhat node     # 启动本地 Hardhat 节点
echo   npx hardhat test     # 运行测试
echo   npx hardhat deploy   # 部署合约
echo.
echo 📚 项目文档：
echo   - 智能合约: contracts\
echo   - 前端代码: frontend\src\
echo   - 部署脚本: scripts\
echo   - 项目配置: docs\
echo.
echo 🔗 有用的链接：
echo   - Pinata IPFS: https://pinata.cloud/
echo   - Sepolia Faucet: https://sepoliafaucet.com/
echo   - Mumbai Faucet: https://faucet.polygon.technology/
echo.
echo ✅ 设置完成！开始构建你的 NFT 平台吧！
pause
