'use client';

import { useState, useEffect } from 'react';

import ConnectWallet from '@/components/wallet/ConnectWallet';
import { formatEther } from 'viem';

interface NFTListing {
  nftContract: string;
  tokenId: bigint;
  seller: string;
  price: bigint;
  isActive: boolean;
  listingTime: bigint;
}

export default function MarketplacePage() {
  // 暂时使用模拟数据，避免 wagmi 问题
  // const {
  //   listings,
  //   isConnected,
  //   isBuying,
  //   isBuySuccess,
  //   handleBuyNFT,
  //   fetchListings
  // } = useContracts();
  
  // 模拟数据
  const listings = [
    {
      nftContract: '0x0000...0000',
      tokenId: BigInt(1),
      seller: '0x1234...5678',
      price: BigInt('100000000000000000'), // 0.1 ETH
      isActive: true,
      listingTime: BigInt(Math.floor(Date.now() / 1000))
    }
  ];
  const isConnected = false;
  const isBuying = false;
  const isBuySuccess = false;
  const handleBuyNFT = () => console.log('购买 NFT');
  const fetchListings = () => console.log('刷新挂单');

  const [selectedNFT, setSelectedNFT] = useState<NFTListing | null>(null);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [buyPrice, setBuyPrice] = useState('');

  // 格式化地址显示
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // 格式化价格显示
  const formatPrice = (price: bigint) => {
    const ethPrice = formatEther(price);
    return `${ethPrice} ETH`;
  };

  // 格式化时间显示
  const formatTime = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) * 1000);
    return date.toLocaleDateString('zh-CN');
  };

  // 处理购买 NFT
  const handleBuy = async () => {
    if (!selectedNFT || !buyPrice) return;

    try {
      await handleBuyNFT(Number(selectedNFT.tokenId), buyPrice);
      setShowBuyModal(false);
      setSelectedNFT(null);
      setBuyPrice('');
      
      // 刷新市场数据
      setTimeout(() => {
        fetchListings();
      }, 2000);
    } catch (error) {
      console.error('购买失败:', error);
      alert('购买失败，请重试');
    }
  };

  // 打开购买模态框
  const openBuyModal = (nft: NFTListing) => {
    setSelectedNFT(nft);
    setBuyPrice(formatEther(nft.price));
    setShowBuyModal(true);
  };

  // 关闭购买模态框
  const closeBuyModal = () => {
    setShowBuyModal(false);
    setSelectedNFT(null);
    setBuyPrice('');
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

  return (
    <div className="px-4 sm:px-0">
      {/* 页面头部 */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">NFT 市场</h1>
            <p className="mt-2 text-gray-600">
              发现和购买独特的虚拟服装 NFT
            </p>
          </div>
          <ConnectWallet />
        </div>
        
        <div className="flex items-center justify-between">
          <p className="text-sm text-blue-600">
            当前有 {listings.length} 个活跃挂单
          </p>
          {isConnected && (
            <button
              onClick={fetchListings}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              刷新市场
            </button>
          )}
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
              请先连接你的钱包来查看和购买 NFT
            </p>
            <ConnectWallet />
          </div>
        </div>
      )}

      {/* NFT 市场网格 */}
      {isConnected && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {listings.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">暂无挂单</h3>
              <p className="text-gray-600">市场上还没有 NFT 挂单，成为第一个卖家吧！</p>
            </div>
          ) : (
            listings.map((nft, index) => (
              <div key={index} className="bg-white rounded-lg border shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-4">
                  {/* NFT 图片占位符 */}
                  <div className="aspect-square bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg mb-4 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-10 0a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2" />
                        </svg>
                      </div>
                      <span className="text-sm text-gray-500">NFT #{Number(nft.tokenId)}</span>
                    </div>
                  </div>

                  {/* NFT 信息 */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold text-gray-900">
                        虚拟服装 #{Number(nft.tokenId)}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRarityColor('稀有')}`}>
                        稀有
                      </span>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">卖家</span>
                        <span className="font-mono text-gray-700">{formatAddress(nft.seller)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">挂单时间</span>
                        <span className="text-gray-700">{formatTime(nft.listingTime)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">价格</span>
                        <span className="text-lg font-bold text-blue-600">{formatPrice(nft.price)}</span>
                      </div>
                    </div>

                    {/* 操作按钮 */}
                    <button
                      onClick={() => openBuyModal(nft)}
                      disabled={isBuying}
                      className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                        isBuying
                          ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      {isBuying ? '购买中...' : '立即购买'}
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* 购买成功提示 */}
      {isBuySuccess && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span>NFT 购买成功！</span>
          </div>
        </div>
      )}

      {/* 购买确认模态框 */}
      {showBuyModal && selectedNFT && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">确认购买</h3>
            
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">NFT ID:</span>
                  <span className="font-mono">#{Number(selectedNFT.tokenId)}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">卖家:</span>
                  <span className="font-mono text-sm">{formatAddress(selectedNFT.seller)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">价格:</span>
                  <span className="text-lg font-bold text-blue-600">{formatPrice(selectedNFT.price)}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  确认价格 (ETH)
                </label>
                <input
                  type="text"
                  value={buyPrice}
                  onChange={(e) => setBuyPrice(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="输入价格"
                />
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={closeBuyModal}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleBuy}
                  disabled={isBuying}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                    isBuying
                      ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {isBuying ? '购买中...' : '确认购买'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
