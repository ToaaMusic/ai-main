"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  BarChart3,
  PieChart,
  Activity,
  Sparkles,
  Calendar,
  Filter
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface AnalyticsData {
  totalProducts: number;
  totalUsers: number;
  totalTransactions: number;
  totalRevenue: number;
  averagePrice: number;
  priceAccuracy: number;
  categoryStats: Array<{
    name: string;
    count: number;
    percentage: number;
  }>;
  priceRangeStats: Array<{
    range: string;
    count: number;
    percentage: number;
  }>;
  conditionStats: Array<{
    condition: string;
    count: number;
    avgPrice: number;
  }>;
  brandStats: Array<{
    brand: string;
    count: number;
    avgPrice: number;
  }>;
  recentTransactions: Array<{
    id: number;
    productTitle: string;
    dealPrice: number;
    aiEstimatedPrice: number;
    accuracy: number;
    createdAt: string;
  }>;
}

export default function AnalyticsPage() {
  const router = useRouter();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      // 模拟数据，实际应用中应该从API获取
      const mockData: AnalyticsData = {
        totalProducts: 156,
        totalUsers: 42,
        totalTransactions: 89,
        totalRevenue: 245680,
        averagePrice: 2760,
        priceAccuracy: 85.2,
        categoryStats: [
          { name: '电子产品', count: 68, percentage: 43.6 },
          { name: '家具家居', count: 32, percentage: 20.5 },
          { name: '服装配饰', count: 28, percentage: 17.9 },
          { name: '图书文具', count: 18, percentage: 11.5 },
          { name: '运动器材', count: 10, percentage: 6.4 },
        ],
        priceRangeStats: [
          { range: '0-500元', count: 25, percentage: 16.0 },
          { range: '500-1000元', count: 34, percentage: 21.8 },
          { range: '1000-3000元', count: 48, percentage: 30.8 },
          { range: '3000-5000元', count: 28, percentage: 17.9 },
          { range: '5000元以上', count: 21, percentage: 13.5 },
        ],
        conditionStats: [
          { condition: '全新', count: 23, avgPrice: 4280 },
          { condition: '九成新', count: 52, avgPrice: 3150 },
          { condition: '八成新', count: 48, avgPrice: 2240 },
          { condition: '七成新', count: 26, avgPrice: 1680 },
          { condition: '六成新', count: 7, avgPrice: 980 },
        ],
        brandStats: [
          { brand: 'Apple', count: 28, avgPrice: 5420 },
          { brand: 'Samsung', count: 15, avgPrice: 3280 },
          { brand: 'Sony', count: 12, avgPrice: 2890 },
          { brand: 'Nintendo', count: 8, avgPrice: 2150 },
          { brand: 'Canon', count: 6, avgPrice: 8900 },
        ],
        recentTransactions: [
          {
            id: 1,
            productTitle: 'iPhone 15 Pro Max 256GB',
            dealPrice: 8500,
            aiEstimatedPrice: 8200,
            accuracy: 96.5,
            createdAt: '2024-01-15T10:30:00Z'
          },
          {
            id: 2,
            productTitle: 'MacBook Air M2 13寸',
            dealPrice: 7200,
            aiEstimatedPrice: 7450,
            accuracy: 96.6,
            createdAt: '2024-01-14T15:20:00Z'
          },
          {
            id: 3,
            productTitle: 'AirPods Pro 2代',
            dealPrice: 1600,
            aiEstimatedPrice: 1650,
            accuracy: 96.9,
            createdAt: '2024-01-14T09:45:00Z'
          },
        ]
      };

      // 模拟延迟
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAnalyticsData(mockData);
    } catch (error) {
      console.error('获取分析数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return `¥${price.toLocaleString()}`;
  };

  const formatPercentage = (percentage: number) => {
    return `${percentage.toFixed(1)}%`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">加载分析数据中...</p>
        </div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">数据加载失败</h2>
          <p className="text-gray-600 mb-4">无法获取分析数据</p>
          <Button onClick={fetchAnalyticsData} variant="outline">
            重新加载
          </Button>
        </div>
      </div>
    );
  }

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
                <Calendar className="h-4 w-4 mr-2" />
                时间范围
              </Button>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                筛选
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">数据分析</h1>
          <p className="text-gray-600">实时监控平台运营数据和AI定价效果</p>
        </div>

        {/* 核心指标卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">商品总数</p>
                  <p className="text-3xl font-bold text-gray-900">{analyticsData.totalProducts}</p>
                </div>
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Package className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="flex items-center mt-4 text-sm">
                <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                <span className="text-green-600">+12.3%</span>
                <span className="text-gray-600 ml-1">较上月</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">活跃用户</p>
                  <p className="text-3xl font-bold text-gray-900">{analyticsData.totalUsers}</p>
                </div>
                <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="flex items-center mt-4 text-sm">
                <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                <span className="text-green-600">+8.7%</span>
                <span className="text-gray-600 ml-1">较上月</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">成交订单</p>
                  <p className="text-3xl font-bold text-gray-900">{analyticsData.totalTransactions}</p>
                </div>
                <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <ShoppingCart className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <div className="flex items-center mt-4 text-sm">
                <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                <span className="text-green-600">+15.2%</span>
                <span className="text-gray-600 ml-1">较上月</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">交易总额</p>
                  <p className="text-3xl font-bold text-gray-900">{formatPrice(analyticsData.totalRevenue)}</p>
                </div>
                <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
              <div className="flex items-center mt-4 text-sm">
                <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                <span className="text-green-600">+18.9%</span>
                <span className="text-gray-600 ml-1">较上月</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* AI定价效果 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                AI定价效果
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-indigo-600 mb-2">
                    {formatPercentage(analyticsData.priceAccuracy)}
                  </div>
                  <p className="text-gray-600">平均定价准确率</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-600">平均售价</span>
                      <span className="text-sm font-medium">{formatPrice(analyticsData.averagePrice)}</span>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-600">定价偏差</span>
                      <span className="text-sm font-medium text-green-600">±5.2%</span>
                    </div>
                    <Progress value={88} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-600">用户接受率</span>
                      <span className="text-sm font-medium">78.5%</span>
                    </div>
                    <Progress value={78.5} className="h-2" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 分类统计 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                商品分类分布
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.categoryStats.map((category, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-4 h-4 rounded"
                        style={{ 
                          backgroundColor: [
                            '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'
                          ][index % 5]
                        }}
                      />
                      <span className="text-sm font-medium">{category.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{category.count}</div>
                      <div className="text-xs text-gray-500">{formatPercentage(category.percentage)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* 价格区间分布 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                价格区间分布
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.priceRangeStats.map((range, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">{range.range}</span>
                      <span className="text-sm text-gray-600">{range.count}件</span>
                    </div>
                    <Progress value={range.percentage} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 成色统计 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                商品成色分析
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.conditionStats.map((condition, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">{condition.condition}</Badge>
                      <span className="text-sm text-gray-600">{condition.count}件</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{formatPrice(condition.avgPrice)}</div>
                      <div className="text-xs text-gray-500">平均价格</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 热门品牌 */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              热门品牌排行
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {analyticsData.brandStats.map((brand, index) => (
                <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-lg font-semibold text-gray-900">{brand.brand}</div>
                  <div className="text-sm text-gray-600 mb-2">{brand.count}件商品</div>
                  <div className="text-sm font-medium text-indigo-600">{formatPrice(brand.avgPrice)}</div>
                  <div className="text-xs text-gray-500">平均价格</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 最近交易 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              最近交易记录
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{transaction.productTitle}</h4>
                    <p className="text-sm text-gray-600">
                      {new Date(transaction.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right space-y-1">
                    <div className="flex items-center gap-4">
                      <div>
                        <div className="text-sm text-gray-600">成交价</div>
                        <div className="font-medium">{formatPrice(transaction.dealPrice)}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">AI估价</div>
                        <div className="font-medium text-indigo-600">{formatPrice(transaction.aiEstimatedPrice)}</div>
                      </div>
                      <div>
                        <Badge 
                          variant={transaction.accuracy > 95 ? 'default' : 'secondary'}
                          className={transaction.accuracy > 95 ? 'bg-green-500' : ''}
                        >
                          {formatPercentage(transaction.accuracy)} 准确率
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}