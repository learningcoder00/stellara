'use client';

import { useState } from 'react';
import { supportedChains } from '@/config/wagmi';

export default function ConnectWallet() {
  // 暂时使用模拟状态，避免 wagmi 问题
  const isConnected = false;
  const address = '0x0000...0000';
  const chainId = 1;

  const [showNetworkSelector, setShowNetworkSelector] = useState(false);



  const handleConnect = (connector: any) => {
    console.log('连接钱包:', connector);
    // 暂时禁用实际连接
  };

  const handleDisconnect = () => {
    console.log('断开连接');
    // 暂时禁用实际断开
  };

  const handleSwitchNetwork = (targetChainId: number) => {
    console.log('切换网络:', targetChainId);
    setShowNetworkSelector(false);
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getChainIcon = (chainId: number) => {
    const chain = supportedChains.find(c => c.id === chainId);
    return chain?.icon || '❓';
  };

  const getChainName = (chainId: number) => {
    const chain = supportedChains.find(c => c.id === chainId);
    return chain?.name || 'Unknown Network';
  };

  if (isConnected) {
    return (
      <div className="flex items-center space-x-3">
        {/* 网络选择器 */}
        <div className="relative">
          <button
            onClick={() => setShowNetworkSelector(!showNetworkSelector)}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 rounded-xl transition-all duration-200 hover:shadow-md border border-gray-200/50"
          >
            <span className="text-lg">{getChainIcon(chainId || 1)}</span>
            <span className="text-sm font-medium text-gray-700">
              {getChainName(chainId) || 'Unknown Network'}
            </span>
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showNetworkSelector && (
            <div className="absolute top-full left-0 mt-3 w-52 bg-white/95 backdrop-blur-md border border-gray-200/50 rounded-2xl shadow-xl z-50 overflow-hidden">
              <div className="p-3">
                <div className="text-xs font-semibold text-gray-500 mb-3 px-2 uppercase tracking-wide">选择网络</div>
                {supportedChains.map((supportedChain) => (
                  <button
                    key={supportedChain.id}
                    onClick={() => handleSwitchNetwork(supportedChain.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-3 text-left rounded-xl hover:bg-gray-50/80 transition-all duration-200 ${
                      chainId === supportedChain.id 
                        ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border border-blue-200/50' 
                        : 'text-gray-700 hover:scale-105'
                    }`}
                  >
                    <span className="text-xl">{supportedChain.icon}</span>
                    <span className="text-sm font-medium">{supportedChain.name}</span>
                    {chainId === supportedChain.id && (
                      <svg className="w-4 h-4 ml-auto text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 钱包地址显示 */}
        <div className="flex items-center space-x-3 px-4 py-2 bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 rounded-xl border border-blue-200/50 shadow-sm">
          <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-mono font-medium">{formatAddress(address || '')}</span>
        </div>

        {/* 断开连接按钮 */}
        <button
          onClick={handleDisconnect}
          className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl hover:from-red-600 hover:to-pink-600 transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md hover:scale-105"
        >
          断开
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-3">
      {/* 连接钱包按钮 */}
      <div className="relative">
        <button
          onClick={() => setShowNetworkSelector(!showNetworkSelector)}
          className="px-4 py-2 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 rounded-xl transition-all duration-200 text-sm font-medium border border-gray-200/50 hover:shadow-md"
        >
          选择网络
        </button>

        {showNetworkSelector && (
          <div className="absolute top-full left-0 mt-3 w-52 bg-white/95 backdrop-blur-md border border-gray-200/50 rounded-2xl shadow-xl z-50 overflow-hidden">
            <div className="p-3">
              <div className="text-xs font-semibold text-gray-500 mb-3 px-2 uppercase tracking-wide">选择网络</div>
              {supportedChains.map((supportedChain) => (
                <button
                  key={supportedChain.id}
                  onClick={() => handleSwitchNetwork(supportedChain.id)}
                  className="w-full flex items-center space-x-3 px-3 py-3 text-left rounded-xl hover:bg-gray-50/80 transition-all duration-200 text-gray-700 hover:scale-105"
                >
                  <span className="text-xl">{supportedChain.icon}</span>
                  <span className="text-sm font-medium">{supportedChain.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 钱包连接选项 */}
      <div className="flex space-x-3">
        <button
          onClick={() => handleConnect({ id: 'metaMask' })}
          className="px-6 py-2 rounded-xl transition-all duration-200 text-sm font-medium bg-gradient-to-r from-orange-500 to-yellow-500 text-white hover:from-orange-600 hover:to-yellow-600 shadow-sm hover:shadow-md hover:scale-105"
        >
          🦊 MetaMask
        </button>
        <button
          onClick={() => handleConnect({ id: 'injected' })}
          className="px-6 py-2 rounded-xl transition-all duration-200 text-sm font-medium bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 shadow-sm hover:shadow-md hover:scale-105"
        >
          🌐 浏览器钱包
        </button>
      </div>
    </div>
  );
}
