// IPFS 服务类
import { PROJECT_CONFIG } from '@/config/project';

export interface IPFSFile {
  name: string;
  type: string;
  size: number;
  lastModified: number;
}

export interface IPFSMetadata {
  name: string;
  description: string;
  image: string;
  attributes: {
    clothingType: string;
    rarity: string;
    level: number;
    isWearable: boolean;
    ipfsHash: string;
    [key: string]: any;
  };
  external_url?: string;
  animation_url?: string;
}

export interface IPFSUploadResult {
  success: boolean;
  hash?: string;
  url?: string;
  error?: string;
}

export class IPFSService {
  private apiKey: string;
  private secretKey: string;
  private gateway: string;
  private isMockMode: boolean;

  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_PINATA_API_KEY || '';
    this.secretKey = process.env.NEXT_PUBLIC_PINATA_SECRET_KEY || '';
    this.gateway = PROJECT_CONFIG.ipfs.pinata.gateway;
    
    // 检查是否在客户端环境且没有配置 API 密钥
    this.isMockMode = typeof window !== 'undefined' && (!this.apiKey || !this.secretKey);
    
    if (this.isMockMode) {
      console.warn('⚠️ IPFS 服务运行在模拟模式，请配置 Pinata API 密钥');
    }
  }

  // 上传图片到 IPFS
  async uploadImage(file: File): Promise<IPFSUploadResult> {
    try {
      if (this.isMockMode) {
        return this.mockImageUpload(file);
      }

      console.log('📤 开始上传图片到 IPFS...');
      
      // 创建 FormData
      const formData = new FormData();
      formData.append('file', file);
      
      // 添加元数据
      const metadata = {
        name: file.name,
        description: `Stellara NFT Image: ${file.name}`,
        image: file.name
      };
      formData.append('pinataMetadata', JSON.stringify(metadata));

      // 发送到 Pinata
      const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      const hash = result.IpfsHash;
      const url = `${this.gateway}${hash}`;

      console.log('✅ 图片上传成功:', url);
      return { success: true, hash, url };
    } catch (error) {
      console.error('❌ 图片上传失败:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : '上传失败' 
      };
    }
  }

  // 上传元数据到 IPFS
  async uploadMetadata(metadata: IPFSMetadata): Promise<IPFSUploadResult> {
    try {
      if (this.isMockMode) {
        return this.mockMetadataUpload(metadata);
      }

      console.log('📤 开始上传元数据到 IPFS...');
      
      // 发送到 Pinata
      const response = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify(metadata)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      const hash = result.IpfsHash;
      const url = `${this.gateway}${hash}`;

      console.log('✅ 元数据上传成功:', url);
      return { success: true, hash, url };
    } catch (error) {
      console.error('❌ 元数据上传失败:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : '上传失败' 
      };
    }
    }

  // 从 IPFS 获取元数据
  async getMetadata(hash: string): Promise<IPFSMetadata | null> {
    try {
      const url = `${this.gateway}${hash}`;
      console.log('📥 从 IPFS 获取元数据:', url);
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const metadata = await response.json();
      console.log('✅ 元数据获取成功');
      return metadata;
    } catch (error) {
      console.error('❌ 元数据获取失败:', error);
      return null;
    }
  }

  // 验证 IPFS 哈希
  validateHash(hash: string): boolean {
    // IPFS 哈希通常是 46 个字符的 base58 编码字符串
    const ipfsHashRegex = /^Qm[1-9A-HJ-NP-Za-km-z]{44}$/;
    return ipfsHashRegex.test(hash);
  }

  // 生成 IPFS URL
  generateURL(hash: string): string {
    if (!this.validateHash(hash)) {
      throw new Error('无效的 IPFS 哈希');
    }
    return `${this.gateway}${hash}`;
  }

  // 模拟图片上传（开发模式）
  private async mockImageUpload(file: File): Promise<IPFSUploadResult> {
    console.log('🎭 模拟模式：图片上传', file.name);
    
    // 模拟上传延迟
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 生成模拟哈希
    const mockHash = this.generateMockHash();
    const mockUrl = `${this.gateway}${mockHash}`;
    
    console.log('✅ 模拟图片上传成功:', mockUrl);
    return { success: true, hash: mockHash, url: mockUrl };
  }

  // 模拟元数据上传（开发模式）
  private async mockMetadataUpload(metadata: IPFSMetadata): Promise<IPFSUploadResult> {
    console.log('🎭 模拟模式：元数据上传', metadata.name);
    
    // 模拟上传延迟
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // 生成模拟哈希
    const mockHash = this.generateMockHash();
    const mockUrl = `${this.gateway}${mockHash}`;
    
    console.log('✅ 模拟元数据上传成功:', mockUrl);
    return { success: true, hash: mockHash, url: mockUrl };
  }

  // 生成模拟 IPFS 哈希
  private generateMockHash(): string {
    const chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
    let result = 'Qm';
    for (let i = 0; i < 44; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  // 检查 IPFS 连接状态
  async checkConnection(): Promise<{ connected: boolean; gateway: string; error?: string }> {
    try {
      if (this.isMockMode) {
        return { connected: true, gateway: this.gateway };
      }

      // 尝试访问 IPFS 网关
      const testHash = 'QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG';
      const testUrl = `${this.gateway}${testHash}`;
      
      const response = await fetch(testUrl, { method: 'HEAD' });
      
      if (response.ok) {
        return { connected: true, gateway: this.gateway };
      } else {
        return { connected: false, gateway: this.gateway, error: `HTTP ${response.status}` };
      }
    } catch (error) {
      return { 
        connected: false, 
        gateway: this.gateway, 
        error: error instanceof Error ? error.message : '连接失败' 
      };
    }
  }

  // 获取文件大小（MB）
  getFileSizeMB(file: File): number {
    return Math.round((file.size / 1024 / 1024) * 100) / 100;
  }

  // 验证文件类型
  validateFileType(file: File, allowedTypes: string[]): boolean {
    return allowedTypes.includes(file.type);
  }

  // 验证文件大小
  validateFileSize(file: File, maxSizeMB: number): boolean {
    return this.getFileSizeMB(file) <= maxSizeMB;
  }

  // 压缩图片（如果需要）
  async compressImage(file: File, maxWidth: number = 800, quality: number = 0.8): Promise<File> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // 计算新尺寸
        let { width, height } = img;
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        // 绘制图片
        ctx?.drawImage(img, 0, 0, width, height);

        // 转换为 Blob
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now()
              });
              resolve(compressedFile);
            } else {
              reject(new Error('图片压缩失败'));
            }
          },
          file.type,
          quality
        );
      };

      img.onerror = () => reject(new Error('图片加载失败'));
      img.src = URL.createObjectURL(file);
    });
  }
}

// 创建 NFT 元数据的辅助函数
export const createNFTMetadata = (
  name: string,
  description: string,
  imageHash: string,
  clothingType: string,
  rarity: string,
  level: number,
  isWearable: boolean = true
): IPFSMetadata => {
  return {
    name,
    description,
    image: `ipfs://${imageHash}`,
    attributes: {
      clothingType,
      rarity,
      level,
      isWearable,
      ipfsHash: imageHash
    },
    external_url: `https://stellara.io/nft/${imageHash}`,
    animation_url: undefined
  };
};

// 创建全局实例
export const ipfsService = new IPFSService();
export default ipfsService;
