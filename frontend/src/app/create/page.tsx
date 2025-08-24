'use client';

import { useState, useRef, useEffect } from 'react';
import ConnectWallet from '@/components/wallet/ConnectWallet';
import { ipfsService, createNFTMetadata } from '@/services/ipfs';


export default function CreatePage() {
  // 暂时使用模拟状态，避免 wagmi 问题
  const address = '0x0000...0000';
  const isConnected = false;
  // 暂时注释掉 useContracts，避免 wagmi 问题
  // const { handleMintNFT, isMinting, isMintSuccess } = useContracts();
  const handleMintNFT = () => console.log('铸造 NFT');
  const isMinting = false;
  const isMintSuccess = false;
  
  const [formData, setFormData] = useState({
    name: '',
    clothingType: '上衣',
    rarity: '普通',
    level: 1,
    description: '',
    image: null as File | null
  });
  
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [mintStatus, setMintStatus] = useState<'idle' | 'uploading' | 'minting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  // 监听进度变化，更新进度条宽度
  useEffect(() => {
    if (progressBarRef.current) {
      progressBarRef.current.style.width = `${uploadProgress}%`;
    }
  }, [uploadProgress]);

  // 监听铸造成功状态
  useEffect(() => {
    if (isMintSuccess) {
      setMintStatus('success');
      // 重置表单
      setTimeout(() => {
        resetForm();
      }, 3000);
    }
  }, [isMintSuccess]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 验证文件类型
      if (!file.type.startsWith('image/')) {
        setErrorMessage('请选择图片文件');
        return;
      }
      
      // 验证文件大小（最大 10MB）
      if (file.size > 10 * 1024 * 1024) {
        setErrorMessage('图片文件大小不能超过 10MB');
        return;
      }

      setFormData(prev => ({ ...prev, image: file }));
      setErrorMessage('');
      
      // 创建预览 URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      clothingType: '上衣',
      rarity: '普通',
      level: 1,
      description: '',
      image: null
    });
    setPreviewUrl('');
    setMintStatus('idle');
    setErrorMessage('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected) {
      setErrorMessage('请先连接钱包');
      return;
    }
    
    if (!formData.name || !formData.image) {
      setErrorMessage('请填写所有必需字段并选择图片');
      return;
    }

    setMintStatus('uploading');
    setIsUploading(true);
    setUploadProgress(0);
    setErrorMessage('');

    try {
      // 模拟上传进度
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // 1. 上传图片到 IPFS
      console.log('正在上传图片到 IPFS...');
      const imageHash = await ipfsService.uploadImage(formData.image);
      console.log('图片上传成功，IPFS 哈希:', imageHash);

      // 2. 创建 NFT 元数据
      console.log('正在创建 NFT 元数据...');
      const metadata = createNFTMetadata(
        formData.name,
        formData.clothingType,
        formData.rarity,
        formData.level,
        imageHash,
        formData.description
      );

      // 3. 上传元数据到 IPFS
      console.log('正在上传元数据到 IPFS...');
      const metadataHash = await ipfsService.uploadMetadata(metadata);
      console.log('元数据上传成功，IPFS 哈希:', metadataHash);

      clearInterval(progressInterval);
      setUploadProgress(100);

      // 4. 铸造 NFT
      setMintStatus('minting');
      console.log('正在铸造 NFT...');
      
      // 暂时注释掉实际铸造，避免 wagmi 问题
      // await handleMintNFT(
      //   address!,
      //   formData.clothingType,
      //   formData.rarity,
      //   formData.level,
      //   metadataHash
      // );
      console.log('模拟铸造 NFT:', {
        address,
        clothingType: formData.clothingType,
        rarity: formData.rarity,
        level: formData.level,
        metadataHash
      });

      console.log('NFT 铸造成功！');
      
    } catch (error) {
      console.error('创建 NFT 失败:', error);
      setMintStatus('error');
      setErrorMessage(`创建失败: ${error instanceof Error ? error.message : '未知错误'}`);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'level' ? parseInt(value) : value
    }));
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
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
      <div className="max-w-2xl mx-auto">
        {/* 页面头部 */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">创建 NFT</h1>
              <p className="mt-2 text-gray-600">
                创建你的独特虚拟服装 NFT
              </p>
            </div>
            <ConnectWallet />
          </div>
        </div>

        {/* 钱包连接提示 */}
        {!isConnected && (
          <div className="text-center py-12 bg-gray-50 rounded-lg mb-8">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">连接钱包</h3>
              <p className="text-gray-600 mb-4">
                请先连接你的钱包来创建 NFT
              </p>
              <ConnectWallet />
            </div>
          </div>
        )}

        {/* 创建表单 */}
        {isConnected && (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 图片上传 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                NFT 图片 *
              </label>
              <div className="space-y-4">
                {/* 图片预览 */}
                {previewUrl && (
                  <div className="relative">
                    <img
                      src={previewUrl}
                      alt="预览"
                      className="w-full h-48 object-cover rounded-lg border"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setPreviewUrl('');
                        setFormData(prev => ({ ...prev, image: null }));
                        if (fileInputRef.current) {
                          fileInputRef.current.value = '';
                        }
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                )}
                
                {/* 上传按钮 */}
                <div
                  onClick={triggerFileInput}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
                >
                  <div className="text-gray-600">
                    <svg className="mx-auto h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="text-lg font-medium">点击上传图片</p>
                    <p className="text-sm">支持 JPG、PNG、GIF 格式，最大 10MB</p>
                  </div>
                </div>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  required
                  aria-label="选择 NFT 图片文件"
                  title="选择 NFT 图片文件"
                />
              </div>
            </div>

            {/* NFT 名称 */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                NFT 名称 *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="例如：星际战士上衣"
              />
            </div>

            {/* 服装类型 */}
            <div>
              <label htmlFor="clothingType" className="block text-sm font-medium text-gray-700 mb-2">
                服装类型
              </label>
              <select
                id="clothingType"
                name="clothingType"
                value={formData.clothingType}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="上衣">上衣</option>
                <option value="裤子">裤子</option>
                <option value="外套">外套</option>
                <option value="头饰">头饰</option>
                <option value="鞋子">鞋子</option>
                <option value="配饰">配饰</option>
              </select>
            </div>

            {/* 稀有度 */}
            <div>
              <label htmlFor="rarity" className="block text-sm font-medium text-gray-700 mb-2">
                稀有度
              </label>
              <select
                id="rarity"
                name="rarity"
                value={formData.rarity}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="普通">普通</option>
                <option value="稀有">稀有</option>
                <option value="史诗">史诗</option>
                <option value="传说">传说</option>
              </select>
            </div>

            {/* 等级 */}
            <div>
              <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-2">
                等级
              </label>
              <input
                type="number"
                id="level"
                name="level"
                min="1"
                max="100"
                value={formData.level}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* 描述 */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                描述
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="描述你的 NFT 特色..."
              />
            </div>

            {/* 错误提示 */}
            {errorMessage && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span className="text-red-700">{errorMessage}</span>
                </div>
              </div>
            )}

            {/* 上传进度 */}
            {(mintStatus === 'uploading' || mintStatus === 'minting') && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>
                    {mintStatus === 'uploading' ? '正在上传到 IPFS...' : '正在铸造 NFT...'}
                  </span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    ref={progressBarRef}
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300 progress-bar"
                  ></div>
                </div>
              </div>
            )}

            {/* 成功提示 */}
            {mintStatus === 'success' && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-green-700">NFT 创建成功！正在刷新页面...</span>
                </div>
              </div>
            )}

            {/* 提交按钮 */}
            <button
              type="submit"
              disabled={mintStatus === 'uploading' || mintStatus === 'minting' || mintStatus === 'success'}
              className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                mintStatus === 'uploading' || mintStatus === 'minting' || mintStatus === 'success'
                  ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {mintStatus === 'uploading' && '上传中...'}
              {mintStatus === 'minting' && '铸造中...'}
              {mintStatus === 'success' && '创建成功！'}
              {mintStatus === 'idle' && '创建 NFT'}
              {mintStatus === 'error' && '重试创建'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
