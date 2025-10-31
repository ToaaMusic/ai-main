"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowLeft,
  Upload,
  X,
  Sparkles,
  TrendingUp,
  BarChart3,
  Calculator,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';
import Link from 'next/link';

interface Category {
  id: number;
  name: string;
  description: string;
  parentId: number | null;
  children?: Category[];
}

interface AIPricingResult {
  aiEstimatedPrice: number;
  priceRange: {
    min: number;
    max: number;
    recommended: number;
  };
  factors: {
    brandValue: number;
    marketDemand: number;
    conditionScore: number;
    usageDuration: number;
    functionalityScore: number;
    overallScore: number;
  };
  explanation: string;
}

export default function SellPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiPricing, setAiPricing] = useState<AIPricingResult | null>(null);
  const [isPricingLoading, setIsPricingLoading] = useState(false);
  const [showPricingSuggestion, setShowPricingSuggestion] = useState(false);

  // 表单数据
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    brand: '',
    model: '',
    condition: '',
    originalPrice: '',
    userPrice: '',
    categoryId: '',
    usageDuration: '',
    images: [] as string[]
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories?includeChildren=true&parentId=null');
      const data = await response.json();
      setCategories(data || []);
    } catch (error) {
      console.error('获取分类失败:', error);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newImages = Array.from(files).slice(0, 5 - selectedImages.length);
      const imageUrls: string[] = [];
      
      // 使用FileReader创建本地预览URL
      newImages.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            const imageUrl = e.target.result as string;
            // 更新状态，避免在循环中多次调用setState
            setSelectedImages(prev => {
              if (!prev.includes(imageUrl)) {
                const updatedImages = [...prev, imageUrl];
                // 同步更新formData
                setFormData(formData => ({ 
                  ...formData, 
                  images: updatedImages 
                }));
                return updatedImages;
              }
              return prev;
            });
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getAIPricing = async () => {
    if (!formData.brand || !formData.condition || !formData.originalPrice || !formData.usageDuration) {
      alert('请先填写品牌、成色、原价和使用时长信息');
      return;
    }

    setIsPricingLoading(true);
    try {
      const categoryName = categories
        .find(cat => cat.id.toString() === formData.categoryId)?.name || '';

      const response = await fetch('/api/ai-pricing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brand: formData.brand,
          condition: formData.condition,
          originalPrice: parseFloat(formData.originalPrice),
          usageDuration: parseInt(formData.usageDuration),
          category: categoryName,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setAiPricing(data);
        setFormData(prev => ({ 
          ...prev, 
          userPrice: data.priceRange.recommended.toString() 
        }));
        setShowPricingSuggestion(true);
      } else {
        alert('AI定价失败: ' + data.error);
      }
    } catch (error) {
      console.error('AI定价失败:', error);
      alert('AI定价失败，请稍后重试');
    } finally {
      setIsPricingLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.userPrice || !formData.categoryId) {
      alert('请填写必填字段');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          originalPrice: parseFloat(formData.originalPrice) || null,
          userPrice: parseFloat(formData.userPrice),
          categoryId: parseInt(formData.categoryId),
          sellerId: 1, // 固定卖家ID，实际应用中应该从用户会话获取
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert('商品发布成功！');
        router.push(`/products/${data.id}`);
      } else {
        alert('发布失败: ' + data.error);
      }
    } catch (error) {
      console.error('发布商品失败:', error);
      alert('发布失败，请稍后重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatPrice = (price: number) => {
    return `¥${price.toLocaleString()}`;
  };

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
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">发布商品</h1>
          <p className="text-gray-600">使用AI智能定价，让你的商品更具竞争力</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 主要表单 */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 基本信息 */}
              <Card>
                <CardHeader>
                  <CardTitle>基本信息</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="title">商品标题 *</Label>
                    <Input
                      id="title"
                      placeholder="请输入商品标题，简洁明了地描述商品"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">商品描述</Label>
                    <Textarea
                      id="description"
                      placeholder="详细描述商品的特点、使用情况、购买时间等"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      rows={4}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="brand">品牌 *</Label>
                      <Input
                        id="brand"
                        placeholder="如：Apple、Samsung、Sony等"
                        value={formData.brand}
                        onChange={(e) => handleInputChange('brand', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="model">型号</Label>
                      <Input
                        id="model"
                        placeholder="商品型号或具体规格"
                        value={formData.model}
                        onChange={(e) => handleInputChange('model', e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="category">商品分类 *</Label>
                    <Select value={formData.categoryId} onValueChange={(value) => handleInputChange('categoryId', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="选择商品分类" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id.toString()}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* 商品状况 */}
              <Card>
                <CardHeader>
                  <CardTitle>商品状况</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="condition">成色 *</Label>
                    <Select value={formData.condition} onValueChange={(value) => handleInputChange('condition', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="选择商品成色" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="全新">全新</SelectItem>
                        <SelectItem value="九成新">九成新</SelectItem>
                        <SelectItem value="八成新">八成新</SelectItem>
                        <SelectItem value="七成新">七成新</SelectItem>
                        <SelectItem value="六成新">六成新</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="originalPrice">原价</Label>
                      <Input
                        id="originalPrice"
                        type="number"
                        placeholder="购买时的价格"
                        value={formData.originalPrice}
                        onChange={(e) => handleInputChange('originalPrice', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="usageDuration">使用时长（月）*</Label>
                      <Input
                        id="usageDuration"
                        type="number"
                        placeholder="使用了多少个月"
                        value={formData.usageDuration}
                        onChange={(e) => handleInputChange('usageDuration', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 商品图片 */}
              <Card>
                <CardHeader>
                  <CardTitle>商品图片</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {selectedImages.map((image, index) => (
                        <div key={index} className="relative group">
                          <img 
                            src={image} 
                            alt={`商品图片 ${index + 1}`} 
                            className="w-full h-32 object-cover rounded-lg border"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                      {selectedImages.length < 5 && (
                        <label className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-indigo-400 transition-colors">
                          <Upload className="h-8 w-8 text-gray-400 mb-2" />
                          <span className="text-sm text-gray-500">上传图片</span>
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageUpload}
                          />
                        </label>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">
                      最多可上传5张图片，建议上传高清图片以获得更好的展示效果
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* 定价 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="h-5 w-5" />
                    商品定价
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <Label htmlFor="userPrice">售价 *</Label>
                      <Input
                        id="userPrice"
                        type="number"
                        placeholder="你希望的售价"
                        value={formData.userPrice}
                        onChange={(e) => handleInputChange('userPrice', e.target.value)}
                        required
                      />
                    </div>
                    <Button 
                      type="button"
                      variant="outline"
                      onClick={getAIPricing}
                      disabled={isPricingLoading}
                      className="self-end"
                    >
                      {isPricingLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600 mr-2"></div>
                          分析中...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4 mr-2" />
                          AI智能定价
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* 提交按钮 */}
              <div className="flex justify-end space-x-4">
                <Button type="button" variant="outline" onClick={() => router.back()}>
                  取消
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      发布中...
                    </>
                  ) : (
                    '发布商品'
                  )}
                </Button>
              </div>
            </form>
          </div>

          {/* AI定价建议侧边栏 */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* AI定价结果 */}
              {aiPricing && showPricingSuggestion && (
                <Card className="border-indigo-200 bg-indigo-50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-indigo-700">
                      <Sparkles className="h-5 w-5" />
                      AI定价建议
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-indigo-600">
                        {formatPrice(aiPricing.priceRange.recommended)}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        建议售价区间: {formatPrice(aiPricing.priceRange.min)} - {formatPrice(aiPricing.priceRange.max)}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>品牌价值</span>
                          <span>{aiPricing.factors.brandValue.toFixed(1)}/10</span>
                        </div>
                        <Progress value={aiPricing.factors.brandValue * 10} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>市场需求</span>
                          <span>{aiPricing.factors.marketDemand.toFixed(1)}/10</span>
                        </div>
                        <Progress value={aiPricing.factors.marketDemand * 10} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>成色评分</span>
                          <span>{aiPricing.factors.conditionScore.toFixed(1)}/10</span>
                        </div>
                        <Progress value={aiPricing.factors.conditionScore * 10} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>功能完整性</span>
                          <span>{aiPricing.factors.functionalityScore.toFixed(1)}/10</span>
                        </div>
                        <Progress value={aiPricing.factors.functionalityScore * 10} className="h-2" />
                      </div>
                    </div>

                    <div className="text-sm text-gray-600 bg-white p-3 rounded-lg">
                      {aiPricing.explanation}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* 发布提示 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info className="h-5 w-5" />
                    发布提示
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-600">
                      使用真实高清图片，展示商品细节
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-600">
                      详细描述商品状况和使用情况
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-600">
                      参考AI定价建议，合理设定价格
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-600">
                      诚信交易，如实描述商品信息
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}