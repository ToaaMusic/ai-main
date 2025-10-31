"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowLeft, 
  Heart, 
  Share2, 
  MessageCircle, 
  Star,
  TrendingUp,
  Calendar,
  User,
  Tag,
  Sparkles,
  BarChart3,
  Clock,
  Upload
} from 'lucide-react';
import Link from 'next/link';

interface ProductDetail {
  id: number;
  title: string;
  description: string;
  brand: string;
  model: string;
  condition: string;
  originalPrice: number;
  aiEstimatedPrice: number;
  userPrice: number;
  status: string;
  images: string;
  createdAt: string;
  categoryName: string;
  sellerName: string;
  sellerAvatar: string;
  pricingFactors: {
    brandValue: number;
    marketDemand: number;
    conditionScore: number;
    usageDuration: number;
    functionalityScore: number;
  } | null;
  reviews: Array<{
    id: number;
    rating: number;
    content: string;
    createdAt: string;
    userName: string;
    userAvatar: string;
  }>;
  averageRating: number;
  reviewCount: number;
}

export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);

  useEffect(() => {
    if (params.id) {
      fetchProduct(params.id as string);
    }
  }, [params.id]);

  const fetchProduct = async (id: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/products/${id}`);
      const data = await response.json();
      
      if (response.ok) {
        setProduct(data);
      } else {
        console.error('获取商品详情失败:', data.error);
      }
    } catch (error) {
      console.error('获取商品详情失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return `¥${price.toLocaleString()}`;
  };

  // 处理图片
  const formatImages = (images: string | undefined | null, productData: ProductDetail) => {
    // 确保images是字符串类型
    if (!images || typeof images !== 'string') {
      return []; // 没有图片时返回空数组
    }
    
    try {
      // 尝试解析JSON字符串
      const imageArray = JSON.parse(images);
      // 验证是否为有效的数组且有元素
      if (Array.isArray(imageArray) && imageArray.length > 0) {
        // 过滤出有效的URL字符串
        const validImages = imageArray.filter(img => typeof img === 'string' && img.trim());
        return validImages.length > 0 ? validImages : [];
      }
    } catch {
      // JSON解析失败，检查是否已经是一个URL字符串
      if (images.trim().startsWith('http')) {
        return [images];
      }
    }
    
    // 没有有效图片时返回空数组
    return [];
  };

  // 处理图片上传
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0 && product) {
      setUploading(true);
      setUploadMessage('上传中...');
      
      try {
        const formData = new FormData();
        formData.append('file', files[0]);
        
        const response = await fetch(`/api/products/${product.id}/upload`, {
          method: 'POST',
          body: formData,
        });
        
        const data = await response.json();
        
        if (response.ok) {
          setUploadMessage('上传成功！');
          // 重新获取商品详情以更新图片
          await fetchProduct(product.id.toString());
          // 重置当前图片索引
          setCurrentImageIndex(0);
        } else {
          setUploadMessage(data.error || '上传失败，请重试');
        }
      } catch (error) {
        console.error('上传图片失败:', error);
        setUploadMessage('上传失败，请重试');
      } finally {
        setUploading(false);
        // 3秒后清除消息
        setTimeout(() => setUploadMessage(null), 3000);
        // 重置文件输入
        e.target.value = '';
      }
    }
  };
  
  // 处理图片加载失败的函数
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    // 图片加载失败时显示上传按钮
    const img = e.currentTarget;
    const container = img.parentElement;
    if (container) {
      img.style.display = 'none';
      const uploadContainer = document.createElement('div');
      uploadContainer.className = 'w-full h-full bg-gray-100 flex flex-col items-center justify-center';
      uploadContainer.innerHTML = `
        <label class="cursor-pointer flex flex-col items-center justify-center w-full h-full hover:bg-gray-200 transition-colors">
          <Upload class="h-12 w-12 text-gray-400 mb-3" />
          <span class="text-sm text-gray-500">点击上传图片</span>
        </label>
      `;
      container.appendChild(uploadContainer);
    }
  };

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star 
        key={i} 
        className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
      />
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">加载商品详情中...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">商品不存在</h2>
          <p className="text-gray-600 mb-4">该商品可能已被删除或不存在</p>
          <Button onClick={() => router.back()} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回
          </Button>
        </div>
      </div>
    );
  }

  const images = formatImages(product.images, product);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部导航 */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                返回
              </Button>
              <Link href="/" className="text-2xl font-bold text-indigo-600 flex items-center gap-2">
                <Sparkles className="h-6 w-6" />
                智能二手市场
              </Link>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Heart className="h-4 w-4 mr-2" />
                收藏
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                分享
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 商品图片 */}
          <div className="space-y-4">
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="aspect-square bg-gray-100 relative">
                  {images.length > 0 ? (
                    <div className="relative">
                      <img
                        src={images[currentImageIndex]}
                        alt={product.title}
                        className="w-full h-full object-cover"
                        onError={handleImageError}
                      />
                      {/* 上传新图片按钮（覆盖层） */}
                      <input
                        type="file"
                        id="upload-product-image"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploading}
                        className="hidden"
                      />
                      <label
                        htmlFor="upload-product-image"
                        className="absolute bottom-4 right-4 bg-indigo-600 text-white p-2 rounded-full cursor-pointer hover:bg-indigo-700 transition-colors"
                        title="上传新图片"
                      >
                        <Upload className="h-5 w-5" />
                      </label>
                    </div>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center">
                      <input
                        type="file"
                        id="upload-product-image"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploading}
                        className="hidden"
                      />
                      <label
                        htmlFor="upload-product-image"
                        className="cursor-pointer flex flex-col items-center justify-center w-full h-full hover:bg-gray-200 transition-colors"
                      >
                        <Upload className="h-12 w-12 text-gray-400 mb-3" />
                        <span className="text-sm text-gray-500">点击上传图片</span>
                      </label>
                    </div>
                  )}
                </div>
              </CardContent>
              {/* 上传状态提示 */}
              {uploadMessage && (
                <div className={`px-4 py-2 ${uploadMessage.includes('成功') ? 'bg-green-50 text-green-700' : uploadMessage.includes('中') ? 'bg-blue-50 text-blue-700' : 'bg-red-50 text-red-700'}`}>
                  <div className="flex items-center justify-between">
                    <span>{uploadMessage}</span>
                    {uploading && (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current ml-2"></div>
                    )}
                  </div>
                </div>
              )}
            </Card>
            {images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      currentImageIndex === index ? 'border-indigo-500' : 'border-gray-200'
                    }`}
                  >
                    <img 
                      src={image} 
                      alt={`${product.title} ${index + 1}`} 
                      className="w-full h-full object-cover" 
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 商品信息 */}
          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <Badge variant="outline" className="mb-2">
                    {product.categoryName}
                  </Badge>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.title}</h1>
                  <p className="text-gray-600">{product.description}</p>
                </div>
                <Badge variant={product.status === 'available' ? 'default' : 'secondary'}>
                  {product.status === 'available' ? '在售' : '已售'}
                </Badge>
              </div>

              <div className="flex items-center space-x-4 mb-4">
                <Badge variant="secondary">{product.brand}</Badge>
                <Badge variant="outline">{product.model}</Badge>
                <Badge variant="outline">{product.condition}</Badge>
              </div>

              {/* 价格信息 */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Tag className="h-5 w-5" />
                    价格信息
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-medium">售价</span>
                      <span className="text-3xl font-bold text-indigo-600">
                        {formatPrice(product.userPrice)}
                      </span>
                    </div>
                    
                    {product.aiEstimatedPrice && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 flex items-center gap-1">
                          <Sparkles className="h-4 w-4" />
                          AI估价
                        </span>
                        <span className="text-lg font-medium text-green-600">
                          {formatPrice(product.aiEstimatedPrice)}
                        </span>
                      </div>
                    )}
                    
                    {product.originalPrice && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">原价</span>
                        <span className="text-lg text-gray-400 line-through">
                          {formatPrice(product.originalPrice)}
                        </span>
                      </div>
                    )}

                    {product.originalPrice && (
                      <div className="text-sm text-green-600">
                        节省 {formatPrice(product.originalPrice - product.userPrice)} 
                        ({Math.round((1 - product.userPrice / product.originalPrice) * 100)}% 折扣)
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* AI定价分析 */}
              {product.pricingFactors && (
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      AI定价分析
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">品牌价值</span>
                          <span className="text-sm font-medium">
                            {product.pricingFactors.brandValue.toFixed(1)}/10
                          </span>
                        </div>
                        <Progress 
                          value={product.pricingFactors.brandValue * 10} 
                          className="h-2"
                        />
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">市场需求</span>
                          <span className="text-sm font-medium">
                            {product.pricingFactors.marketDemand.toFixed(1)}/10
                          </span>
                        </div>
                        <Progress 
                          value={product.pricingFactors.marketDemand * 10} 
                          className="h-2"
                        />
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">成色评分</span>
                          <span className="text-sm font-medium">
                            {product.pricingFactors.conditionScore.toFixed(1)}/10
                          </span>
                        </div>
                        <Progress 
                          value={product.pricingFactors.conditionScore * 10} 
                          className="h-2"
                        />
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">功能完整性</span>
                          <span className="text-sm font-medium">
                            {product.pricingFactors.functionalityScore.toFixed(1)}/10
                          </span>
                        </div>
                        <Progress 
                          value={product.pricingFactors.functionalityScore * 10} 
                          className="h-2"
                        />
                      </div>
                      
                      <div className="pt-2 border-t">
                        <div className="flex items-center justify-between">
                          <span className="text-sm flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            使用时长
                          </span>
                          <span className="text-sm font-medium">
                            {product.pricingFactors.usageDuration} 个月
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* 操作按钮 */}
              <div className="space-y-4">
                <Button 
                  size="lg" 
                  className="w-full bg-indigo-600 hover:bg-indigo-700"
                  disabled={product.status !== 'available'}
                >
                  <MessageCircle className="h-5 w-5 mr-2" />
                  {product.status === 'available' ? '联系卖家' : '商品已售出'}
                </Button>
                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" size="lg">
                    <Heart className="h-5 w-5 mr-2" />
                    收藏
                  </Button>
                  <Button variant="outline" size="lg">
                    <Share2 className="h-5 w-5 mr-2" />
                    分享
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 卖家信息 */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              卖家信息
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 bg-gray-300 rounded-full flex items-center justify-center">
                {product.sellerAvatar ? (
                  <img 
                    src={product.sellerAvatar} 
                    alt={product.sellerName} 
                    className="h-12 w-12 rounded-full object-cover" 
                  />
                ) : (
                  <User className="h-6 w-6 text-gray-600" />
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-medium">{product.sellerName}</h3>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    发布于 {new Date(product.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <Button variant="outline">
                查看更多商品
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 商品评价 */}
        {product.reviews.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  商品评价 ({product.reviewCount})
                </span>
                <div className="flex items-center gap-2">
                  <div className="flex">{renderStars(Math.round(product.averageRating))}</div>
                  <span className="text-sm text-gray-500">
                    {product.averageRating.toFixed(1)}
                  </span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {product.reviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-200 last:border-0 pb-4 last:pb-0">
                    <div className="flex items-start space-x-4">
                      <div className="h-10 w-10 bg-gray-300 rounded-full flex items-center justify-center">
                        {review.userAvatar ? (
                          <img 
                            src={review.userAvatar} 
                            alt={review.userName} 
                            className="h-10 w-10 rounded-full object-cover" 
                          />
                        ) : (
                          <User className="h-5 w-5 text-gray-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{review.userName}</h4>
                          <span className="text-sm text-gray-500">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex">{renderStars(review.rating)}</div>
                          <span className="text-sm text-gray-600">{review.rating}分</span>
                        </div>
                        <p className="text-gray-700">{review.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}