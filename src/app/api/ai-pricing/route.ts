import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { products, pricingFactors } from '@/db/schema';
import { eq } from 'drizzle-orm';

// AI定价算法接口
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      productId,
      brand,
      model,
      condition,
      originalPrice,
      usageDuration, // 使用时间（月数）
      category,
    } = body;

    // 基础品牌价值评分映射
    const brandValueMap: Record<string, number> = {
      'Apple': 9.5,
      'Samsung': 7.8,
      'Huawei': 7.0,
      'Xiaomi': 5.8,
      'OnePlus': 6.5,
      'Google': 7.2,
      'Sony': 8.2,
      'Canon': 8.5,
      'Nikon': 8.2,
      'Nintendo': 8.0,
      'Microsoft': 8.2,
      'Dell': 6.5,
      'HP': 4.5,
      'Lenovo': 7.2,
      'IKEA': 6.0,
      'Herman Miller': 8.8,
      'Nike': 7.5,
      'Adidas': 7.3,
      'Coach': 8.0,
      'Levi\'s': 6.8,
    };

    // 成色评分映射
    const conditionScoreMap: Record<string, number> = {
      '全新': 9.8,
      '九成新': 8.5,
      '八成新': 7.2,
      '七成新': 5.8,
      '六成新': 4.5,
    };

    // 获取品牌价值
    const brandValue = brandValueMap[brand] || 5.0;
    
    // 获取成色评分
    const conditionScore = conditionScoreMap[condition] || 5.0;
    
    // 计算市场供需评分（基于类别和品牌的简化算法）
    let marketDemand = 5.0;
    if (category === '电子产品') {
      marketDemand = brandValue > 8 ? 8.5 : 6.5;
    } else if (category === '家具家居') {
      marketDemand = 6.0;
    } else if (category === '服装配饰') {
      marketDemand = brandValue > 7 ? 7.5 : 5.5;
    }
    
    // 使用时间对功能评分的影响
    let functionalityScore = 9.0;
    if (usageDuration > 24) functionalityScore = 6.5;
    else if (usageDuration > 12) functionalityScore = 7.8;
    else if (usageDuration > 6) functionalityScore = 8.5;
    
    // AI定价算法
    const depreciationRate = calculateDepreciationRate(usageDuration, category);
    const brandMultiplier = (brandValue / 10) * 1.2;
    const conditionMultiplier = conditionScore / 10;
    const demandMultiplier = (marketDemand / 10) * 1.1;
    const functionalityMultiplier = functionalityScore / 10;
    
    // 综合评分
    const overallScore = (brandMultiplier + conditionMultiplier + demandMultiplier + functionalityMultiplier) / 4;
    
    // 计算AI估价
    const basePrice = originalPrice * (1 - depreciationRate);
    const aiEstimatedPrice = Math.round(basePrice * overallScore * 100) / 100;
    
    // 价格区间建议（±10%）
    const priceRange = {
      min: Math.round(aiEstimatedPrice * 0.9 * 100) / 100,
      max: Math.round(aiEstimatedPrice * 1.1 * 100) / 100,
      recommended: aiEstimatedPrice,
    };
    
    // 保存定价因素到数据库
    if (productId) {
      await db.insert(pricingFactors).values({
        productId,
        brandValue,
        marketDemand,
        conditionScore,
        usageDuration,
        functionalityScore,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      
      // 更新商品的AI估价
      await db
        .update(products)
        .set({
          aiEstimatedPrice,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(products.id, productId));
    }
    
    return NextResponse.json({
      aiEstimatedPrice,
      priceRange,
      factors: {
        brandValue,
        marketDemand,
        conditionScore,
        usageDuration,
        functionalityScore,
        overallScore,
      },
      explanation: generatePricingExplanation({
        brandValue,
        conditionScore,
        marketDemand,
        functionalityScore,
        usageDuration,
        aiEstimatedPrice,
        originalPrice,
      }),
    });
  } catch (error) {
    console.error('AI定价失败:', error);
    return NextResponse.json(
      { error: 'AI定价失败' },
      { status: 500 }
    );
  }
}

// 计算折旧率
function calculateDepreciationRate(usageDuration: number, category: string): number {
  let baseDepreciation = 0;
  
  // 不同类别的基础折旧率
  const categoryDepreciationRates: Record<string, number> = {
    '电子产品': 0.15, // 电子产品折旧较快
    '家具家居': 0.08, // 家具折旧较慢
    '服装配饰': 0.25, // 服装折旧很快
    '图书文具': 0.20, // 图书中等折旧
    '运动器材': 0.12, // 运动器材中等折旧
  };
  
  baseDepreciation = categoryDepreciationRates[category] || 0.15;
  
  // 基于使用时间计算折旧
  const monthlyDepreciation = baseDepreciation / 12; // 每月折旧率
  const totalDepreciation = Math.min(monthlyDepreciation * usageDuration, 0.8); // 最大折旧80%
  
  return totalDepreciation;
}

// 生成定价解释
function generatePricingExplanation(factors: {
  brandValue: number;
  conditionScore: number;
  marketDemand: number;
  functionalityScore: number;
  usageDuration: number;
  aiEstimatedPrice: number;
  originalPrice: number;
}) {
  const depreciationPercent = Math.round((1 - factors.aiEstimatedPrice / factors.originalPrice) * 100);
  
  let explanation = `基于AI智能分析，该商品建议售价为 ¥${factors.aiEstimatedPrice}，较原价折旧 ${depreciationPercent}%。\n\n`;
  
  explanation += "定价分析：\n";
  explanation += `• 品牌价值：${factors.brandValue.toFixed(1)}/10 - ${getBrandValueText(factors.brandValue)}\n`;
  explanation += `• 成色状况：${factors.conditionScore.toFixed(1)}/10 - ${getConditionText(factors.conditionScore)}\n`;
  explanation += `• 市场需求：${factors.marketDemand.toFixed(1)}/10 - ${getDemandText(factors.marketDemand)}\n`;
  explanation += `• 功能完整性：${factors.functionalityScore.toFixed(1)}/10 - ${getFunctionalityText(factors.functionalityScore)}\n`;
  explanation += `• 使用时长：${factors.usageDuration}个月 - ${getUsageText(factors.usageDuration)}\n`;
  
  return explanation;
}

function getBrandValueText(score: number): string {
  if (score >= 9) return "顶级品牌，保值性强";
  if (score >= 8) return "知名品牌，市场认可度高";
  if (score >= 6) return "中档品牌，性价比不错";
  return "普通品牌，价格实惠";
}

function getConditionText(score: number): string {
  if (score >= 9) return "成色极佳，几乎全新";
  if (score >= 8) return "成色良好，轻微使用痕迹";
  if (score >= 6) return "成色一般，有明显使用痕迹";
  return "成色较差，需要维修或更新";
}

function getDemandText(score: number): string {
  if (score >= 8) return "市场需求旺盛，易于出售";
  if (score >= 6) return "市场需求正常，出售难度适中";
  return "市场需求较低，可能需要降价";
}

function getFunctionalityText(score: number): string {
  if (score >= 9) return "功能完好，无任何问题";
  if (score >= 8) return "功能基本完好，偶有小问题";
  if (score >= 6) return "功能正常，但有一些缺陷";
  return "功能受损，需要维修";
}

function getUsageText(months: number): string {
  if (months <= 3) return "使用时间很短，近乎全新";
  if (months <= 12) return "使用时间适中，正常损耗";
  if (months <= 24) return "使用时间较长，有一定损耗";
  return "使用时间很长，损耗较大";
}