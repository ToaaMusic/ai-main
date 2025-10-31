"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, Plus, TrendingUp, Eye, Heart, ShoppingCart, Sparkles, Upload } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Product {
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
}

interface Category {
  id: number;
  name: string;
  description: string;
  parentId: number | null;
  children?: Category[];
}

export default function HomePage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [currentPage, selectedCategory, sortBy]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '12',
        sortBy,
        sortOrder: sortBy === 'price' ? 'asc' : 'desc',
      });

      if (selectedCategory) {
        params.append('category', selectedCategory);
      }

      if (searchTerm) {
        params.append('search', searchTerm);
      }

      const response = await fetch(`/api/products?${params}`);
      const data = await response.json();
      
      if (response.ok) {
        setProducts(data.products || []);
      }
    } catch (error) {
      console.error('获取商品失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories?includeChildren=true&parentId=null');
      const data = await response.json();
      setCategories(data || []);
    } catch (error) {
      console.error('获取分类失败:', error);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchProducts();
  };

  const formatPrice = (price: number) => {
    return `¥${price.toLocaleString()}`;
  };

  // 处理图片
  const formatImages = (images: string | undefined | null, product: Product) => {
    // 确保images是字符串类型
    if (!images || typeof images !== 'string') {
      return null; // 没有图片时返回null
    }
    
    try {
      // 尝试解析JSON字符串
      const imageArray = JSON.parse(images);
      // 验证是否为有效的数组且有元素
      if (Array.isArray(imageArray) && imageArray.length > 0) {
        // 验证第一个元素是否为有效的URL字符串
        const firstImage = imageArray[0];
        if (typeof firstImage === 'string' && firstImage.trim()) {
          return firstImage;
        }
      }
    } catch {
      // JSON解析失败，检查是否已经是一个URL字符串
      if (images.trim().startsWith('http')) {
        return images;
      }
    }
    
    // 没有有效图片时返回null
    return null;
  };

  // 处理图片上传
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, productId: number) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      // 在实际应用中，这里应该上传图片到服务器
      // 这里我们使用模拟的方式，直接调用更新商品图片的API
      console.log(`上传图片到商品ID: ${productId}`, files);
      
      // 模拟上传成功，重新获取商品列表
      fetchProducts();
      
      // 重置文件输入
      e.target.value = '';
    }
  };
  
  // 获取商品分类相关的占位图片（仅用于商品发布页面的预览）
  const getCategoryPlaceholderImage = (categoryName: string) => {
    const lowerCategory = categoryName.toLowerCase();
    
    if (lowerCategory.includes('电子')) {
      return '/placeholder-electronics.jpg';
    } else if (lowerCategory.includes('服装') || lowerCategory.includes('服饰')) {
      return '/placeholder-clothing.jpg';
    } else if (lowerCategory.includes('家具')) {
      return '/placeholder-furniture.jpg';
    } else if (lowerCategory.includes('健身') || lowerCategory.includes('运动')) {
      return '/placeholder-fitness.jpg';
    } else if (lowerCategory.includes('图书') || lowerCategory.includes('书籍')) {
      return '/placeholder-books.jpg';
    } else {
      return '/placeholder-product.jpg';
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
          <Upload class="h-8 w-8 text-gray-400 mb-2" />
          <span class="text-sm text-gray-500">点击上传图片</span>
        </label>
      `;
      container.appendChild(uploadContainer);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* 头部导航 */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-indigo-600 flex items-center gap-2">
                <Sparkles className="h-6 w-6" />
                智能二手市场
              </h1>
              <nav className="hidden md:flex space-x-6">
                <Link href="/" className="text-gray-900 hover:text-indigo-600">
                  首页
                </Link>
                <Link href="/sell" className="text-gray-600 hover:text-indigo-600">
                  发布商品
                </Link>
                <Link href="/analytics" className="text-gray-600 hover:text-indigo-600">
                  数据分析
                </Link>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                onClick={() => router.push('/sell')}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                发布商品
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* 主要内容 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 搜索和筛选区域 */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="搜索商品、品牌或型号..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-10"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="选择分类" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="排序方式" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="createdAt">最新发布</SelectItem>
                  <SelectItem value="price">价格排序</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleSearch} className="bg-indigo-600 hover:bg-indigo-700">
                <Search className="h-4 w-4 mr-2" />
                搜索
              </Button>
            </div>
          </div>
        </div>

        {/* 商品网格 */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-0">
                  <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <Card 
                key={product.id} 
                className="group cursor-pointer hover:shadow-lg transition-all duration-200 border-0 shadow-md hover:-translate-y-1"
                onClick={() => router.push(`/products/${product.id}`)}
              >
                <CardContent className="p-0">
                  <div className="relative overflow-hidden rounded-t-lg">
                    {formatImages(product.images, product) ? (
                      <img
                  src={formatImages(product.images, product) || ''}
                  alt={product.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
                  onError={handleImageError}
                />
                    ) : (
                      <div className="w-full h-48 bg-gray-100 flex flex-col items-center justify-center">
                        <input
                          type="file"
                          id={`upload-${product.id}`}
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, product.id)}
                          className="hidden"
                        />
                        <label
                          htmlFor={`upload-${product.id}`}
                          className="cursor-pointer flex flex-col items-center justify-center w-full h-full hover:bg-gray-200 transition-colors"
                        >
                          <Upload className="h-8 w-8 text-gray-400 mb-2" />
                          <span className="text-sm text-gray-500">点击上传图片</span>
                        </label>
                      </div>
                    )}
                    <div className="absolute top-2 right-2">
                      <Badge 
                        variant={product.status === 'available' ? 'default' : 'secondary'}
                        className={product.status === 'available' ? 'bg-green-500' : ''}
                      >
                        {product.status === 'available' ? '在售' : '已售'}
                      </Badge>
                    </div>
                    <div className="absolute top-2 left-2">
                      <Badge variant="outline" className="bg-white/90">
                        {product.condition}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2">
                      {product.title}
                    </h3>
                    <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-indigo-600">
                          {formatPrice(product.userPrice)}
                        </span>
                        {product.aiEstimatedPrice && (
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <TrendingUp className="h-3 w-3" />
                            AI估价: {formatPrice(product.aiEstimatedPrice)}
                          </div>
                        )}
                      </div>
                      {product.originalPrice && (
                        <div className="text-sm text-gray-400 line-through">
                          原价: {formatPrice(product.originalPrice)}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-between mt-4 pt-3 border-t">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {product.brand}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {product.categoryName}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4 text-gray-400" />
                        <Heart className="h-4 w-4 text-gray-400 hover:text-red-500 cursor-pointer" />
                        <ShoppingCart className="h-4 w-4 text-gray-400 hover:text-indigo-500 cursor-pointer" />
                      </div>
                    </div>
                    <div className="text-xs text-gray-400 mt-2">
                      卖家: {product.sellerName} • {new Date(product.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* 空状态 */}
        {!loading && products.length === 0 && (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="h-32 w-32 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Search className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                没有找到相关商品
              </h3>
              <p className="text-gray-500 mb-6">
                尝试调整搜索条件或浏览其他分类
              </p>
              <Button onClick={() => router.push('/sell')} className="bg-indigo-600 hover:bg-indigo-700">
                <Plus className="h-4 w-4 mr-2" />
                发布第一个商品
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}