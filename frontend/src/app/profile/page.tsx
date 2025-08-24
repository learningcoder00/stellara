'use client';

import { useState, useEffect } from 'react';
import { useContracts } from '@/hooks/useContracts';
import ConnectWallet from '@/components/wallet/ConnectWallet';

import { formatEther } from 'viem';

interface UserNFT {
  tokenId: number;
  name: string;
  image: string;
  attributes: {
    clothingType: string;
    rarity: string;
    level: number;
    isWearable: boolean;
  };
}

export default function ProfilePage() {
  // 暂时使用模拟状态，避免 wagmi 问题
  const address = '0x0000...0000';
  const isConnected = false;
  // 暂时使用模拟数据，避免 wagmi 问题
  // const { userNFTs, listings, fetchUserNFTs, fetchListings } = useContracts();
  
  // 模拟数据
  const userNFTs = [
    {
      tokenId: 1,
      name: '我的星际战士上衣',
      image: 'QmMockHash1',
      attributes: {
        clothingType: '上衣',
        rarity: '稀有',
        level: 5,
        isWearable: true
      }
    }
  ];
  const listings = [];
  const fetchUserNFTs = () => console.log('刷新用户 NFT');
  const fetchListings = () => console.log('刷新挂单');
  
  const [activeTab, setActiveTab] = useState<'nfts' | 'listings' | 'history'>('nfts');
  const [isLoading, setIsLoading] = useState(false);

  // 格式化地址显示
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // 获取稀有度颜色
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case '普通': return 'bg-gray-100 text-gray-800';
      case '稀有': return 'bg-blue-100 text-blue-800';
      case '史诗': return 'bg-purple-100 text-purple-800';
      case '传说': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // 刷新数据
  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      await Promise.all([fetchUserNFTs(), fetchListings()]);
    } catch (error) {
      console.error('刷新数据失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 监听钱包连接状态
  useEffect(() => {
    if (isConnected) {
      handleRefresh();
    }
  }, [isConnected, address]);

  return (
    <div className="px-4 sm:px-0">
      <div className="max-w-6xl mx-auto">
        {/* 页面头部 */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">个人资料</h1>
              <p className="mt-2 text-gray-600">
                管理你的 NFT 收藏和交易
              </p>
            </div>
            <ConnectWallet />
          </div>
        </div>

        {/* 钱包连接提示 */}
        {!isConnected && (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">连接钱包</h3>
              <p className="text-gray-600 mb-4">
                请先连接你的钱包来查看个人资料
              </p>
              <ConnectWallet />
            </div>
          </div>
        )}

        {/* 用户信息卡片 */}
        {isConnected && (
          <div className="bg-white rounded-lg border shadow-sm p-6 mb-8">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white text-2xl">👤</span>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900">我的钱包</h2>
                <p className="text-gray-600 font-mono">{formatAddress(address || '')}</p>
              </div>
              <button
                onClick={handleRefresh}
                disabled={isLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {isLoading ? '刷新中...' : '刷新数据'}
              </button>
            </div>
          </div>
        )}

        {/* 内容标签页 */}
        {isConnected && (
          <div className="bg-white rounded-lg border shadow-sm">
            {/* 标签页导航 */}
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                {[
                  { id: 'nfts', label: '我的 NFT', icon: '🎨', count: userNFTs.length },
                  { id: 'listings', label: '我的挂单', icon: '📋', count: listings.length },
                  { id: 'history', label: '交易历史', icon: '📊', count: 0 }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <span>{tab.icon}</span>
                    <span>{tab.label}</span>
                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                      {tab.count}
                    </span>
                  </button>
                ))}
              </nav>
            </div>

            {/* 标签页内容 */}
            <div className="p-6">
              {/* NFT 收藏 */}
              {activeTab === 'nfts' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">我的 NFT 收藏</h3>
                    <span className="text-sm text-gray-500">
                      共 {userNFTs.length} 个 NFT
                    </span>
                  </div>

                  {userNFTs.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                      </div>
                      <h4 className="text-lg font-medium text-gray-900 mb-2">还没有 NFT</h4>
                      <p className="text-gray-600 mb-4">去创建页面制作你的第一个 NFT 吧！</p>
                      <a
                        href="/create"
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <span>创建 NFT</span>
                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </a>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {userNFTs.map((nft) => (
                        <div key={nft.tokenId} className="bg-gray-50 rounded-lg p-4">
                          <div className="aspect-square bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg mb-4 flex items-center justify-center">
                            <div className="text-center">
                              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-10 0a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2" />
                                </svg>
                              </div>
                              <span className="text-sm text-gray-500">NFT #{nft.tokenId}</span>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <h4 className="font-semibold text-gray-900">{nft.name}</h4>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRarityColor(nft.attributes.rarity)}`}>
                                {nft.attributes.rarity}
                              </span>
                            </div>

                            <div className="space-y-2 text-sm text-gray-600">
                              <div className="flex justify-between">
                                <span>类型:</span>
                                <span>{nft.attributes.clothingType}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>等级:</span>
                                <span>{nft.attributes.level}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>可穿戴:</span>
                                <span>{nft.attributes.isWearable ? '✅' : '❌'}</span>
                              </div>
                            </div>

                            <div className="flex space-x-2">
                              <button className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                                挂单出售
                              </button>
                              <button className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                                查看详情
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* 我的挂单 */}
              {activeTab === 'listings' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">我的挂单</h3>
                    <span className="text-sm text-gray-500">
                      共 {listings.length} 个挂单
                    </span>
                  </div>

                  {listings.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                      </div>
                      <h4 className="text-lg font-medium text-gray-900 mb-2">还没有挂单</h4>
                      <p className="text-gray-600">将你的 NFT 挂单出售，开始赚钱吧！</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {listings.map((listing, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center">
                                <span className="text-blue-600 text-lg">🎨</span>
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900">
                                  NFT #{Number(listing.tokenId)}
                                </h4>
                                <p className="text-sm text-gray-600">
                                  挂单时间: {new Date(Number(listing.listingTime) * 1000).toLocaleDateString('zh-CN')}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold text-blue-600">
                                {formatEther(listing.price)} ETH
                              </div>
                              <button className="text-sm text-red-600 hover:text-red-700">
                                取消挂单
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* 交易历史 */}
              {activeTab === 'history' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">交易历史</h3>
                  </div>

                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <h4 className="text-lg font-medium text-gray-900 mb-2">暂无交易记录</h4>
                    <p className="text-gray-600">你的交易历史将在这里显示</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
