'use client';

import Link from 'next/link';
import { IPFSInfoCard } from '@/components/common/IPFSStatus';
import ConnectWallet from '@/components/wallet/ConnectWallet';

export default function HomePage() {
  // 暂时使用模拟状态，避免 wagmi 问题
  const isConnected = false;

  return (
    <div className="px-4 sm:px-0">
      {/* Hero Section */}
      <div className="text-center py-20 relative overflow-hidden">
        {/* 背景装饰 */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-cyan-50"></div>
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-200/30 rounded-full blur-3xl"></div>
        
        <div className="relative z-10">
          <div className="animate-fade-in">
            <h1 className="text-5xl font-bold text-gray-900 sm:text-7xl mb-6">
              欢迎来到{' '}
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
                Stellara
              </span>
            </h1>
            <p className="mt-8 text-xl leading-8 text-gray-600 max-w-3xl mx-auto">
              去中心化的虚拟服装 NFT 交易平台，在这里创造、收集和交易独特的虚拟服装
            </p>
            <div className="mt-12 flex items-center justify-center gap-x-6">
              <Link href="/marketplace">
                <button className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 text-lg font-semibold shadow-lg hover:shadow-xl hover:scale-105">
                  🏪 探索市场
                  <svg className="inline-block w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
              </Link>
              <Link href="/create">
                <button className="group border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-2xl hover:bg-blue-600 hover:text-white transition-all duration-300 text-lg font-semibold hover:shadow-lg hover:scale-105">
                  ✨ 创建 NFT
                  <svg className="inline-block w-5 h-5 ml-2 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </Link>
            </div>
            
            {/* 钱包连接提示 */}
            {!isConnected && (
              <div className="mt-12 animate-fade-in">
                <p className="text-sm text-gray-500 mb-6">开始使用前，请先连接你的钱包</p>
                <div className="inline-block">
                  <ConnectWallet />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-20">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="group bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:border-blue-200/50">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">活跃挂单</h3>
              <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">0</div>
            </div>
          </div>

          <div className="group bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:border-green-200/50">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">平台费率</h3>
              <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">2.5%</div>
            </div>
          </div>

          <div className="group bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:border-purple-200/50">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">网络</h3>
              <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">Ethereum</div>
            </div>
          </div>

          <div className="group bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:border-orange-200/50">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">IPFS 状态</h3>
              <div className="transform group-hover:scale-105 transition-transform">
                <IPFSInfoCard />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            平台特色
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            体验下一代 NFT 交易平台的独特魅力
          </p>
        </div>
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
          <div className="group text-center">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-300 shadow-lg">
              <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">去中心化</h3>
            <p className="text-gray-600 leading-relaxed">
              基于区块链技术，确保交易的透明性和安全性，无需信任第三方
            </p>
          </div>

          <div className="group text-center">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-300 shadow-lg">
              <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">真实所有权</h3>
            <p className="text-gray-600 leading-relaxed">
              NFT 技术保证你对虚拟服装的真实拥有权，永久记录在区块链上
            </p>
          </div>

          <div className="group text-center">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-300 shadow-lg">
              <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">快速交易</h3>
            <p className="text-gray-600 leading-relaxed">
              高效的交易机制，快速完成 NFT 买卖，实时确认交易状态
            </p>
          </div>
        </div>
      </div>

      {/* 快速开始指南 */}
      {isConnected && (
        <div className="py-20 bg-gradient-to-br from-blue-50 via-purple-50 to-cyan-50 rounded-3xl mx-4 sm:mx-0">
          <div className="max-w-6xl mx-auto text-center px-4">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              快速开始
            </h2>
            <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
              连接钱包后，开始你的 NFT 之旅
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="group bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-white/50">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <span className="text-3xl">🎨</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">创建 NFT</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  上传图片，设置属性，铸造你的第一个虚拟服装 NFT
                </p>
                <Link href="/create">
                  <button className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 px-6 rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg">
                    开始创建
                  </button>
                </Link>
              </div>

              <div className="group bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-white/50">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <span className="text-3xl">🏪</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">探索市场</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  浏览其他用户创建的 NFT，发现独特的虚拟服装
                </p>
                <Link href="/marketplace">
                  <button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-6 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg">
                    浏览市场
                  </button>
                </Link>
              </div>

              <div className="group bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-white/50">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <span className="text-3xl">💰</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">开始交易</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  将你的 NFT 挂单出售，或者购买心仪的虚拟服装
                </p>
                <Link href="/marketplace">
                  <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg">
                    开始交易
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* IPFS 信息区域 */}
      <div className="py-20 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 rounded-3xl mx-4 sm:mx-0">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              IPFS 去中心化存储
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              了解我们如何确保你的 NFT 数据安全永久存储
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="group">
              <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-white/50">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900">什么是 IPFS？</h3>
                </div>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  IPFS（星际文件系统）是一个去中心化的文件存储网络，确保你的 NFT 图片和元数据永久保存，不受任何中心化服务器的影响。
                </p>
                <ul className="text-gray-600 space-y-3">
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>去中心化存储，永不丢失</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>全球分布式网络，访问速度快</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span>内容寻址，确保数据完整性</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                    <span>与区块链完美结合</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="group">
              <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-white/50">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900">在 Stellara 中的应用</h3>
                </div>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  我们使用 IPFS 存储所有 NFT 的图片和元数据，确保你的虚拟服装 NFT 安全可靠地存储在去中心化网络中。
                </p>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-blue-50/50 rounded-xl">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-700 font-medium">图片文件上传到 IPFS</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-green-50/50 rounded-xl">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-gray-700 font-medium">元数据 JSON 存储到 IPFS</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-purple-50/50 rounded-xl">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <span className="text-gray-700 font-medium">智能合约记录 IPFS 哈希</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
