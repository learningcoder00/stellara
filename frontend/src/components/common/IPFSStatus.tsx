'use client';

export function IPFSStatus() {
  // 简化版本，避免复杂的异步操作
  const isConnected = false;
  const gateway = 'ipfs.io';

  return (
    <div className="flex items-center space-x-2 text-sm">
      <div className="w-2 h-2 rounded-full bg-red-500"></div>
      <span className="text-red-600">
        IPFS 未连接
      </span>
      <span className="text-gray-500 text-xs">
        ({gateway})
      </span>
    </div>
  );
}

// IPFS 信息卡片组件
export function IPFSInfoCard() {
  // 简化版本，避免复杂的逻辑
  const isConnected = false; // 暂时硬编码为 false
  const gatewayCount = 5;

  return (
    <div className="bg-white rounded-lg border p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-900">IPFS 状态</h3>
        <div className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
          未配置
        </div>
      </div>
      
      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex justify-between">
          <span>连接状态:</span>
          <span className="text-red-600">异常</span>
        </div>
        
        <div className="flex justify-between">
          <span>可用网关:</span>
          <span>{gatewayCount} 个</span>
        </div>
        
        <div className="flex justify-between">
          <span>存储服务:</span>
          <span>模拟模式</span>
        </div>
      </div>
      
      <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
        💡 提示：配置 Pinata API 密钥以启用真实的 IPFS 存储功能
      </div>
    </div>
  );
}
